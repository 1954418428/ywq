/** 公共工具函数 */

/**
 * 获取媒体资源地址
 * 纯前端版本直接返回原始 URL
 */
export function resolveResourceUrl(url) {
  return url || ''
}

/** 秒 -> mm:ss */
export function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
