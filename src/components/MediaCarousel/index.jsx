import { useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import './index.scss'

/**
 * 媒体轮播：Swiper 的 React 组件（swiper/react）。
 *
 * - 手势滑动、惯性、边界回弹由 Swiper 处理；
 * - 外部通过 index 控制当前页（切换视频/照片 tab、点 tab 回第一张）；
 * - 滑动结束后通过 onSlideChange 回传当前页。
 *
 * @param {object} props
 * @param {Array} props.items
 * @param {number} props.index
 * @param {(index: number) => void} props.onChange
 * @param {(item: any, index: number) => import('react').ReactNode} props.renderItem
 */
export default function MediaCarousel({ items, index, onChange, renderItem }) {
  const swiperRef = useRef(null)

  // 外部 index 变化时驱动 Swiper 切页；滑动产生的 index 变化不会再触发重复切页
  useEffect(() => {
    const swiper = swiperRef.current
    if (!swiper) return
    if (swiper.activeIndex !== index) {
      swiper.slideTo(index)
    }
  }, [index])

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
        onChange(swiper.activeIndex)
      }}
    >
      {items.map((item, itemIndex) => (
        <SwiperSlide key={itemIndex}>{renderItem(item, itemIndex)}</SwiperSlide>
      ))}
    </Swiper>
  )
}
