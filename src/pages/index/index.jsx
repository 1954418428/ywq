import { useCallback, useEffect, useState } from 'react'
import { View, Text, Image, Input, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { getPersonList, getPersonDetail } from '../../services/api'
import './index.scss'

/** H5 用视口高度减 tabbar，RN 用 flex 撑开（RN 不支持 vh 单位） */
const pageStyle = process.env.TARO_ENV === 'h5'
  ? { height: 'calc(100vh - var(--taro-tabbar-height, 52px))' }
  : {}

export default function Index() {
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [keyword, setKeyword] = useState('')

  const load = useCallback(
    async (pageNum = 1, kw = keyword, mode = 'reset') => {
      setLoading(true)
      try {
        const res = await getPersonList({ page: pageNum, keyword: kw })
        setList((prev) => (mode === 'append' ? [...prev, ...res.list] : res.list))
        setHasMore(!!res.hasMore)
        setPage(pageNum)
      } catch (e) {
        Taro.showToast({ title: e.message || '加载失败', icon: 'none' })
      } finally {
        setLoading(false)
      }
    },
    [keyword]
  )

  // 关键词变化后防抖搜索
  useEffect(() => {
    const timer = setTimeout(() => load(1, keyword, 'reset'), 300)
    return () => clearTimeout(timer)
  }, [keyword, load])

  /** 下拉刷新（ScrollView refresher，H5/RN 通用） */
  const onRefresh = async () => {
    setRefreshing(true)
    await load(1, keyword, 'reset')
    setRefreshing(false)
  }

  /** 上拉加载更多 */
  const onLoadMore = () => {
    if (loading || !hasMore) return
    load(page + 1, keyword, 'append')
  }

  const goDetail = (item) => {
    // 预取详情：请求与路由转场并行，详情页直接命中缓存，避免转场后再白等 loading
    getPersonDetail(item.id).catch(() => {})
    Taro.navigateTo({ url: `/pages/detail/index?id=${item.id}` })
  }

  return (
    <View className="page" style={pageStyle}>
      <View className="search-wrap">
        <Input
          className="search-input"
          type="text"
          placeholder="搜索姓名或职业"
          value={keyword}
          onInput={(e) => setKeyword(e.detail.value)}
        />
      </View>
      <ScrollView
        className="list"
        scrollY
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={onRefresh}
        onScrollToLower={onLoadMore}
      >
        <View className="list-inner">
          {list.map((item) => (
            <View key={item.id} className="card" onClick={() => goDetail(item)}>
              <Image className="card-avatar" src={item.avatar} mode="aspectFill" />
              <View className="card-top">
                <Text className="card-name">{item.name}</Text>
                <Text
                  className={
                    item.gender === '女' ? 'badge badge-female' : 'badge badge-male'
                  }
                >
                  {item.gender}
                </Text>
                <Text className="card-age">{item.age}岁</Text>
              </View>
              <Text className="card-meta" numberOfLines={1}>
                {item.occupation} · {item.city}
              </Text>
              <Text className="card-brief" numberOfLines={1}>
                {item.brief}
              </Text>
              <View className="card-tags">
                {item.tags.map((t) => (
                  <Text key={t} className="tag">
                    {t}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>
        <View className="list-footer">
          {list.length === 0 && !loading ? (
            <Text className="footer-text">暂无数据</Text>
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
