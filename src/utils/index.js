/** 公共工具函数 */

/**
 * 获取媒体资源地址
 * 纯前端版本直接返回原始 URL；接入后端后如需拼接域名，在这里统一处理
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

/** 复制文本（优先 Clipboard API，降级 execCommand），返回是否成功 */
export async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch (error) {
    // 继续走降级方案
  }

  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.top = '-1000px'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const succeeded = document.execCommand('copy')
    document.body.removeChild(textarea)
    return succeeded
  } catch (error) {
    console.error('Failed to copy text.', error)
    return false
  }
}
