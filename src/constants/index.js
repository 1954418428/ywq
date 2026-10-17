/**
 * 全局常量（纯前端版本）
 */

// 分页默认值
export const DEFAULT_PAGE_SIZE = 20

// 省级行政区对应的固定省会数据；ID 使用省会城市的行政区划代码。
export const PROVINCE_CAPITALS = [
  { provinceId: 110000, province: '北京', capital: '北京市', capitalId: 110100 },
  { provinceId: 120000, province: '天津', capital: '天津市', capitalId: 120100 },
  { provinceId: 130000, province: '河北省', capital: '石家庄市', capitalId: 130100 },
  { provinceId: 140000, province: '山西省', capital: '太原市', capitalId: 140100 },
  { provinceId: 150000, province: '内蒙古', capital: '呼和浩特市', capitalId: 150100 },
  { provinceId: 210000, province: '辽宁', capital: '沈阳市', capitalId: 210100 },
  { provinceId: 220000, province: '吉林', capital: '长春市', capitalId: 220100 },
  { provinceId: 230000, province: '黑龙江', capital: '哈尔滨市', capitalId: 230100 },
  { provinceId: 310000, province: '上海', capital: '上海市', capitalId: 310100 },
  { provinceId: 320000, province: '江苏', capital: '南京市', capitalId: 320100 },
  { provinceId: 330000, province: '浙江', capital: '杭州市', capitalId: 330100 },
  { provinceId: 340000, province: '安徽', capital: '合肥市', capitalId: 340100 },
  { provinceId: 350000, province: '福建', capital: '福州市', capitalId: 350100 },
  { provinceId: 360000, province: '江西', capital: '南昌市', capitalId: 360100 },
  { provinceId: 370000, province: '山东', capital: '济南市', capitalId: 370100 },
  { provinceId: 410000, province: '河南', capital: '郑州市', capitalId: 410100 },
  { provinceId: 420000, province: '湖北', capital: '武汉市', capitalId: 420100 },
  { provinceId: 430000, province: '湖南', capital: '长沙市', capitalId: 430100 },
  { provinceId: 440000, province: '广东', capital: '广州市', capitalId: 440100 },
  { provinceId: 450000, province: '广西', capital: '南宁市', capitalId: 450100 },
  { provinceId: 460000, province: '海南', capital: '海口市', capitalId: 460100 },
  { provinceId: 500000, province: '重庆', capital: '重庆市', capitalId: 500100 },
  { provinceId: 510000, province: '四川', capital: '成都市', capitalId: 510100 },
  { provinceId: 520000, province: '贵州', capital: '贵阳市', capitalId: 520100 },
  { provinceId: 530000, province: '云南', capital: '昆明市', capitalId: 530100 },
  { provinceId: 540000, province: '西藏', capital: '拉萨市', capitalId: 540100 },
  { provinceId: 610000, province: '陕西', capital: '西安市', capitalId: 610100 },
  { provinceId: 620000, province: '甘肃', capital: '兰州市', capitalId: 620100 },
  { provinceId: 630000, province: '青海', capital: '西宁市', capitalId: 630100 },
  { provinceId: 640000, province: '宁夏', capital: '银川市', capitalId: 640100 },
  { provinceId: 650000, province: '新疆', capital: '乌鲁木齐市', capitalId: 650100 },
  { provinceId: 710000, province: '台湾', capital: '台北市', capitalId: 710100 },
  { provinceId: 810000, province: '香港', capital: '香港', capitalId: 810100 },
  { provinceId: 820000, province: '澳门', capital: '澳门', capitalId: 820100 }
]

export const PHOTO_TYPES = [
  { type: 1, label: '全身照' },
  { type: 2, label: '脚照' },
  { type: 3, label: '胸照' },
  { type: 999, label: '其他照' }
]

export const ACTIVITY_RULES = {
  offline: {
    title: '线下交易说明',
    content: '线下当面交易原味，可闻鞋脚等'
  },
  recharge: {
    title: '充值活动优惠规则',
    content: '卖家充值活动，例如充值100元到账可使用120元并赠送xxx福利，该优惠用于减免充值金额，永久打9折，即"充值90元到账120元并赠送xxx福利"'
  },
  freeShipping: {
    title: '复购运费减免规则',
    content: '非第1单，后续所有单运费减半（包括偏远地区）'
  },
  firstOrderPrice: {
    title: '首单价格规则',
    content: '最低价已包含运费，首单袜子和内裤同时购买可打9折'
  }
}
