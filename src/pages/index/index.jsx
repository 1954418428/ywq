import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PROVINCE_CAPITALS } from '../../constants'
import { getPersonDetail, getPersonList } from '../../services/api'
import PageHeader from '../../components/PageHeader'
import PullToRefresh from '../../components/PullToRefresh'
import SelectionModal from '../../components/SelectionModal'
import { toast } from '../../components/Toast'
import './index.scss'

const PROVINCE_OPTIONS = [
  { provinceId: null, province: '全部' },
  ...PROVINCE_CAPITALS.filter((item) => item.capital === '上海市'),
  ...PROVINCE_CAPITALS.filter((item) => item.capital !== '上海市')
].map(({ provinceId, province }) => ({
  value: provinceId,
  label: province
}))

export default function IndexPage() {
  const navigate = useNavigate()
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [provinceId, setProvinceId] = useState(null)
  const [showCapitalPicker, setShowCapitalPicker] = useState(false)

  const loadingRef = useRef(false)
  const requestIdRef = useRef(0)

  const selectedProvince = PROVINCE_OPTIONS.find((item) => item.value === provinceId)?.label || '全部'

  const load = useCallback(
    async (pageNum = 1, kw = keyword, mode = 'reset', selectedProvinceId = provinceId) => {
      // 上拉加载只允许一个在途请求；重置请求允许覆盖旧请求（用 requestId 丢弃过期结果）
      if (mode === 'append' && loadingRef.current) return
      const requestId = requestIdRef.current + 1
      requestIdRef.current = requestId
      loadingRef.current = true
      setLoading(true)
      try {
        const res = await getPersonList({
          page: pageNum,
          keyword: kw,
          provinceId: selectedProvinceId
        })
        if (requestId !== requestIdRef.current) return
        setList((prev) => (mode === 'append' ? [...prev, ...res.list] : res.list))
        setHasMore(Boolean(res.hasMore))
        setPage(pageNum)
      } catch (error) {
        if (requestId === requestIdRef.current) {
          toast(error.message || '加载失败')
        }
      } finally {
        if (requestId === requestIdRef.current) {
          loadingRef.current = false
          setLoading(false)
        }
      }
    },
    [keyword, provinceId]
  )

  // 关键词或省份筛选变化后重新获取列表（300ms 防抖）
  useEffect(() => {
    const timer = setTimeout(() => {
      load(1, keyword, 'reset', provinceId)
    }, 300)
    return () => clearTimeout(timer)
  }, [keyword, provinceId, load])

  const onRefresh = () => load(1, keyword, 'reset', provinceId)

  const handleScroll = (event) => {
    const element = event.currentTarget
    const distanceToBottom = element.scrollHeight - element.scrollTop - element.clientHeight
    if (distanceToBottom > 120) return
    if (loadingRef.current || !hasMore) return
    load(page + 1, keyword, 'append', provinceId)
  }

  const goDetail = (item) => {
    // 预取详情：请求与路由跳转并行，详情页直接命中缓存，避免转场后再白等 loading
    getPersonDetail(item.id).catch(() => {})
    navigate(`/pages/detail/index?id=${item.id}`)
  }

  return (
    <div className="page">
      <PageHeader title="原味牵" />

      <div className="search-wrap">
        <input
          className="search-input"
          type="text"
          maxLength={20}
          placeholder="搜索昵称"
          value={keyword}
          onChange={(event) => setKeyword(Array.from(event.target.value).slice(0, 20).join(''))}
        />
      </div>

      <div className="capital-filter">
        <span className="capital-filter-title">省份</span>
        <button
          type="button"
          className="capital-picker-trigger"
          onClick={() => setShowCapitalPicker(true)}
        >
          <span className="capital-picker-value">{selectedProvince}</span>
          <span className="capital-picker-arrow" />
        </button>
      </div>

      <SelectionModal
        visible={showCapitalPicker}
        title="选择省份"
        options={PROVINCE_OPTIONS}
        value={provinceId}
        onSelect={setProvinceId}
        onClose={() => setShowCapitalPicker(false)}
      />

      <PullToRefresh className="list" onRefresh={onRefresh} onScroll={handleScroll}>
        <div className="list-inner">
          {list.map((item) => (
            <div key={item.id} className="card">
              <img className="card-avatar" src={item.avatar} alt={item.nickname} />
              <div className="card-top">
                <span className="card-name">{item.nickname}</span>
                <span className="card-city">{item.province}</span>
              </div>
              <span className="card-brief ellipsis">
                {item.age}岁 · {item.height} cm · {item.weight} kg
              </span>
              <button
                type="button"
                className="card-detail-button"
                onClick={() => goDetail(item)}
              >
                详细数据
              </button>
            </div>
          ))}
        </div>
        <div className="list-footer">
          {list.length === 0 && !loading ? (
            <span className="footer-text">暂无数据</span>
          ) : loading ? (
            <span className="footer-text">加载中...</span>
          ) : hasMore ? (
            <span className="footer-text">上拉加载更多</span>
          ) : (
            <span className="footer-text">— 没有更多了 —</span>
          )}
        </div>
      </PullToRefresh>
    </div>
  )
}
