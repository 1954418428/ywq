import { useState } from 'react'
import { Button, Input, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import InfoModal from '../../components/InfoModal'
import SelectionModal from '../../components/SelectionModal'
import { ACTIVITY_RULES, PROVINCE_CAPITALS } from '../../constants'
import { PersonModel } from '../../model/user'
import './index.scss'

const PROVINCE_OPTIONS = PROVINCE_CAPITALS.map(({ provinceId, province }) => ({
  value: provinceId,
  label: province
}))

const formatDateTime = (date = new Date()) => {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

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
    hasRechargeActivityDiscount: true,
    freeShipping: true,
    socksFirstOrderMinPrice: 0,
    underwearFirstOrderMinPrice: 0,
    job: '',
    reviewLinks: [],
    photos: [],
    videos: [],
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
      [field]: event.detail.value
    }))
  }

  const updateNumberField = (field) => (event) => {
    const value = event.detail.value
    setForm((prev) => ({
      ...prev,
      [field]: value
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

  const handleSubmit = () => {
    const payload = {
      ...PersonModel.createDetail(),
      ...form,
      age: Number(form.age) || 0,
      height: Number(form.height) || 0,
      weight: Number(form.weight) || 0,
      shoeSize: Number(form.shoeSize) || 0,
      socksFirstOrderMinPrice: Number(form.socksFirstOrderMinPrice) || 0,
      underwearFirstOrderMinPrice: Number(form.underwearFirstOrderMinPrice) || 0,
      acceptOffline: form.acceptOffline === true,
      hasRechargeActivityDiscount: form.hasRechargeActivityDiscount === true,
      freeShipping: form.freeShipping === true,
      reviewLinks: (form.reviewLinks || []).filter((item) => item.date || item.url),
      avatar: '',
      photos: [],
      videos: [],
      updateTime: formatDateTime()
    }

    console.log('user-form-submit', JSON.stringify(payload, null, 2))
    Taro.showToast({
      title: '用户信息已构造完成',
      icon: 'success'
    })
  }

  return (
    <View className="user-form-page">
      <View className="user-form-header">
        <Text className="user-form-title">创建用户资料</Text>
      </View>

      <View className="user-form-section">
        <Text className="section-title">基础信息</Text>

        <View className="field-row">
          <View className="field-box field-box-wide">
            <Text className="field-label">昵称</Text>
            <Input
              className="field-input"
              value={form.nickname}
              placeholder="x(推特)平台网名"
              onInput={updateTextField('nickname')}
            />
          </View>
        </View>

        <View className="field-row two-col">
          <View className="field-box">
            <Text className="field-label">性别</Text>
            <View className="gender-fixed">
              <Text className="gender-fixed-text">女</Text>
            </View>
          </View>

          <View className="field-box">
            <Text className="field-label">年龄</Text>
            <Input
              className="field-input"
              type="number"
              value={String(form.age)}
              onInput={updateNumberField('age')}
            />
          </View>
        </View>

        <View className="field-row three-col">
          <View className="field-box">
            <Text className="field-label">身高(cm)</Text>
            <Input
              className="field-input"
              type="number"
              value={String(form.height)}
              onInput={updateNumberField('height')}
            />
          </View>

          <View className="field-box">
            <Text className="field-label">体重(kg)</Text>
            <Input
              className="field-input"
              type="number"
              value={String(form.weight)}
              onInput={updateNumberField('weight')}
            />
          </View>

          <View className="field-box">
            <Text className="field-label">罩杯</Text>
            <Input
              className="field-input"
              value={form.cupSize}
              placeholder="如 B"
              onInput={updateTextField('cupSize')}
            />
          </View>
        </View>

        <View className="field-row">
          <View className="field-box">
            <Text className="field-label">鞋码</Text>
            <Input
              className="field-input"
              type="number"
              value={String(form.shoeSize)}
              onInput={updateNumberField('shoeSize')}
            />
          </View>
        </View>
      </View>

      <View className="user-form-section">
        <Text className="section-title">联系与地区</Text>

        <View className="field-row">
          <View className="field-box field-box-wide">
            <Text className="field-label">省份</Text>
            <View className="picker-trigger" onClick={() => setShowProvincePicker(true)}>
              <Text className="picker-text">{form.province || '请选择省份'}</Text>
              <Text className="picker-arrow">▾</Text>
            </View>
          </View>
        </View>

        <View className="field-row">
          <View className="field-box">
            <Text className="field-label">详细地址</Text>
            <Input
              className="field-input"
              value={form.addressDescription}
              placeholder="填地级城市，比如长沙/武汉/广州/北京"
              onInput={updateTextField('addressDescription')}
            />
          </View>
        </View>

        <View className="field-row">
          <View className="field-box">
            <Text className="field-label">职业</Text>
            <Input
              className="field-input"
              value={form.job}
              placeholder="请输入职业"
              onInput={updateTextField('job')}
            />
          </View>
        </View>

        <View className="field-row">
          <View className="field-box">
            <Text className="field-label">X ID</Text>
            <Input
              className="field-input"
              value={form.xId}
              placeholder="x(推特)平台ID，不需要@符号，比如 tb_fzy333"
              onInput={updateTextField('xId')}
            />
          </View>
        </View>

        <View className="field-row">
          <View className="field-box">
            <Text className="field-label">QQ</Text>
            <Input
              className="field-input"
              value={form.qq}
              placeholder="请输入 QQ"
              onInput={updateTextField('qq')}
            />
          </View>
        </View>
      </View>

      <View className="user-form-section">
        <Text className="section-title">交易与活动</Text>

        <View className="toggle-row">
          <View className="toggle-label-row">
            <Text className="toggle-label">接受线下</Text>
            <Text className="user-form-help" onClick={() => setInfoModal(ACTIVITY_RULES.offline)}>?</Text>
          </View>
          <View className="boolean-options">
            {[['是', true], ['否', false]].map(([label, value]) => (
              <Text
                key={label}
                className={`boolean-option ${form.acceptOffline === value ? 'boolean-option-active' : ''}`}
                onClick={() => setBooleanField('acceptOffline', value)}
              >
                {label}
              </Text>
            ))}
          </View>
        </View>

        <View className="toggle-row">
          <View className="toggle-label-row">
            <Text className="toggle-label">充值活动优惠</Text>
            <Text className="user-form-help" onClick={() => setInfoModal(ACTIVITY_RULES.recharge)}>?</Text>
          </View>
          <View className="boolean-options">
            {[['是', true], ['否', false]].map(([label, value]) => (
              <Text
                key={label}
                className={`boolean-option ${form.hasRechargeActivityDiscount === value ? 'boolean-option-active' : ''}`}
                onClick={() => setBooleanField('hasRechargeActivityDiscount', value)}
              >
                {label}
              </Text>
            ))}
          </View>
        </View>

        <View className="toggle-row">
          <View className="toggle-label-row">
            <Text className="toggle-label">复购运费减免</Text>
            <Text className="user-form-help" onClick={() => setInfoModal(ACTIVITY_RULES.freeShipping)}>?</Text>
          </View>
          <View className="boolean-options">
            {[['是', true], ['否', false]].map(([label, value]) => (
              <Text
                key={label}
                className={`boolean-option ${form.freeShipping === value ? 'boolean-option-active' : ''}`}
                onClick={() => setBooleanField('freeShipping', value)}
              >
                {label}
              </Text>
            ))}
          </View>
        </View>

        <View className="field-row two-col">
          <View className="field-box">
            <View className="field-label-row">
              <Text className="field-label">袜子首单最低价</Text>
              <Text className="user-form-help" onClick={() => setInfoModal(ACTIVITY_RULES.firstOrderPrice)}>?</Text>
            </View>
            <Input
              className="field-input"
              type="number"
              value={String(form.socksFirstOrderMinPrice)}
              onInput={updateNumberField('socksFirstOrderMinPrice')}
            />
          </View>

          <View className="field-box">
            <View className="field-label-row">
              <Text className="field-label">内衣首单最低价</Text>
              <Text className="user-form-help" onClick={() => setInfoModal(ACTIVITY_RULES.firstOrderPrice)}>?</Text>
            </View>
            <Input
              className="field-input"
              type="number"
              value={String(form.underwearFirstOrderMinPrice)}
              onInput={updateNumberField('underwearFirstOrderMinPrice')}
            />
          </View>
        </View>
      </View>

      <View className="user-form-actions">
        <Button className="submit-btn" onClick={handleSubmit}>提交用户信息</Button>
      </View>

      <SelectionModal
        visible={showProvincePicker}
        title="选择省份"
        options={PROVINCE_OPTIONS}
        value={form.provinceId}
        onSelect={handleProvinceSelect}
        onClose={() => setShowProvincePicker(false)}
      />
      <InfoModal
        visible={!!infoModal}
        title={infoModal?.title}
        content={infoModal?.content}
        onClose={() => setInfoModal(null)}
      />
    </View>
  )
}
