/**
 * 数据服务（纯前端版本）
 *
 * 默认使用随构建打包的本地快照（src/data/yyq.json），不发起网络请求：
 * 原来的 Supabase 签名地址在部分网络环境下 TLS 会被重置（ERR_CONNECTION_RESET），
 * 导致列表一直是空的。
 *
 * 需要接远端数据时，在 index.html 的入口脚本之前注入地址：
 *   <script>window.__YYQ_DATA_URL__ = 'https://example.com/yyq.json'</script>
 * 远端请求失败会自动回退到本地快照，页面不会白屏。
 */
import bundledData from '../data/yyq.json'
import { DEFAULT_PAGE_SIZE } from '../constants'
import { getStorage, setStorage } from '../utils/storage'

const REMOTE_DATA_URL =
  (typeof window !== 'undefined' && window.__YYQ_DATA_URL__) || ''

const LOCAL_DATA = bundledData

const DATA_CACHE_KEY = 'yyq-data-cache'
const DATA_CACHE_TTL = 24 * 60 * 60 * 1000

let dataPromise
let dataFetchedAt = 0

function isValidData(data) {
  return Boolean(
    data &&
    typeof data.version === 'string' &&
    Array.isArray(data.persons) &&
    data.persons.every((person) => (
      person &&
      typeof person.id === 'string' &&
      typeof person.nickname === 'string' &&
      typeof person.provinceId === 'number'
    )) &&
    Array.isArray(data.activities) &&
    data.activities.every((activity) => (
      activity &&
      typeof activity.id === 'string' &&
      typeof activity.title === 'string'
    ))
  )
}

function readCachedData() {
  const cached = getStorage(DATA_CACHE_KEY)
  if (
    cached &&
    Number.isFinite(cached.fetchedAt) &&
    cached.fetchedAt <= Date.now() &&
    cached.version === cached.data?.version &&
    isValidData(cached.data)
  ) {
    return cached
  }
  return null
}

function cacheData(data) {
  const fetchedAt = Date.now()
  const saved = setStorage(DATA_CACHE_KEY, {
    version: data.version,
    fetchedAt,
    data
  })
  if (!saved) {
    console.error('Failed to cache yyq data.')
  }
  return fetchedAt
}

async function fetchJson(url) {
  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache'
    }
  })
  if (!response.ok) {
    throw new Error(`yyq data request failed: ${response.status}`)
  }
  return response.json()
}

/** 在数据地址上追加时间戳，避免浏览器/CDN 命中旧缓存（兼容带/不带查询参数的地址） */
function buildDataUrl(timestamp) {
  const url = new URL(REMOTE_DATA_URL, window.location.href)
  url.searchParams.set('cacheBust', String(timestamp))
  return url.toString()
}

function getLocalData() {
  if (!isValidData(LOCAL_DATA)) {
    throw new Error('Bundled yyq data has an invalid JSON shape')
  }
  return LOCAL_DATA
}

function getData() {
  // 未配置远端地址：直接使用打包进来的快照（不产生任何数据请求）
  if (!REMOTE_DATA_URL) {
    return Promise.resolve(getLocalData())
  }

  const now = Date.now()
  if (dataPromise && (dataFetchedAt === 0 || now - dataFetchedAt < DATA_CACHE_TTL)) {
    return dataPromise
  }

  const cached = readCachedData()
  if (cached && now - cached.fetchedAt < DATA_CACHE_TTL) {
    dataFetchedAt = cached.fetchedAt
    dataPromise = Promise.resolve(cached.data)
    return dataPromise
  }

  dataFetchedAt = 0
  dataPromise = fetchJson(buildDataUrl(now))
    .then((data) => {
      if (!isValidData(data)) {
        throw new Error('Remote yyq data has an invalid JSON shape')
      }
      dataFetchedAt = cacheData(data)
      return data
    })
    .catch((error) => {
      dataPromise = null
      dataFetchedAt = 0
      console.warn('Failed to load remote yyq data, using bundled snapshot.', error)
      return getLocalData()
    })
  return dataPromise
}

/**
 * 人员列表
 * @param {object} [params]
 * @param {number} [params.page=1]      页码，从 1 开始
 * @param {number} [params.pageSize]    每页数量
 * @param {string} [params.keyword]     昵称关键词搜索
 * @param {number} [params.provinceId]  省份行政区划代码
 * @returns {Promise<{list: Array, total: number, page: number, hasMore: boolean}>}
 *
 * 对接后端示例：return request({ url: '/person/list', data: params })
 */
export async function getPersonList(params = {}) {
  const page = Math.max(1, Number(params.page) || 1)
  const pageSize = Number(params.pageSize) || DEFAULT_PAGE_SIZE

  const keyword = (params.keyword || '').trim()
  const provinceId = Number(params.provinceId) || null
  const { persons } = await getData()
  const filtered = persons.filter((person) => (
    (!keyword || person.nickname.includes(keyword)) &&
    (!provinceId || person.provinceId === provinceId)
  ))
  const start = (page - 1) * pageSize
  const list = filtered.slice(start, start + pageSize)
  return {
    list,
    total: filtered.length,
    page,
    hasMore: start + pageSize < filtered.length
  }
}

/**
 * 人员详情（含图片/视频）
 * 缓存 Promise 本身：并发请求去重（列表页预取与详情页自身请求共享同一个），
 * 已进入过的详情二次进入秒开；失败不缓存，下次进入自动重试
 * @param {string} id 人员 id
 * @returns {Promise<object|null>} 详情数据
 *
 * 对接后端示例：return request({ url: `/person/${id}` })
 */
const detailCache = new Map() // id -> Promise（并发/重复请求去重）
const detailData = new Map() // id -> 已就绪数据（详情页首帧同步直出，避免 loading 闪动）

export async function getPersonDetail(id) {
  if (!id) return null

  let promise = detailCache.get(id)
  if (!promise) {
    promise = getData().then(({ persons }) => {
      const person = persons.find((item) => item.id === id) || null
      if (person) detailData.set(id, person)
      return person
    })
    detailCache.set(id, promise)
    promise.catch(() => detailCache.delete(id))
  }
  return promise
}

/** 同步读取已就绪的详情数据；未就绪返回 null（详情页首帧直出用） */
export function peekPersonDetail(id) {
  return detailData.get(id) || null
}

/**
 * 活动列表
 * @param {object} [params]
 * @param {number} [params.page=1]    页码，从 1 开始
 * @param {number} [params.pageSize]  每页数量
 * @returns {Promise<{list: Array, total: number, page: number, hasMore: boolean}>}
 *
 * 对接后端示例：return request({ url: '/activity/list', data: params })
 */
export async function getActivityList(params = {}) {
  const page = Math.max(1, Number(params.page) || 1)
  const pageSize = Number(params.pageSize) || DEFAULT_PAGE_SIZE

  const { activities: activityData } = await getData()
  const start = (page - 1) * pageSize
  const list = activityData.slice(start, start + pageSize)
  return {
    list,
    total: activityData.length,
    page,
    hasMore: start + pageSize < activityData.length
  }
}
