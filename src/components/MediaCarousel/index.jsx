import { useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import './index.scss'

const EDGE_SWIPE_THRESHOLD = 30

/**
 * 媒体轮播：Swiper 的 React 组件（swiper/react）。
 *
 * - 手势滑动、惯性、边界回弹由 Swiper 处理；
 * - 外部通过 index 控制当前页；
 * - 滑动结束后通过 onSlideChange 回传当前页；
 * - 在最后一页继续向左滑触发 onEdgeNext，在第一页继续向右滑触发 onEdgePrev。
 *
 * @param {object} props
 * @param {Array} props.items
 * @param {number} props.index
 * @param {(index: number) => void} props.onChange
 * @param {(item: any, index: number) => import('react').ReactNode} props.renderItem
 * @param {() => void} [props.onEdgeNext]
 * @param {() => void} [props.onEdgePrev]
 */
export default function MediaCarousel({
  items,
  index,
  onChange,
  renderItem,
  onEdgeNext,
  onEdgePrev
}) {
  const swiperRef = useRef(null)
  const callbacksRef = useRef({ onChange, onEdgeNext, onEdgePrev })
  const touchRef = useRef({ startX: null, fromStart: false, fromEnd: false })
  callbacksRef.current = { onChange, onEdgeNext, onEdgePrev }

  // 外部 index 变化时驱动 Swiper 切页；滑动产生的 index 变化不会再触发重复切页
  useEffect(() => {
    const swiper = swiperRef.current
    if (!swiper) return
    if (swiper.activeIndex !== index) {
      swiper.slideTo(index)
    }
  }, [index])

  const handleTouchStart = (swiper, event) => {
    const touch = event?.touches?.[0] || event
    touchRef.current.startX =
      typeof touch?.clientX === 'number' ? touch.clientX : null
    // 只有已经在第一页/最后一页时，才把这次滑动当作“继续滑出边界”
    touchRef.current.fromStart =
      Boolean(callbacksRef.current.onEdgePrev) && Boolean(swiper.isBeginning)
    touchRef.current.fromEnd =
      Boolean(callbacksRef.current.onEdgeNext) && Boolean(swiper.isEnd)
  }

  const handleTouchEnd = (swiper, event) => {
    const touch = event?.changedTouches?.[0] || event?.touches?.[0] || event
    const endX = typeof touch?.clientX === 'number' ? touch.clientX : null
    const { startX, fromStart, fromEnd } = touchRef.current

    touchRef.current = { startX: null, fromStart: false, fromEnd: false }
    if (startX == null || endX == null) return

    const delta = endX - startX
    if (fromEnd && delta < -EDGE_SWIPE_THRESHOLD) {
      callbacksRef.current.onEdgeNext?.()
    } else if (fromStart && delta > EDGE_SWIPE_THRESHOLD) {
      callbacksRef.current.onEdgePrev?.()
    }
  }

  return (
    <Swiper
      className="media-carousel"
      initialSlide={index}
      slidesPerView={1}
      spaceBetween={0}
      speed={320}
      resistanceRatio={0.65}
      // 不拦截 touchstart，保证视频原生控件在移动端可点；横向滑动仍由 Swiper 处理
      touchStartPreventDefault={false}
      onSwiper={(swiper) => {
        swiperRef.current = swiper
      }}
      onSlideChange={(swiper) => {
        callbacksRef.current.onChange?.(swiper.activeIndex)
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {items.map((item, itemIndex) => (
        <SwiperSlide key={itemIndex}>{renderItem(item, itemIndex)}</SwiperSlide>
      ))}
    </Swiper>
  )
}
