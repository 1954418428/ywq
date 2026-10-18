import { useEffect, useRef } from 'react'
import MediaWatermark from '../MediaWatermark'
import './index.scss'

/**
 * 全屏图片预览（替代 Taro.previewImage）
 *
 * @param {object} props
 * @param {string[]} props.images
 * @param {number} props.index 当前索引，-1 表示关闭
 * @param {(index: number) => void} props.onChange
 * @param {() => void} props.onClose
 * @param {string} [props.watermarkText] 预览水印文本
 */
export default function ImagePreview({ images, index, onChange, onClose, watermarkText = '' }) {
  const touchStartX = useRef(0)

  useEffect(() => {
    if (index < 0) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onChange((index - 1 + images.length) % images.length)
      if (event.key === 'ArrowRight') onChange((index + 1) % images.length)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [index, images.length, onChange, onClose])

  if (index < 0 || images.length === 0) return null

  const safeIndex = Math.min(index, images.length - 1)
  const goTo = (offset) => onChange((safeIndex + offset + images.length) % images.length)

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0]?.clientX ?? 0
  }

  const handleTouchEnd = (event) => {
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current
    const delta = endX - touchStartX.current
    if (Math.abs(delta) > 40) goTo(delta < 0 ? 1 : -1)
  }

  return (
    <div
      className="image-preview"
      onClick={onClose}
      onContextMenu={(event) => event.preventDefault()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="image-preview-stage"
        onClick={(event) => event.stopPropagation()}
        onContextMenu={(event) => event.preventDefault()}
        onDragStart={(event) => event.preventDefault()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          className="image-preview-image"
          src={images[safeIndex]}
          alt=""
          draggable={false}
          onDragStart={(event) => event.preventDefault()}
        />
        <MediaWatermark text={watermarkText} />
        <button
          type="button"
          className="image-preview-close"
          aria-label="关闭预览"
          onClick={onClose}
        >
          ✕
        </button>
        {images.length > 1 ? (
          <>
            <button
              type="button"
              className="image-preview-nav image-preview-prev"
              aria-label="上一张"
              onClick={() => goTo(-1)}
            >
              ‹
            </button>
            <button
              type="button"
              className="image-preview-nav image-preview-next"
              aria-label="下一张"
              onClick={() => goTo(1)}
            >
              ›
            </button>
            <span className="image-preview-counter">
              {safeIndex + 1} / {images.length}
            </span>
          </>
        ) : null}
      </div>
    </div>
  )
}
