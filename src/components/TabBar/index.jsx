import { NavLink } from 'react-router-dom'
import homeIcon from '../../assets/tabbar/home-active.png'
import homeActiveIcon from '../../assets/tabbar/home.png'
import activityIcon from '../../assets/tabbar/activity.png'
import activityActiveIcon from '../../assets/tabbar/activity-active.png'
import './index.scss'

/** 与原来 src/app.config.js 中的 tabBar 配置保持一致 */
const TABS = [
  {
    path: '/pages/index/index',
    text: '首页',
    icon: homeIcon,
    activeIcon: homeActiveIcon
  },
  {
    path: '/pages/activity/index',
    text: '活动',
    icon: activityIcon,
    activeIcon: activityActiveIcon
  }
]

export default function TabBar() {
  return (
    <nav className="app-tabbar">
      {TABS.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end
          className={({ isActive }) => `app-tabbar-item${isActive ? ' app-tabbar-item-active' : ''}`}
        >
          {({ isActive }) => (
            <>
              <img
                className="app-tabbar-icon"
                src={isActive ? tab.activeIcon : tab.icon}
                alt=""
              />
              <span className="app-tabbar-text">{tab.text}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
