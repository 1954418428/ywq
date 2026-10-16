import { useEffect, useState } from 'react'
import { View, Text, Image, Swiper, SwiperItem, Video, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { getPersonDetail } from '../../services/api'
import { resolveResourceUrl } from '../../utils'
import AudioPlayer from './AudioPlayer'
import './index.scss'

export default function Detail() {
  const { params } = useRouter()
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [photoIndex, setPhotoIndex] = useState(0)

  /** H5：100vh 减去内置导航栏高度（8+24+8=40px 及刘海安全区），RN 用 flex 撑开（RN 不支持 vh 单位） */
  const pageStyle = process.env.TARO_ENV === 'h5'
    ? { height: 'calc(100vh - 40px - env(safe-area-inset-top, 0px))' }
    : {}

  useEffect(() => {
    setLoading(true)
    getPersonDetail(params.id)
      .then((res) => setDetail(res))
      .catch((e) => {
        Taro.showToast({ title: e.message || '加载失败', icon: 'none' })
      })
      .finally(() => setLoading(false))
  }, [params.id])

  /** 点击图片进入全屏预览 */
  const previewPhoto = () => {
    const urls = (detail?.photos || []).map((u) => resolveResourceUrl(u))
    if (!urls.length) return
    Taro.previewImage({ urls, current: urls[photoIndex] })
  }

  if (loading) {
    return (
      <View className="detail-page detail-center" style={pageStyle}>
        <Text className="detail-tip">加载中...</Text>
      </View>
    )
  }

  if (!detail) {
    return (
      <View className="detail-page detail-center" style={pageStyle}>
        <Text className="detail-tip">暂无详情数据</Text>
      </View>
    )
  }

  const photos = (detail.photos || []).map((u) => resolveResourceUrl(u))
  const videos = (detail.videos || []).map((v) => ({
    ...v,
    url: resolveResourceUrl(v.url),
    poster: resolveResourceUrl(v.poster)
  }))
  const audios = (detail.audios || []).map((a) => ({
    ...a,
    url: resolveResourceUrl(a.url)
  }))

  return (
    <View className="detail-page" style={pageStyle}>
      <ScrollView scrollY className="detail-scroll">
        {/* 基本信息 */}
        <View className="profile-card">
          <View className="profile-head">
            <Image className="profile-avatar" src={resolveResourceUrl(detail.avatar)} mode="aspectFill" />
            <View className="profile-info">
              <View className="profile-top">
                <Text className="profile-name">{detail.name}</Text>
                <Text
                  className={
                    detail.gender === '女'
                      ? 'badge badge-female'
                      : 'badge badge-male'
                  }
                >
                  {detail.gender}
                </Text>
                <Text className="profile-age">{detail.age}岁</Text>
              </View>
              <Text className="profile-meta" numberOfLines={1}>
                {detail.occupation} · {detail.city}
              </Text>
            </View>
          </View>
          <Text className="profile-intro">{detail.intro}</Text>
        </View>

        {/* 图片 */}
        {photos.length > 0 && (
          <View className="section">
            <Text className="section-title">图片（{photos.length}）</Text>
            <View className="photo-wrap">
              <Swiper
                className="photo-swiper"
                circular={false}
                onChange={(e) => setPhotoIndex(e.detail.current)}
              >
                {photos.map((url, i) => (
                  <SwiperItem key={url} onClick={previewPhoto}>
                    <Image className="photo-img" src={url} mode="aspectFill" />
                  </SwiperItem>
                ))}
              </Swiper>
              <Text className="photo-index">
                {photoIndex + 1}/{photos.length}
              </Text>
            </View>
          </View>
        )}

        {/* 视频 */}
        {videos.length > 0 && (
          <View className="section">
            <Text className="section-title">视频（{videos.length}）</Text>
            {videos.map((v) => (
              <View key={v.id} className="video-item">
                <Text className="video-title" numberOfLines={1}>
                  {v.title}
                </Text>
                <Video
                  className="video-player"
                  src={v.url}
                  poster={v.poster}
                  controls
                />
              </View>
            ))}
          </View>
        )}

        {/* 音频 */}
        {audios.length > 0 && (
          <View className="section">
            <Text className="section-title">音频（{audios.length}）</Text>
            {audios.map((a) => (
              <AudioPlayer key={a.id} src={a.url} title={a.title} />
            ))}
          </View>
        )}

        <View className="detail-bottom-space" />
      </ScrollView>
    </View>
  )
}
