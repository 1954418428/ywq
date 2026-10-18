/**
 * 用户信息数据模型定义
 * 字段结构即"后端接口约定"：对接后端后保持一致即可无缝切换
 */

/** 照片类型编码 */
export type PhotoType = 1 | 2 | 3 | 999

/** 照片信息 */
export interface PhotoItem {
  /** 照片类型（1: 全身照, 2: 脚照, 3: 胸照, 999: 其他照） */
  type: PhotoType
  /** 图片路径 */
  src: string
}

/** 测评链接 */
export interface ReviewLink {
  /** 测评日期 */
  date: string
  /** 测评链接地址 */
  url: string
}

/** 基础用户信息（列表页展示） */
export interface PersonBase {
  /** 唯一标识 */
  id: string
  /** 昵称 */
  nickname: string
  /** 性别 */
  gender: string
  /** 年龄 */
  age: number
  /** 身高（单位：cm） */
  height: number
  /** 体重（单位：kg） */
  weight: number
  /** 罩杯 */
  cupSize: string
  /** 鞋码 */
  shoeSize: number
  /** 所属省级行政区名称 */
  province: string
  /** 省级行政区划代码（默认 0） */
  provinceId: number
  /** 城市（预留字段，当前未使用） */
  city: string
  /** 城市 ID（预留字段，当前未使用） */
  cityId: number
  /** 地址描述 */
  addressDescription: string
  /** 头像 */
  avatar: string
  /** X（原名推特）账号 ID */
  xId: string
  /** QQ 联系方式 */
  qq: string
  /** 是否在首页展示（true/false） */
  isVisible: boolean
  /** 是否接受线下（true/false） */
  acceptOffline: boolean
  /** 是否接受重口（true/false） */
  acceptHeavy: boolean
  /** 充值活动是否有优惠（true/false） */
  hasRechargeActivityDiscount: boolean
  /** 是否复购运费减免（true/false） */
  freeShipping: boolean
  /** 袜子首单最低价（单位：元） */
  socksFirstOrderMinPrice: number
  /** 内衣首单最低价（单位：元） */
  underwearFirstOrderMinPrice: number
  /** 内裤首单价（单位：元） */
  pantiesFirstOrderMinPrice: number
  /** 创建时间 */
  createdTime: string
  /** 更新时间 */
  updateTime: string
  /** 职业 */
  job: string
  /** 照片列表 */
  photos: PhotoItem[]
  /** 视频列表 */
  videos: VideoItem[]
  /** 测评链接列表 */
  reviewLinks: ReviewLink[]
}

/** 视频信息 */
export interface VideoItem {
  /** 视频地址 */
  src: string
  /** 排序 */
  sort: number
}

/** 用户详细信息（详情页展示） */
export interface PersonDetail extends PersonBase {
  // PersonDetail 继承 PersonBase 的所有字段
  // 如需添加详情页特有字段，请在此处扩展
}

/** 导出类型定义和工厂方法 */
export const PersonModel = {
  /**
   * 创建基础用户信息
   * @param data - 部分用户数据
   * @returns 完整的用户基础信息对象
   */
  createBase(data: Partial<PersonBase> = {}): PersonBase {
    return {
      id: '',
      nickname: '',
      gender: '',
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
      isVisible: false,
      acceptOffline: false,
      acceptHeavy: false,
      hasRechargeActivityDiscount: false,
      freeShipping: true,
      socksFirstOrderMinPrice: 0,
      underwearFirstOrderMinPrice: 0,
      pantiesFirstOrderMinPrice: 0,
      createdTime: '',
      updateTime: '',
      job: '',
      photos: [],
      videos: [],
      reviewLinks: [],
      ...data
    }
  },

  /**
   * 创建用户详细信息
   * @param data - 部分用户详情数据
   * @returns 完整的用户详细信息对象
   */
  createDetail(data: Partial<PersonDetail> = {}): PersonDetail {
    return {
      ...this.createBase(data),
      ...data
    }
  }
}
