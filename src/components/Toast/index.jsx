import { useEffect, useState } from 'react'
import './index.scss'

let notify = null

/**
 * 轻量 Toast（替代 Taro.showToast）
 * @param {string} message
 */
export function toast(message) {
  if (!message) return
  if (notify) notify(String(message))
}

export default function ToastHost() {
  const [message, setMessage] = useState('')
  const [toastKey, setToastKey] = useState(0)

  useEffect(() => {
    notify = (next) => {
      setMessage(next)
      setToastKey((key) => key + 1)
    }
    return () => {
      notify = null
    }
  }, [])

  useEffect(() => {
    if (!message) return undefined
    const timer = setTimeout(() => setMessage(''), 1800)
    return () => clearTimeout(timer)
  }, [message, toastKey])

  if (!message) return null

  return (
    <div className="app-toast" role="status" aria-live="polite">
      {message}
    </div>
  )
}
