import { useId } from 'react'
import './index.scss'

/**
 * 前端模拟水印：使用 SVG pattern 平铺，矩形瓦片随容器宽高自动重复，
 * 长图、短图、视频和全屏预览里都能看到水印。
 *
 * @param {object} props
 * @param {string} props.text 水印文本，例如 `@tb_fzy333`
 */
export default function MediaWatermark({ text }) {
  const rawId = useId()
  const patternId = `media-watermark-${rawId.replace(/:/g, '')}`

  if (!text) return null

  // 瓦片不是正方形；ID 较长时横向加宽，避免文字被瓦片边界裁掉
  const tileWidth = Math.max(200, text.length * 8)

  return (
    <svg className="media-watermark" aria-hidden="true" focusable="false">
      <defs>
        <pattern
          id={patternId}
          width={tileWidth}
          height="100"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-24)"
        >
          <text x="10" y="55" className="media-watermark-text">
            {text}
          </text>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  )
}
