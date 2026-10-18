/**
 * 750 设计稿 px -> rem。
 *
 * 与 Taro 的 pxtransform 行为保持一致：
 * - 1rem = 40 设计 px（750 / 18.75 的常用换算），30px 设计稿 = 0.75rem；
 * - 根字号由 index.html 中的 clamp(20px, 5.3333vw, 24px) 控制，
 *   手机上按视口等比缩放，平板/桌面上封顶 24px，元素不会无限放大；
 * - 只转换声明值，不动 @media 条件里的 px（媒体查询按真实视口宽度判断）。
 */
const PX_PER_REM = 40
const PX_RE = /(-?(?:\d+\.\d+|\d+|\.\d+))px/g

const pxToRem = () => ({
  postcssPlugin: 'design-px-to-rem',
  Declaration(decl) {
    if (!decl.value || !decl.value.includes('px')) return
    // 约定：--fixed- 开头的自定义属性保留 px（1:1 固定尺寸），不参与 rem 换算
    if (decl.prop?.startsWith('--fixed-')) return
    const next = decl.value.replace(PX_RE, (match, value) => {
      const rem = Number(value) / PX_PER_REM
      return `${Number(rem.toFixed(4))}rem`
    })
    if (next !== decl.value) decl.value = next
  }
})
pxToRem.postcss = true

module.exports = {
  plugins: [pxToRem()]
}
