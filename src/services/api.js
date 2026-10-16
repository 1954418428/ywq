/**
 * 接口定义（预留后端入口）
 * 当前 USE_MOCK=true 时走本地 Mock；后端就绪后将 constants 中 USE_MOCK 置为 false，
 * 并按下方注释的路径与后端约定对齐即可，页面代码无需改动
 */
import { USE_MOCK, MOCK_DELAY, DEFAULT_PAGE_SIZE } from '../constants'
import { request } from './request'
import { mockPersons, mockDetails, mockActivities } from '../data/mock'

/** 模拟网络延迟（MOCK_DELAY=0 时立即返回，不产生额外等待） */
function delay(ms = MOCK_DELAY) {
  if (!ms) return Promise.resolve()
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 人员列表
 * @param {object} [params]
 * @param {number} [params.page=1]      页码，从 1 开始
 * @param {number} [params.pageSize]    每页数量
 * @param {string} [params.keyword]     姓名/职业关键词搜索
 * @returns {Promise<{list: Array, total: number, page: number, hasMore: boolean}>}
 *
 * 对接后端示例：return request({ url: '/person/list', data: params })
 */
export async function getPersonList(params = {}) {
  const page = Math.max(1, Number(params.page) || 1)
  const pageSize = Number(params.pageSize) || DEFAULT_PAGE_SIZE

  if (!USE_MOCK) {
    return request({ url: '/person/list', data: { ...params, page, pageSize } })
  }

  await delay()
  const keyword = (params.keyword || '').trim()
  const filtered = keyword
    ? mockPersons.filter(
        (p) =>
          p.name.includes(keyword) || (p.occupation || '').includes(keyword)
      )
    : mockPersons
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
 * 人员详情（含图片/视频/音频）
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
    p = (!USE_MOCK
      ? request({ url: `/person/${id}` })
      : delay().then(() => mockDetails[id] || null)
    ).then((data) => {
      if (data) detailData.set(id, data)
      return data
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

  if (!USE_MOCK) {
    return request({ url: '/activity/list', data: { ...params, page, pageSize } })
  }

  await delay()
  const start = (page - 1) * pageSize
  const list = mockActivities.slice(start, start + pageSize)
  return {
    list,
    total: mockActivities.length,
    page,
    hasMore: start + pageSize < mockActivities.length
  }
}
