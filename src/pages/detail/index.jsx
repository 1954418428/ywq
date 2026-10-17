import { useEffect, useState } from 'react'
import { View, Text, Image, Video, ScrollView, Swiper, SwiperItem } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { ACTIVITY_RULES, PHOTO_TYPES } from '../../constants'
import { getPersonDetail, peekPersonDetail } from '../../services/api'
import { resolveResourceUrl } from '../../utils'
import InfoModal from '../../components/InfoModal'
import './index.scss'

export default function Detail() {
  const { params } = useRouter()
  // 首帧同步直出已缓存的详情（从列表页进入时已预取），避免"加载中→内容"的闪动
  const [detail, setDetail] = useState(() => peekPersonDetail(params.id))
  const [loading, setLoading] = useState(!detail)
  const [mediaType, setMediaType] = useState('video')
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [ruleModal, setRuleModal] = useState(null)
  const [showSiteContact, setShowSiteContact] = useState(false)
  const [showQuickContact, setShowQuickContact] = useState(false)

  /** H5：100vh 减去内置导航栏高度（8+24+8=40px 及刘海安全区），RN 用 flex 撑开（RN 不支持 vh 单位） */
  const pageStyle = process.env.TARO_ENV === 'h5'
    ? { height: 'calc(100vh - 40px - env(safe-area-inset-top, 0px))' }
    : {}

  useEffect(() => {
    // 首帧已直出缓存数据，无需再请求；未命中（直接输入 URL 进入）才走 loading
    if (peekPersonDetail(params.id)) return
    setLoading(true)
    getPersonDetail(params.id)
      .then((res) => setDetail(res))
      .catch((e) => {
        Taro.showToast({ title: e.message || '加载失败', icon: 'none' })
      })
      .finally(() => setLoading(false))
  }, [params.id])

  useEffect(() => {
    if (detail?.nickname) {
      Taro.setNavigationBarTitle({ title: detail.nickname })
    }
  }, [detail?.nickname])

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

  const photos = (detail.photos || []).map((photo) => ({
    ...photo,
    url: resolveResourceUrl(photo.src),
    label: PHOTO_TYPES.find(({ type }) => type === photo.type)?.label
  }))
  const videos = [...(detail.videos || [])]
    .sort((a, b) => a.sort - b.sort)
    .map((video) => ({ ...video, url: resolveResourceUrl(video.src) }))
  const mediaItems = [
    ...videos.map((item, categoryIndex) => ({ type: 'video', item, categoryIndex })),
    ...photos.map((item, categoryIndex) => ({ type: 'photo', item, categoryIndex }))
  ]
  const currentMedia = mediaItems[currentMediaIndex]
  const xId = (detail.xId || '').trim().replace(/^@/, '')

  const switchMediaType = (type) => {
    const targetIndex = mediaItems.findIndex((media) => media.type === type)
    if (targetIndex >= 0) setCurrentMediaIndex(targetIndex)
    setMediaType(type)
  }

  const openXProfile = () => {
    if (xId && typeof window !== 'undefined') {
      window.open(`https://x.com/${encodeURIComponent(xId)}`, '_blank', 'noopener,noreferrer')
    }
  }

  const showQuickContactModal = () => {
    setShowQuickContact(true)
  }

  const copySellerQQ = async () => {
    const payload = '1954418428'
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(payload)
      } else if (typeof Taro !== 'undefined' && Taro.setClipboardData) {
        Taro.setClipboardData({ data: payload })
      } else if (typeof window !== 'undefined') {
        const textarea = document.createElement('textarea')
        textarea.value = payload
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      Taro.showToast({ title: '已复制卖家 QQ 号', icon: 'success' })
    } catch (error) {
      Taro.showToast({ title: '复制失败', icon: 'none' })
    }
  }

  const openSiteOwnerXProfile = () => {
    if (typeof window !== 'undefined') {
      window.open('https://x.com/tb_fzy333', '_blank', 'noopener,noreferrer')
    }
  }

  const showSiteContactModal = () => {
    setShowSiteContact(true)
  }

  const showShippingRule = () => {
    setRuleModal(ACTIVITY_RULES.freeShipping)
  }

  const showFirstOrderPriceRule = () => {
    setRuleModal(ACTIVITY_RULES.firstOrderPrice)
  }

  const showRechargeActivityRule = () => {
    setRuleModal(ACTIVITY_RULES.recharge)
  }

  const showOfflineRule = () => {
    setRuleModal(ACTIVITY_RULES.offline)
  }

  return (
    <View className="detail-page" style={pageStyle}>
      <ScrollView scrollY className="detail-scroll">
        <View className="section media-section">
          <View className="media-tabs">
            <View className="media-tab-indicator" style={{ transform: mediaType === 'photo' ? 'translateX(100%)' : 'translateX(0%)' }} />
            <View
              className={`media-tab ${mediaType === 'video' ? 'media-tab-active' : ''}`}
              onClick={() => switchMediaType('video')}
            >
              <Text>视频{videos.length > 1 ? `(${videos.length})` : ''}</Text>
            </View>
            <View
              className={`media-tab ${mediaType === 'photo' ? 'media-tab-active' : ''}`}
              onClick={() => switchMediaType('photo')}
            >
              <Text>照片{photos.length > 1 ? `(${photos.length})` : ''}</Text>
            </View>
          </View>
          <View className="media-stage">
            {mediaItems.length > 0 ? (
              <Swiper
                className="media-swiper"
                current={currentMediaIndex}
                onChange={(event) => {
                  const index = event.detail.current
                  const media = mediaItems[index]
                  setCurrentMediaIndex(index)
                  if (media) setMediaType(media.type)
                }}
                indicatorDots={false}
                circular={false}
              >
                {mediaItems.map((media) => (
                  <SwiperItem key={`${media.type}-${media.item.url}-${media.categoryIndex}`}>
                    {media.type === 'video' ? (
                      <Video className="video-player" src={media.item.url} controls />
                    ) : (
                      <View className="media-photo-slide">
                        <Image
                          className="photo-img"
                          src={media.item.url}
                          mode="aspectFill"
                          onClick={() =>
                            Taro.previewImage({
                              urls: photos.map((item) => item.url),
                              current: media.item.url
                            })
                          }
                        />
                        {media.item.label && (
                          <Text className="photo-type-badge">{media.item.label}</Text>
                        )}
                      </View>
                    )}
                  </SwiperItem>
                ))}
              </Swiper>
            ) : (
              <View className="media-empty">
                <Text>{mediaType === 'video' ? '暂无视频' : '暂无照片'}</Text>
              </View>
            )}
            {currentMedia?.type === 'photo' && (
              <Text className="media-counter">{currentMedia.categoryIndex + 1} / {photos.length}</Text>
            )}
          </View>
        </View>

        {/* 基本信息 */}
        <View className="profile-card">
          <View className="profile-head" onClick={openXProfile}>
            <Image className="profile-avatar" src={resolveResourceUrl(detail.avatar)} mode="aspectFill" />
            <View className="profile-info">
              <View className="profile-name-row">
                <Text className="profile-name">{detail.nickname}</Text>
                {xId && <Text className="profile-x">@{xId}</Text>}
              </View>
              <View className="profile-top">
                <Text className="profile-age">{detail.age}岁</Text>
                <Text className="profile-measure">{detail.height} cm</Text>
                <Text className="profile-measure">{detail.weight} kg</Text>
                <Text className="profile-measure">罩杯{detail.cupSize}</Text>
                <Text className="profile-measure">脚码{detail.shoeSize}</Text>
              </View>
              <Text className="profile-meta" numberOfLines={1}>
                {[detail.province, detail.addressDescription, detail.job].filter(Boolean).join(' / ')}
              </Text>
            </View>
          </View>
          <View className="profile-facts">
            <View className="profile-facts-top-row">
              <View className="profile-fact profile-fact-row">
                <Text>接受线下</Text>
                <Text className="profile-help" onClick={showOfflineRule}>?</Text>
                <Text>：</Text>
                <Text className="profile-fact-value">{detail.acceptOffline ? '是' : '否'}</Text>
              </View>
            </View>
            <View className="profile-reviews">
              <Text className="profile-fact profile-review-label">测评链接：</Text>
              <View className="profile-review-list">
                {(detail.reviewLinks || []).map((review, index) => (
                  <View className="profile-fact profile-fact-row profile-review-item" key={`${review.date}-${index}`}>
                    <Text numberOfLines={1}>{review.date}</Text>
                    <Text
                      className="profile-review-link"
                      numberOfLines={1}
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          window.open(review.url, '_blank', 'noopener,noreferrer')
                        }
                      }}
                    >
                      查看详情
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <View className="activity-module">
            <Text className="activity-title">优惠活动</Text>
            <View className="activity-grid">
              <View className="activity-item">
                <View className="activity-label-row">
                  <Text className="activity-label">复购运费减免</Text>
                  <Text className="profile-help" onClick={showShippingRule}>?</Text>
                </View>
                <Text className="profile-fact-value">{detail.freeShipping ? '是' : '否'}</Text>
              </View>
              <View className="activity-item">
                <View className="activity-label-row">
                  <Text className="activity-label">充值活动优惠</Text>
                  <Text className="profile-help" onClick={showRechargeActivityRule}>?</Text>
                </View>
                <Text className="profile-fact-value">{detail.hasRechargeActivityDiscount ? '是' : '否'}</Text>
              </View>
              <View className="activity-item">
                <View className="activity-label-row">
                  <Text className="activity-label">袜子首单最低价</Text>
                  <Text className="profile-help" onClick={showFirstOrderPriceRule}>?</Text>
                </View>
                <Text className="profile-fact-value">¥{detail.socksFirstOrderMinPrice}</Text>
              </View>
              <View className="activity-item">
                <View className="activity-label-row">
                  <Text className="activity-label">内衣首单最低价</Text>
                  <Text className="profile-help" onClick={showFirstOrderPriceRule}>?</Text>
                </View>
                <Text className="profile-fact-value">¥{detail.underwearFirstOrderMinPrice}</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="detail-bottom-space" />
      </ScrollView>
      <View className="detail-contact-bar">
        <View className="detail-contact-button detail-contact-service" onClick={showSiteContactModal}>
          <Text>联系站长</Text>
        </View>
        <View className="detail-contact-button detail-contact-now" onClick={showQuickContactModal}>
          <Text>立即联系</Text>
        </View>
      </View>
      {showQuickContact && (
        <View className="shipping-rule-overlay" onClick={() => setShowQuickContact(false)}>
          <View className="shipping-rule-dialog quick-contact-dialog" onClick={(event) => event.stopPropagation()}>
            <Text className="shipping-rule-title">立即联系</Text>
            <Text className="quick-contact-display">
              {detail.nickname} @ {xId || 'unknown'} & @tb_fzy333
            </Text>
            <Text className="quick-contact-tip">截图保存当前页面，发送给卖家，即可免门槛咨询和享受所有优惠</Text>
            <View className="quick-contact-actions">
              <View className="quick-contact-action quick-contact-copy" onClick={copySellerQQ}>
                <Text>复制卖家qq号</Text>
              </View>
              <View className="quick-contact-action quick-contact-open" onClick={openSiteOwnerXProfile}>
                <Text>进入卖家x主页</Text>
              </View>
            </View>
          </View>
        </View>
      )}
      {showSiteContact && (
        <View className="shipping-rule-overlay" onClick={() => setShowSiteContact(false)}>
          <View className="shipping-rule-dialog" onClick={(event) => event.stopPropagation()}>
            <Text className="shipping-rule-title">联系站长</Text>
            <Text className="site-contact-content">qq：1954418428</Text>
            <Text className="site-contact-link" onClick={openSiteOwnerXProfile}>
              <Text className="site-contact-link-prefix">x：</Text>
              <Text className="site-contact-link-highlight">@tb_fzy333</Text>
            </Text>
            <Text className="shipping-rule-confirm" onClick={() => setShowSiteContact(false)}>知道了</Text>
          </View>
        </View>
      )}
      <InfoModal
        visible={!!ruleModal}
        title={ruleModal?.title}
        content={ruleModal?.content}
        onClose={() => setRuleModal(null)}
      />
    </View>
  )
}
