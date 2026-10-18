import { useState } from 'react'
import InfoModal from '../../components/InfoModal'
import PageHeader from '../../components/PageHeader'
import SelectionModal from '../../components/SelectionModal'
import { toast } from '../../components/Toast'
import { ACTIVITY_RULES, PHOTO_TYPES, PROVINCE_CAPITALS } from '../../constants'
import { PersonModel } from '../../model/user'
import { copyText } from '../../utils'
import './index.scss'

const PROVINCE_OPTIONS = PROVINCE_CAPITALS.map(({ provinceId, province }) => ({
  value: provinceId,
  label: province
}))

const formatDateTime = (date = new Date()) => {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** 图片模型：每种类型生成一张，src 留空等上传后回填 */
const createPhotoModels = () =>
  PHOTO_TYPES.map(({ type }) => ({
    type,
    src: ''
  }))

/** 视频模型：至少生成一条，src 留空等上传后回填 */
const createVideoModels = () => [
  {
    src: '',
    sort: 1
  }
]

const createInitialForm = () => {
  const now = formatDateTime()
  return PersonModel.createDetail({
    id: `user_${Date.now()}`,
    nickname: '',
    gender: '女',
    age: 0,
    height: 0,
    weight: 0,
    cupSize: '',
    shoeSize: 0,
    province: '',
    provinceId: 0,
    city: '',
    cityId: 0,
    addressDescription: '',
    avatar: '',
    xId: '',
    qq: '',
    acceptOffline: true,
    acceptHeavy: false,
    hasRechargeActivityDiscount: true,
    freeShipping: true,
    socksFirstOrderMinPrice: 0,
    underwearFirstOrderMinPrice: 0,
    pantiesFirstOrderMinPrice: 0,
    job: '',
    reviewLinks: [],
    photos: createPhotoModels(),
    videos: createVideoModels(),
    createdTime: now,
    updateTime: now
  })
}

export default function UserFormPage() {
  const [form, setForm] = useState(() => createInitialForm())
  const [showProvincePicker, setShowProvincePicker] = useState(false)
  const [infoModal, setInfoModal] = useState(null)

  const updateTextField = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const updateNumberField = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const setBooleanField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleProvinceSelect = (provinceId) => {
    const selected = PROVINCE_CAPITALS.find((item) => item.provinceId === provinceId)
    setForm((prev) => ({
      ...prev,
      provinceId,
      province: selected ? selected.province : '',
      city: '',
      cityId: 0
    }))
    setShowProvincePicker(false)
  }

  const handleSubmit = async () => {
    const payload = {
      ...PersonModel.createDetail(),
      ...form,
      age: Number(form.age) || 0,
      height: Number(form.height) || 0,
      weight: Number(form.weight) || 0,
      shoeSize: Number(form.shoeSize) || 0,
      socksFirstOrderMinPrice: Number(form.socksFirstOrderMinPrice) || 0,
      underwearFirstOrderMinPrice: Number(form.underwearFirstOrderMinPrice) || 0,
      pantiesFirstOrderMinPrice: Number(form.pantiesFirstOrderMinPrice) || 0,
      acceptOffline: form.acceptOffline === true,
      acceptHeavy: form.acceptHeavy === true,
      hasRechargeActivityDiscount: form.hasRechargeActivityDiscount === true,
      freeShipping: form.freeShipping === true,
      reviewLinks: (form.reviewLinks || []).filter((item) => item.date || item.url),
      avatar: '',
      photos: createPhotoModels(),
      videos: createVideoModels(),
      updateTime: formatDateTime()
    }

    const json = JSON.stringify(payload, null, 2)
    console.log('user-form-submit', json)

    const copied = await copyText(json)
    toast(copied ? '用户信息 JSON 已复制' : '复制失败，请查看控制台')
  }

  return (
    <div className="user-form-page">
      <PageHeader title="用户资料录入" back />

      <div className="user-form-body">
        <div className="user-form-header">
          <span className="user-form-title">创建用户资料</span>
        </div>

        <div className="user-form-section">
          <span className="section-title">基础信息</span>

          <div className="field-row">
            <div className="field-box field-box-wide">
              <span className="field-label">昵称</span>
              <input
                className="field-input"
                value={form.nickname}
                placeholder="x(推特)平台网名"
                onChange={updateTextField('nickname')}
              />
            </div>
          </div>

          <div className="field-row two-col">
            <div className="field-box">
              <span className="field-label">性别</span>
              <div className="gender-fixed">
                <span className="gender-fixed-text">女</span>
              </div>
            </div>

            <div className="field-box">
              <span className="field-label">年龄</span>
              <input
                className="field-input"
                type="number"
                inputMode="numeric"
                value={String(form.age)}
                onChange={updateNumberField('age')}
              />
            </div>
          </div>

          <div className="field-row three-col">
            <div className="field-box">
              <span className="field-label">身高(cm)</span>
              <input
                className="field-input"
                type="number"
                inputMode="numeric"
                value={String(form.height)}
                onChange={updateNumberField('height')}
              />
            </div>

            <div className="field-box">
              <span className="field-label">体重(kg)</span>
              <input
                className="field-input"
                type="number"
                inputMode="numeric"
                value={String(form.weight)}
                onChange={updateNumberField('weight')}
              />
            </div>

            <div className="field-box">
              <span className="field-label">罩杯</span>
              <input
                className="field-input"
                value={form.cupSize}
                placeholder="如 B"
                onChange={updateTextField('cupSize')}
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field-box">
              <span className="field-label">鞋码</span>
              <input
                className="field-input"
                type="number"
                inputMode="numeric"
                value={String(form.shoeSize)}
                onChange={updateNumberField('shoeSize')}
              />
            </div>
          </div>
        </div>

        <div className="user-form-section">
          <span className="section-title">联系与地区</span>

          <div className="field-row">
            <div className="field-box field-box-wide">
              <span className="field-label">省份</span>
              <button
                type="button"
                className="picker-trigger"
                onClick={() => setShowProvincePicker(true)}
              >
                <span className="picker-text">{form.province || '请选择省份'}</span>
                <span className="picker-arrow">▾</span>
              </button>
            </div>
          </div>

          <div className="field-row">
            <div className="field-box">
              <span className="field-label">详细地址</span>
              <input
                className="field-input"
                value={form.addressDescription}
                placeholder="填地级城市，比如长沙/武汉/广州/北京"
                onChange={updateTextField('addressDescription')}
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field-box">
              <span className="field-label">职业</span>
              <input
                className="field-input"
                value={form.job}
                placeholder="请输入职业"
                onChange={updateTextField('job')}
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field-box">
              <span className="field-label">X ID</span>
              <input
                className="field-input"
                value={form.xId}
                placeholder="x(推特)平台ID，不需要@符号，比如 tb_fzy333"
                onChange={updateTextField('xId')}
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field-box">
              <span className="field-label">QQ</span>
              <input
                className="field-input"
                value={form.qq}
                placeholder="请输入 QQ"
                onChange={updateTextField('qq')}
              />
            </div>
          </div>
        </div>

        <div className="user-form-section">
          <span className="section-title">交易与活动</span>

          <div className="toggle-row">
            <div className="toggle-label-row">
              <span className="toggle-label">接受线下</span>
              <span
                className="user-form-help"
                onClick={() => setInfoModal(ACTIVITY_RULES.offline)}
              >
                ?
              </span>
            </div>
            <div className="boolean-options">
              {[['是', true], ['否', false]].map(([label, value]) => (
                <span
                  key={label}
                  className={`boolean-option${form.acceptOffline === value ? ' boolean-option-active' : ''}`}
                  onClick={() => setBooleanField('acceptOffline', value)}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="toggle-row">
            <div className="toggle-label-row">
              <span className="toggle-label">接受重口</span>
              <span
                className="user-form-help"
                onClick={() => setInfoModal(ACTIVITY_RULES.heavy)}
              >
                ?
              </span>
            </div>
            <div className="boolean-options">
              {[['是', true], ['否', false]].map(([label, value]) => (
                <span
                  key={label}
                  className={`boolean-option${form.acceptHeavy === value ? ' boolean-option-active' : ''}`}
                  onClick={() => setBooleanField('acceptHeavy', value)}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="toggle-row">
            <div className="toggle-label-row">
              <span className="toggle-label">充值活动优惠</span>
              <span
                className="user-form-help"
                onClick={() => setInfoModal(ACTIVITY_RULES.recharge)}
              >
                ?
              </span>
            </div>
            <div className="boolean-options">
              {[['是', true], ['否', false]].map(([label, value]) => (
                <span
                  key={label}
                  className={`boolean-option${form.hasRechargeActivityDiscount === value ? ' boolean-option-active' : ''}`}
                  onClick={() => setBooleanField('hasRechargeActivityDiscount', value)}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="toggle-row">
            <div className="toggle-label-row">
              <span className="toggle-label">复购运费减免</span>
              <span
                className="user-form-help"
                onClick={() => setInfoModal(ACTIVITY_RULES.freeShipping)}
              >
                ?
              </span>
            </div>
            <div className="boolean-options">
              {[['是', true], ['否', false]].map(([label, value]) => (
                <span
                  key={label}
                  className={`boolean-option${form.freeShipping === value ? ' boolean-option-active' : ''}`}
                  onClick={() => setBooleanField('freeShipping', value)}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="field-row two-col">
            <div className="field-box">
              <div className="field-label-row">
                <span className="field-label">袜子首单最低价</span>
                <span
                  className="user-form-help"
                  onClick={() => setInfoModal(ACTIVITY_RULES.firstOrderPrice)}
                >
                  ?
                </span>
              </div>
              <input
                className="field-input"
                type="number"
                inputMode="numeric"
                value={String(form.socksFirstOrderMinPrice)}
                onChange={updateNumberField('socksFirstOrderMinPrice')}
              />
            </div>

            <div className="field-box">
              <div className="field-label-row">
                <span className="field-label">内衣首单最低价</span>
                <span
                  className="user-form-help"
                  onClick={() => setInfoModal(ACTIVITY_RULES.firstOrderPrice)}
                >
                  ?
                </span>
              </div>
              <input
                className="field-input"
                type="number"
                inputMode="numeric"
                value={String(form.underwearFirstOrderMinPrice)}
                onChange={updateNumberField('underwearFirstOrderMinPrice')}
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field-box">
              <div className="field-label-row">
                <span className="field-label">内裤首单价</span>
                <span
                  className="user-form-help"
                  onClick={() => setInfoModal(ACTIVITY_RULES.firstOrderPrice)}
                >
                  ?
                </span>
              </div>
              <input
                className="field-input"
                type="number"
                inputMode="numeric"
                value={String(form.pantiesFirstOrderMinPrice)}
                onChange={updateNumberField('pantiesFirstOrderMinPrice')}
              />
            </div>
          </div>
        </div>

        <div className="user-form-actions">
          <button type="button" className="submit-btn" onClick={handleSubmit}>
            提交用户信息
          </button>
        </div>
      </div>

      <SelectionModal
        visible={showProvincePicker}
        title="选择省份"
        options={PROVINCE_OPTIONS}
        value={form.provinceId}
        onSelect={handleProvinceSelect}
        onClose={() => setShowProvincePicker(false)}
      />
      <InfoModal
        visible={Boolean(infoModal)}
        title={infoModal?.title}
        content={infoModal?.content}
        onClose={() => setInfoModal(null)}
      />
    </div>
  )
}
