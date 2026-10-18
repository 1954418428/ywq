/**
 * 页面布局模式
 *
 * - flex：整页是 flex 列，顶栏占固定高度，只有内容容器滚动（首页 / 活动页）
 * - fixed：顶栏 position: fixed，页面内容跟随文档滚动（详情页）
 *
 * 布局由路由决定（见 ROUTE_META），App 负责把 layout 写到 .app-shell 的 data-layout 上，
 * 具体样式在 app.scss / 页面 scss 中按 [data-layout='fixed'] 覆盖。
 */
export const LAYOUT_FLEX = 'flex'
export const LAYOUT_FIXED = 'fixed'

const ROUTE_META = {
  '/pages/index/index': { layout: LAYOUT_FLEX, tabBar: true },
  '/pages/activity/index': { layout: LAYOUT_FLEX, tabBar: true },
  '/pages/detail/index': { layout: LAYOUT_FIXED, tabBar: false },
  '/pages/user-form/index': { layout: LAYOUT_FLEX, tabBar: false }
}

const DEFAULT_META = { layout: LAYOUT_FLEX, tabBar: false }

export function getRouteMeta(pathname) {
  return ROUTE_META[pathname] || DEFAULT_META
}

/** 是否是已注册的路由（未知路由会重定向到首页） */
export function isKnownRoute(pathname) {
  return Boolean(ROUTE_META[pathname])
}
