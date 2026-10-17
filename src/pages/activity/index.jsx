import { useCallback, useEffect, useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { getActivityList } from '../../services/api'
import './index.scss'

export default function Activity() {
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(
    async (pageNum = 1, mode = 'reset') => {
      setLoading(true)
      try {
        const res = await getActivityList({ page: pageNum })
        setList((prev) => (mode === 'append' ? [...prev, ...res.list] : res.list))
        setHasMore(!!res.hasMore)
        setPage(pageNum)
      } catch (e) {
        Taro.showToast({ title: e.message || '加载失败', icon: 'none' })
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    load(1, 'reset')
  }, [load])

  /** 下拉刷新（ScrollView refresher，H5/RN 通用） */
  const onRefresh = async () => {
    setRefreshing(true)
    await load(1, 'reset')
    setRefreshing(false)
  }

  /** 上拉加载更多 */
  const onLoadMore = () => {
    if (loading || !hasMore) return
    load(page + 1, 'append')
  }

  return (
    <View className="activity-page">
      <ScrollView
        className="activity-list"
        scrollY
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={onRefresh}
        onScrollToLower={onLoadMore}
      >
        {list.map((item) => (
          <View key={item.id} className="activity-card">
            <View className="activity-head">
              <Text className="activity-title" numberOfLines={1}>
                {item.title}
              </Text>
              <Text className="activity-date">{item.date}</Text>
            </View>
            <Text className="activity-content" numberOfLines={2}>
              {item.content}
            </Text>
          </View>
        ))}
        <View className="activity-footer">
          {list.length === 0 && !loading ? (
            <Text className="footer-text">暂无活动</Text>
          ) : loading ? (
            <Text className="footer-text">加载中...</Text>
          ) : hasMore ? (
            <Text className="footer-text">上拉加载更多</Text>
          ) : (
            <Text className="footer-text">— 没有更多了 —</Text>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
