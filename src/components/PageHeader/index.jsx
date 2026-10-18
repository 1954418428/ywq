import { useNavigate } from 'react-router-dom'
import './index.scss'

/**
 * 页面顶部导航栏（替代 Taro 内置 navigationBar）
 * @param {object} props
 * @param {string} props.title 标题
 * @param {boolean} [props.back] 是否显示返回按钮
 */
export default function PageHeader({ title, back = false }) {
  const navigate = useNavigate()

  const goBack = () => {
    // 直接打开详情页（没有站内历史）时回首页，避免退出站点
    const historyIndex = window.history.state?.idx
    if (typeof historyIndex === 'number' && historyIndex > 0) {
      navigate(-1)
    } else {
      navigate('/pages/index/index', { replace: true })
    }
  }

  return (
    <header className="app-header">
      {back ? (
        <button
          type="button"
          className="app-header-back"
          aria-label="返回"
          onClick={goBack}
        >
          <span className="app-header-back-icon" />
        </button>
      ) : null}
      <h1 className="app-header-title">{title}</h1>
    </header>
  )
}
