import { useCallback, useEffect, useState } from 'react'
import { View, Text, Image, Input, ScrollView, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { PROVINCE_CAPITALS } from '../../constants'
import { getPersonList, getPersonDetail } from '../../services/api'
import SelectionModal from '../../components/SelectionModal'
import './index.scss'

/** H5 用视口高度减 tabbar，RN 用 flex 撑开（RN 不支持 vh 单位） */
const pageStyle = process.env.TARO_ENV === 'h5'
  ? { height: 'calc(100vh - var(--taro-tabbar-height, 52px))' }
  : {}

const PROVINCE_OPTIONS = [
  { provinceId: null, province: '全部' },
  ...PROVINCE_CAPITALS.filter((item) => item.capital === '上海市'),
  ...PROVINCE_CAPITALS.filter((item) => item.capital !== '上海市')
].map(({ provinceId, province }) => ({
  value: provinceId,
  label: province
}))

export default function Index() {
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [provinceId, setProvinceId] = useState(null)
  const [showCapitalPicker, setShowCapitalPicker] = useState(false)
  const selectedProvince = PROVINCE_OPTIONS.find((item) => item.value === provinceId)?.label || '全部'

  const load = useCallback(
    async (pageNum = 1, kw = keyword, mode = 'reset', selectedProvinceId = provinceId) => {
      setLoading(true)
      try {
        const res = await getPersonList({
          page: pageNum,
          keyword: kw,
          provinceId: selectedProvinceId
        })
        setList((prev) => (mode === 'append' ? [...prev, ...res.list] : res.list))
        setHasMore(!!res.hasMore)
        setPage(pageNum)
      } catch (e) {
        Taro.showToast({ title: e.message || '加载失败', icon: 'none' })
      } finally {
        setLoading(false)
      }
    },
    [keyword, provinceId]
  )

  // 关键词或省会筛选变化后重新获取列表
  useEffect(() => {
    const timer = setTimeout(() => load(1, keyword, 'reset', provinceId), 300)
    return () => clearTimeout(timer)
  }, [keyword, provinceId, load])

  /** 下拉刷新（ScrollView refresher，H5/RN 通用） */
  const onRefresh = async () => {
    setRefreshing(true)
    await load(1, keyword, 'reset', provinceId)
    setRefreshing(false)
  }

  /** 上拉加载更多 */
  const onLoadMore = () => {
    if (loading || !hasMore) return
    load(page + 1, keyword, 'append', provinceId)
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
          maxlength={20}
          placeholder="搜索昵称"
          value={keyword}
          onInput={(e) =>
            setKeyword(Array.from(e.detail.value).slice(0, 20).join(''))
          }
        />
      </View>
      <View className="capital-filter">
        <Text className="capital-filter-title">省份</Text>
        <View className="capital-picker-trigger" onClick={() => setShowCapitalPicker(true)}>
          <Text className="capital-picker-value">{selectedProvince}</Text>
          <View className="capital-picker-arrow" />
        </View>
      </View>
      <SelectionModal
        visible={showCapitalPicker}
        title="选择省份"
        options={PROVINCE_OPTIONS}
        value={provinceId}
        onSelect={setProvinceId}
        onClose={() => setShowCapitalPicker(false)}
      />
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
            <View key={item.id} className="card">
              <Image className="card-avatar" src={item.avatar} mode="aspectFill" />
              <View className="card-top">
                <Text className="card-name">{item.nickname}</Text>
                <Text className="card-city">{item.province}</Text>
              </View>
              <Text className="card-brief" numberOfLines={1}>
                {item.age}岁 · {item.height} cm · {item.weight} kg
              </Text>
              <Button
                className="card-detail-button"
                size="mini"
                onClick={() => goDetail(item)}
              >
                详细数据
              </Button>
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
