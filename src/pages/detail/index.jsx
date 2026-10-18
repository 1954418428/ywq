import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ACTIVITY_RULES, PHOTO_TYPES } from '../../constants'
import { getPersonDetail, peekPersonDetail } from '../../services/api'
import { copyText, copyTextSync, resolveResourceUrl } from '../../utils'
import ImagePreview from '../../components/ImagePreview'
import InfoModal from '../../components/InfoModal'
import MediaCarousel from '../../components/MediaCarousel'
import PageHeader from '../../components/PageHeader'
import { toast } from '../../components/Toast'
import './index.scss'

/** 媒体项是否已填写 src（空串、纯空白都视为未填写） */
const hasSrc = (item) => Boolean(String(item?.src || '').trim())

/** 根据真正有 src 的媒体决定默认 tab；都没有时仍默认视频 */
const getInitialMediaType = (person) => {
  if (!person) return 'video'
  if ((person.videos || []).some(hasSrc)) return 'video'
  if ((person.photos || []).some(hasSrc)) return 'photo'
  return 'video'
}

export default function DetailPage() {
  const [searchParams] = useSearchParams()
  const personId = searchParams.get('id') || ''

  // 首帧同步直出已缓存的详情（从列表页进入时已预取），避免"加载中→内容"的闪动
  const cachedDetail = peekPersonDetail(personId)
  const [detail, setDetail] = useState(cachedDetail)
  const [loading, setLoading] = useState(!cachedDetail)
  const [mediaType, setMediaType] = useState(() => getInitialMediaType(cachedDetail))
  const [mediaIndex, setMediaIndex] = useState(0)
  const [previewIndex, setPreviewIndex] = useState(-1)
  const [ruleModal, setRuleModal] = useState(null)
  const [showSiteContact, setShowSiteContact] = useState(false)
  const [showQuickContact, setShowQuickContact] = useState(false)

  useEffect(() => {
    const cached = peekPersonDetail(personId)
    if (cached) {
      setDetail(cached)
      setMediaType(getInitialMediaType(cached))
      setLoading(false)
      return undefined
    }

    let cancelled = false
    setLoading(true)
    getPersonDetail(personId)
      .then((result) => {
        if (cancelled) return
        setDetail(result)
        // 与 detail 同一批更新，避免媒体 tab 先按默认值渲染一帧
        setMediaType(getInitialMediaType(result))
        setMediaIndex(0)
      })
      .catch((error) => {
        if (!cancelled) toast(error.message || '加载失败')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [personId])

  useEffect(() => {
    document.title = detail?.nickname || '人物详情'
    return () => {
      document.title = '原味牵'
    }
  }, [detail?.nickname])

  useEffect(() => {
    if (!detail) return
    setMediaIndex(0)
    setMediaType(getInitialMediaType(detail))
  }, [detail?.id])

  if (loading) {
    return (
      <div className="detail-page">
        <PageHeader title="人物详情" back />
        <div className="detail-center">
          <span className="detail-tip">加载中...</span>
        </div>
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="detail-page">
        <PageHeader title="人物详情" back />
        <div className="detail-center">
          <span className="detail-tip">暂无详情数据</span>
        </div>
      </div>
    )
  }

  const photos = (detail.photos || [])
    .filter(hasSrc)
    .map((photo) => ({
      ...photo,
      url: resolveResourceUrl(photo.src),
      label: PHOTO_TYPES.find(({ type }) => type === photo.type)?.label
    }))
  const videos = [...(detail.videos || [])]
    .filter(hasSrc)
    .sort((a, b) => a.sort - b.sort)
    .map((video) => ({ ...video, url: resolveResourceUrl(video.src) }))
  const mediaItems = [
    ...videos.map((item) => ({ type: 'video', item })),
    ...photos.map((item, photoIndex) => ({ type: 'photo', item, photoIndex }))
  ]
  const currentMedia = mediaItems[mediaIndex]
  const showMedia = Boolean(currentMedia) && currentMedia.type === mediaType
  const xId = (detail.xId || '').trim().replace(/^@/, '')
  const sellerQQ = String(detail.qq || '').trim()
  const isMobile = typeof navigator !== 'undefined' &&
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
  const qqChatUrl = sellerQQ
    ? isMobile
      ? `mqqwpa://im/chat?chat_type=wpa&uin=${encodeURIComponent(sellerQQ)}&version=1&src_type=web&web_src=oicqapp.cn`
      : `tencent://message/?uin=${encodeURIComponent(sellerQQ)}&Site=&Menu=yes`
    : ''
  const avatarUrl = resolveResourceUrl(detail.avatar)
  const emptyMediaText = mediaItems.length === 0
    ? '暂无媒体'
    : mediaType === 'video'
      ? '暂无视频'
      : '暂无照片'
  const imageUrls = photos.map((photo) => photo.url)

  const switchMediaType = (type) => {
    const targetIndex = mediaItems.findIndex((media) => media.type === type)
    setMediaType(type)
    if (targetIndex >= 0) setMediaIndex(targetIndex)
  }

  const handleMediaChange = (nextIndex) => {
    const media = mediaItems[nextIndex]
    setMediaIndex(nextIndex)
    if (media) setMediaType(media.type)
  }

  const openXProfile = () => {
    if (!xId) {
      toast('暂无 X 账号')
      return
    }
    window.open(`https://x.com/${encodeURIComponent(xId)}`, '_blank', 'noopener,noreferrer')
  }

  const openSiteOwnerXProfile = () => {
    window.open('https://x.com/tb_fzy333', '_blank', 'noopener,noreferrer')
  }

  const copyQQAndOpen = () => {
    if (!sellerQQ) {
      toast('暂无 QQ 号')
      return
    }

    // 优先同步复制：复制完成后再跳转，且不丢失唤起 App 所需的用户手势
    if (copyTextSync(sellerQQ)) {
      toast('已复制卖家 QQ 号')
      window.location.href = qqChatUrl
      return
    }

    // 同步复制不可用时走 Clipboard API，复制完成后再尝试跳转
    copyText(sellerQQ).then((copied) => {
      toast(copied ? '已复制卖家 QQ 号' : '复制失败')
      window.location.href = qqChatUrl
    })
  }

  const showShippingRule = () => setRuleModal(ACTIVITY_RULES.freeShipping)
  const showFirstOrderPriceRule = () => setRuleModal(ACTIVITY_RULES.firstOrderPrice)
  const showRechargeActivityRule = () => setRuleModal(ACTIVITY_RULES.recharge)
  const showOfflineRule = () => setRuleModal(ACTIVITY_RULES.offline)
  const showHeavyRule = () => setRuleModal(ACTIVITY_RULES.heavy)

  return (
    <div className="detail-page">
      <PageHeader title={detail.nickname || '人物详情'} back />

      <div className="detail-scroll">
        <div className="section media-section">
          <div className="media-tabs">
            <span
              className={`media-tab-indicator${mediaType === 'photo' ? ' media-tab-indicator-right' : ''}`}
            />
            <button
              type="button"
              className={`media-tab${mediaType === 'video' ? ' media-tab-active' : ''}`}
              onClick={() => switchMediaType('video')}
            >
              <span>视频{videos.length > 1 ? `(${videos.length})` : ''}</span>
            </button>
            <button
              type="button"
              className={`media-tab${mediaType === 'photo' ? ' media-tab-active' : ''}`}
              onClick={() => switchMediaType('photo')}
            >
              <span>照片{photos.length > 1 ? `(${photos.length})` : ''}</span>
            </button>
          </div>

          <div className="media-stage">
            {showMedia ? (
              <MediaCarousel
                items={mediaItems}
                index={mediaIndex}
                onChange={handleMediaChange}
                renderItem={(media) =>
                  media.type === 'video' ? (
                    <video
                      className="video-player"
                      src={media.item.url}
                      controls
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <div className="media-photo-slide">
                      <img
                        className="photo-img"
                        src={media.item.url}
                        alt={media.item.label || '照片'}
                        onClick={() => setPreviewIndex(media.photoIndex)}
                      />
                      {media.item.label ? (
                        <span className="photo-type-badge">{media.item.label}</span>
                      ) : null}
                    </div>
                  )
                }
              />
            ) : (
              <div className="media-empty">
                <span>{emptyMediaText}</span>
              </div>
            )}
            {currentMedia?.type === 'photo' && showMedia ? (
              <span className="media-counter">
                {currentMedia.photoIndex + 1} / {photos.length}
              </span>
            ) : null}
          </div>
        </div>

        {/* 基本信息 */}
        <div className="profile-card">
          <div className="profile-head" onClick={openXProfile}>
            {avatarUrl ? (
              <img
                className="profile-avatar"
                src={avatarUrl}
                alt={detail.nickname}
              />
            ) : (
              <div className="profile-avatar" aria-hidden="true" />
            )}<div className="profile-info">
              <div className="profile-name-row">
                <span className="profile-name">{detail.nickname}</span>
                {xId ? <span className="profile-x">@{xId}</span> : null}
              </div>
              <div className="profile-top">
                <span className="profile-age">{detail.age}岁</span>
                <span className="profile-measure">{detail.height} cm</span>
                <span className="profile-measure">{detail.weight} kg</span>
                <span className="profile-measure">罩杯{detail.cupSize}</span>
                <span className="profile-measure">脚码{detail.shoeSize}</span>
              </div>
              <span className="profile-meta ellipsis">
                {[detail.province, detail.addressDescription, detail.job].filter(Boolean).join(' / ')}
              </span>
            </div>
          </div>

          <div className="profile-facts">
            <div className="profile-facts-top-row">
              <div className="profile-fact profile-fact-row">
                <span>接受线下</span>
                <span className="profile-help" onClick={showOfflineRule}>?</span>
                <span>：</span>
                <span className="profile-fact-value">{detail.acceptOffline ? '是' : '否'}</span>
              </div>
            </div>
            <div className="profile-fact profile-fact-row">
              <span>接受重口</span>
              <span className="profile-help" onClick={showHeavyRule}>?</span>
              <span>：</span>
              <span className="profile-fact-value">{detail.acceptHeavy ? '是' : '否'}</span>
            </div>
            <div className="profile-reviews">
              <span className="profile-fact profile-review-label">测评链接：</span>
              <div className="profile-review-list">
                {(detail.reviewLinks || []).map((review, index) => (
                  <div className="profile-fact profile-fact-row profile-review-item" key={`${review.date}-${index}`}>
                    <span className="ellipsis">{review.date}</span>
                    <span
                      className="profile-review-link ellipsis"
                      onClick={() => {
                        window.open(review.url, '_blank', 'noopener,noreferrer')
                      }}
                    >
                      查看详情
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="activity-module">
            <span className="activity-title">优惠活动</span>
            <div className="activity-grid">
              <div className="activity-item">
                <div className="activity-label-row">
                  <span className="activity-label">复购运费减免</span>
                  <span className="profile-help" onClick={showShippingRule}>?</span>
                </div>
                <span className="profile-fact-value">{detail.freeShipping ? '是' : '否'}</span>
              </div>
              <div className="activity-item">
                <div className="activity-label-row">
                  <span className="activity-label">充值活动优惠</span>
                  <span className="profile-help" onClick={showRechargeActivityRule}>?</span>
                </div>
                <span className="profile-fact-value">{detail.hasRechargeActivityDiscount ? '是' : '否'}</span>
              </div>
              <div className="activity-item">
                <div className="activity-label-row">
                  <span className="activity-label">袜子首单最低价</span>
                  <span className="profile-help" onClick={showFirstOrderPriceRule}>?</span>
                </div>
                <span className="profile-fact-value">¥{detail.socksFirstOrderMinPrice}</span>
              </div>
              <div className="activity-item">
                <div className="activity-label-row">
                  <span className="activity-label">内裤首单价</span>
                  <span className="profile-help" onClick={showFirstOrderPriceRule}>?</span>
                </div>
                <span className="profile-fact-value">¥{detail.pantiesFirstOrderMinPrice ?? 0}</span>
              </div>
              <div className="activity-item">
                <div className="activity-label-row">
                  <span className="activity-label">内衣首单最低价</span>
                  <span className="profile-help" onClick={showFirstOrderPriceRule}>?</span>
                </div>
                <span className="profile-fact-value">¥{detail.underwearFirstOrderMinPrice}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-bottom-space" />
      </div>

      <div className="detail-contact-bar">
        <button
          type="button"
          className="detail-contact-button detail-contact-service"
          onClick={() => setShowSiteContact(true)}
        >
          联系站长
        </button>
        <button
          type="button"
          className="detail-contact-button detail-contact-now"
          onClick={() => setShowQuickContact(true)}
        >
          立即联系
        </button>
      </div>

      {showQuickContact ? (
        <div className="shipping-rule-overlay" onClick={() => setShowQuickContact(false)}>
          <div
            className="shipping-rule-dialog quick-contact-dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="shipping-rule-title">立即联系</span>
            <span className="quick-contact-display">
              {detail.nickname}
              {xId ? ` @ ${xId}` : ''}
              {sellerQQ ? ` · QQ ${sellerQQ}` : ''}
            </span>
            <span className="quick-contact-tip">
              截图保存当前页面，发送给卖家，即可免门槛咨询和享受所有优惠
            </span>
            <div className="quick-contact-actions">
              <button
                type="button"
                className="quick-contact-action quick-contact-copy"
                onClick={copyQQAndOpen}
              >
                复制QQ并打开
              </button>
              <button
                type="button"
                className="quick-contact-action quick-contact-open"
                onClick={openXProfile}
              >
                进入卖家x主页
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showSiteContact ? (
        <div className="shipping-rule-overlay" onClick={() => setShowSiteContact(false)}>
          <div
            className="shipping-rule-dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="shipping-rule-title">联系站长</span>
            <span className="site-contact-content">qq：1954418428</span>
            <span className="site-contact-link" onClick={openSiteOwnerXProfile}>
              <span className="site-contact-link-prefix">x：</span>
              <span className="site-contact-link-highlight">@tb_fzy333</span>
            </span>
            <button
              type="button"
              className="shipping-rule-confirm"
              onClick={() => setShowSiteContact(false)}
            >
              知道了
            </button>
          </div>
        </div>
      ) : null}

      <InfoModal
        visible={Boolean(ruleModal)}
        title={ruleModal?.title}
        content={ruleModal?.content}
        onClose={() => setRuleModal(null)}
      />

      {previewIndex >= 0 ? (
        <ImagePreview
          images={imageUrls}
          index={previewIndex}
          onChange={setPreviewIndex}
          onClose={() => setPreviewIndex(-1)}
        />
      ) : null}
    </div>
  )
}
