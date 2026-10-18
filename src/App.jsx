import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import TabBar from './components/TabBar'
import ToastHost from './components/Toast'
import IndexPage from './pages/index'
import ActivityPage from './pages/activity'
import DetailPage from './pages/detail'
import UserFormPage from './pages/user-form'
import { LAYOUT_FLEX, getRouteMeta, isKnownRoute } from './layout'

const INDEX_ROUTE = '/pages/index/index'
const ACTIVITY_ROUTE = '/pages/activity/index'
const DETAIL_ROUTE = '/pages/detail/index'
const USER_FORM_ROUTE = '/pages/user-form/index'

export default function App() {
  const { pathname } = useLocation()
  const { layout, tabBar } = getRouteMeta(pathname)
  const isDetail = pathname === DETAIL_ROUTE
  const isUserForm = pathname === USER_FORM_ROUTE
  const knownRoute = isKnownRoute(pathname)

  // fixed 布局会让文档滚动；回到 flex 页面时把文档滚回顶部，避免露出空白
  useEffect(() => {
    if (layout === LAYOUT_FLEX) {
      window.scrollTo(0, 0)
    }
  }, [layout])

  return (
    <div className="app-shell" data-layout={layout}>
      <main className="app-main">
        {/*
          两个 tab 页常驻挂载（keep-alive），只切换显隐：
          对齐原 Taro 页面栈的行为 —— 进详情再返回时，列表数据、筛选条件和滚动位置都还在。
        */}
        <div className="route-pane" hidden={pathname !== INDEX_ROUTE}>
          <IndexPage />
        </div>
        <div className="route-pane" hidden={pathname !== ACTIVITY_ROUTE}>
          <ActivityPage />
        </div>

        {isDetail ? <DetailPage /> : null}
        {isUserForm ? <UserFormPage /> : null}
        {!knownRoute ? <Navigate to={INDEX_ROUTE} replace /> : null}
      </main>

      {tabBar ? <TabBar /> : null}
      <ToastHost />
    </div>
  )
}
