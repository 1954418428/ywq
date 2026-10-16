/** 公共工具函数 */
import { RESOURCE_BASE_URL } from '../constants'

/**
 * 拼接媒体资源完整地址
 * 后端返回相对路径时自动加上 RESOURCE_BASE_URL，返回完整地址时原样使用
 */
export function resolveResourceUrl(url) {
  if (!url) return ''
  if (/^https?:\/\//.test(url)) return url
  return RESOURCE_BASE_URL + url
}

/** 秒 -> mm:ss */
export function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
