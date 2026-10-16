/**
 * 统一请求封装（预留后端入口）
 * 对接后端时：页面只调用 services/api.js，本文件负责域名、token、错误处理
 */
import Taro from '@tarojs/taro'
import { API_BASE_URL } from '../constants'

/** 请求超时时间 */
const TIMEOUT = 15000

/** 请求拦截：需要登录态时在 header 中补充 token */
function buildHeader(extra = {}) {
  const header = { 'content-type': 'application/json', ...extra }
  // TODO: 对接后端后，从 storage 中读取 token
  // const token = Taro.getStorageSync('token')
  // if (token) header.Authorization = `Bearer ${token}`
  return header
}

/** 统一错误对象 */
function normalizeError(message, data) {
  const err = new Error(message)
  err.data = data
  return err
}

/**
 * 基础请求方法
 * @param {object} options
 * @param {string} options.url    接口路径（不含域名）
 * @param {string} [options.method] 默认 GET
 * @param {object} [options.data]   参数
 * @param {object} [options.header] 额外请求头
 * @returns {Promise<any>} 返回后端 data 字段
 */
export function request({ url, method = 'GET', data, header }) {
  return Taro.request({
    url: API_BASE_URL + url,
    method,
    data,
    header: buildHeader(header),
    timeout: TIMEOUT
  }).then((res) => {
    // HTTP 层错误
    if (res.statusCode < 200 || res.statusCode >= 300) {
      throw normalizeError(`请求失败（${res.statusCode}）`, res.data)
    }
    // 业务层错误：约定 code === 0 为成功，按后端约定调整
    const body = res.data || {}
    if (typeof body.code === 'number' && body.code !== 0) {
      throw normalizeError(body.message || '业务处理失败', body)
    }
    return body.data !== undefined ? body.data : body
  })
}

/** 401 等场景统一跳登录（预留） */
export function handleAuthError() {
  // TODO: 对接后端后实现
}
