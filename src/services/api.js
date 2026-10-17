/**
 * 本地数据服务（纯前端版本）
 * 人员和活动数据从 Supabase 聚合 JSON 加载。
 */
import { DEFAULT_PAGE_SIZE } from '../constants'
import Taro from '@tarojs/taro'

const REMOTE_PERSONS_URL = 'https://lbnegnufjgmuxvblmkxk.supabase.co/storage/v1/object/sign/yuanweiqian/persons.json?token=eyJraWQiOiI2NTRkMjM5NS04ZTg1LTQxMWItOTFiZi1jYzIyNWNhNzE2MGUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJ5dWFud2VpcWlhbi9wZXJzb25zLmpzb24iLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzkyMjM5MDU0LCJleHAiOjE4ODY4NDcwNTR9.hkrsAGvYzLL3rRtq52c0Mb6V251uj5iwDHEBPtV9SJOUcOt2yXANvwUfFQBgrh6bSEVTxG6pwEXQWnd-lUF9OA'

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
  try {
    const cached = Taro.getStorageSync(DATA_CACHE_KEY)
    if (
      cached &&
      Number.isFinite(cached.fetchedAt) &&
      cached.fetchedAt <= Date.now() &&
      cached.version === cached.data.version &&
      isValidData(cached.data)
    ) {
      return cached
    }
  } catch (error) {
    console.error('Failed to read cached yyq data.', error)
  }
  return null
}

function cacheData(data) {
  const fetchedAt = Date.now()
  try {
    Taro.setStorageSync(DATA_CACHE_KEY, {
      version: data.version,
      fetchedAt,
      data
    })
  } catch (error) {
    console.error('Failed to cache yyq data.', error)
  }
  return fetchedAt
}

function getData() {
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
  dataPromise = Taro.request({
    url: `${REMOTE_PERSONS_URL}&cacheBust=${now}`,
    method: 'GET',
    dataType: 'json',
    header: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache'
    },
    cache: 'no-cache'
  })
    .then(({ data, statusCode }) => {
      if (statusCode < 200 || statusCode >= 300) {
        throw new Error(`yyq data request failed: ${statusCode}`)
      }
      if (!isValidData(data)) {
        throw new Error('Remote yyq data has an invalid JSON shape')
      }
      dataFetchedAt = cacheData(data)
      return data
    })
    .catch((error) => {
      dataPromise = null
      dataFetchedAt = 0
      console.error('Failed to load remote yyq data.', error)
      throw error
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
 * @returns {Promise<object>} 详情数据
 *
 * 对接后端示例：return request({ url: `/person/${id}` })
 */
const detailCache = new Map() // id -> Promise（并发/重复请求去重）
const detailData = new Map() // id -> 已就绪数据（详情页首帧同步直出，避免 loading 闪动）

export async function getPersonDetail(id) {
  let p = detailCache.get(id)
  if (!p) {
    p = getData().then(({ persons }) => {
      const person = persons.find((item) => item.id === id) || null
      if (person) detailData.set(id, person)
      return person
    })
    detailCache.set(id, p)
    p.catch(() => detailCache.delete(id))
  }
  return p
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
