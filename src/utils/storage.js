/** localStorage 封装 */

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

/** sessionStorage 封装：按标签页会话生效，关闭标签页后清空 */
export function getSessionStorage(key, fallback = null) {
  try {
    const raw = window.sessionStorage.getItem(key)
    return raw == null ? fallback : JSON.parse(raw)
  } catch (error) {
    console.error(`Failed to read session storage key "${key}".`, error)
    return fallback
  }
}

export function setSessionStorage(key, value) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Failed to write session storage key "${key}".`, error)
    return false
  }
}
