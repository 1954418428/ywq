import { useCallback, useEffect, useRef, useState } from 'react'
import { getActivityList } from '../../services/api'
import PageHeader from '../../components/PageHeader'
import PullToRefresh from '../../components/PullToRefresh'
import { toast } from '../../components/Toast'
import './index.scss'

export default function ActivityPage() {
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const loadingRef = useRef(false)
  const requestIdRef = useRef(0)

  const load = useCallback(async (pageNum = 1, mode = 'reset') => {
    if (mode === 'append' && loadingRef.current) return
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId
    loadingRef.current = true
    setLoading(true)
    try {
      const res = await getActivityList({ page: pageNum })
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
  }, [])

  useEffect(() => {
    load(1, 'reset')
  }, [load])

  const onRefresh = () => load(1, 'reset')

  const handleScroll = (event) => {
    const element = event.currentTarget
    const distanceToBottom = element.scrollHeight - element.scrollTop - element.clientHeight
    if (distanceToBottom > 120) return
    if (loadingRef.current || !hasMore) return
    load(page + 1, 'append')
  }

  return (
    <div className="activity-page">
      <PageHeader title="活动" />

      <PullToRefresh className="activity-list" onRefresh={onRefresh} onScroll={handleScroll}>
        {list.map((item) => (
          <div key={item.id} className="activity-card">
            <div className="activity-head">
              <span className="activity-title ellipsis">{item.title}</span>
              <span className="activity-date">{item.date}</span>
            </div>
            <span className="activity-content ellipsis-2">{item.content}</span>
          </div>
        ))}
        <div className="activity-footer">
          {list.length === 0 && !loading ? (
            <span className="footer-text">暂无活动</span>
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
