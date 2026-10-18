import { useCallback, useEffect, useRef, useState } from 'react'
import './index.scss'

const MAX_PULL = 120
const THRESHOLD = 64
const RESISTANCE = 0.45

/**
 * 下拉刷新容器（替代 Taro ScrollView 的 refresherEnabled）。
 * 滚动容器本身就是 children 的父节点，children 内不要再套滚动容器。
 *
 * @param {object} props
 * @param {string} [props.className] 附加到滚动容器上的类名（用于 flex / padding 等布局）
 * @param {() => Promise<void>|void} props.onRefresh 触发刷新，resolve 后收起指示器
 * @param {(event: import('react').UIEvent<HTMLDivElement>) => void} [props.onScroll]
 * @param {import('react').ReactNode} props.children
 */
export default function PullToRefresh({ className = '', onRefresh, onScroll, children }) {
  const scrollRef = useRef(null)
  const [pull, setPull] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const pullRef = useRef(0)
  const pullingRef = useRef(false)
  const refreshingRef = useRef(false)
  const onRefreshRef = useRef(onRefresh)

  useEffect(() => {
    onRefreshRef.current = onRefresh
  }, [onRefresh])

  const updatePull = useCallback((value) => {
    pullRef.current = value
    setPull(value)
  }, [])

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return undefined

    let startY = null
    let tracking = false

    const resetTracking = () => {
      startY = null
      tracking = false
      pullingRef.current = false
    }

    const onTouchStart = (event) => {
      if (element.scrollTop > 0 || refreshingRef.current) {
        resetTracking()
        return
      }
      startY = event.touches[0]?.clientY ?? null
      tracking = startY != null
    }

    const onTouchMove = (event) => {
      if (!tracking || startY == null) return
      const currentY = event.touches[0]?.clientY ?? startY
      const delta = currentY - startY
      if (delta <= 0 || element.scrollTop > 0) {
        resetTracking()
        updatePull(0)
        return
      }
      // 阻止浏览器自身的下拉/回弹，交给指示器显示
      event.preventDefault()
      pullingRef.current = true
      updatePull(Math.min(MAX_PULL, delta * RESISTANCE))
    }

    const finish = async () => {
      if (!pullingRef.current) {
        resetTracking()
        return
      }
      resetTracking()
      if (pullRef.current < THRESHOLD) {
        updatePull(0)
        return
      }
      updatePull(THRESHOLD)
      refreshingRef.current = true
      setRefreshing(true)
      try {
        await onRefreshRef.current?.()
      } finally {
        refreshingRef.current = false
        setRefreshing(false)
        updatePull(0)
      }
    }

    element.addEventListener('touchstart', onTouchStart, { passive: true })
    element.addEventListener('touchmove', onTouchMove, { passive: false })
    element.addEventListener('touchend', finish)
    element.addEventListener('touchcancel', finish)

    return () => {
      element.removeEventListener('touchstart', onTouchStart)
      element.removeEventListener('touchmove', onTouchMove)
      element.removeEventListener('touchend', finish)
      element.removeEventListener('touchcancel', finish)
    }
  }, [updatePull])

  const hint = refreshing ? '刷新中...' : pull >= THRESHOLD ? '释放立即刷新' : '下拉刷新'
  const indicatorHeight = refreshing ? THRESHOLD : pull

  return (
    <div ref={scrollRef} className={`ptr-scroll ${className}`.trim()} onScroll={onScroll}>
      <div
        className="ptr-indicator"
        style={{
          height: `${indicatorHeight}px`,
          transition: pullingRef.current ? 'none' : 'height 0.2s ease'
        }}
      >
        <span className="ptr-indicator-text">{hint}</span>
      </div>
      {children}
    </div>
  )
}
