/** localStorage 封装（替代 Taro.getStorageSync / Taro.setStorageSync） */

export function getStorage(key, fallback = null) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw == null ? fallback : JSON.parse(raw)
  } catch (error) {
    console.error(`Failed to read storage key "${key}".`, error)
    return fallback
  }
}

export function setStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Failed to write storage key "${key}".`, error)
    return false
  }
}
