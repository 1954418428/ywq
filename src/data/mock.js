/**
 * 本地 Mock 数据，人员字段按 src/model/user.ts 的 PersonDetail 结构生成。
 */
import { PHOTO_TYPES, PROVINCE_CAPITALS } from '../constants'
import { PersonModel } from '../model/user'

const IMG = (seed, w = 600, h = 400) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`
const AVATAR = (seed) => `https://picsum.photos/seed/${seed}/200/200`
const VIDEO_SOURCES = [
  'https://download.samplelib.com/mp4/sample-5s.mp4',
  'https://samplelib.com/vertical/sample-vertical-5s.mp4'
]

const personSeeds = [
  ['林晓', '女', 26, 110000, '产品经理'],
  ['陈默', '男', 31, 440000, '前端工程师'],
  ['苏晴', '女', 24, 330000, '视觉设计师'],
  ['周远', '男', 35, 110000, '后端架构师'],
  ['何雨', '女', 28, 510000, '运营策划'],
  ['吴迪', '男', 22, 440000, '在校研究生'],
  ['郑冉', '女', 30, 320000, '数据分析师'],
  ['王砚', '男', 27, 420000, '测试工程师'],
  ['李潇', '女', 29, 610000, '市场经理'],
  ['张阔', '男', 33, 320000, '运维工程师'],
  ['刘念', '女', 25, 430000, '新媒体编辑'],
  ['赵屹', '男', 38, 350000, '技术总监'],
  ['顾言', '男', 28, 310000, '摄影师'],
  ['沈宁', '女', 27, 320000, '交互设计师'],
  ['唐可', '女', 23, 440000, '插画师'],
  ['许川', '男', 32, 510000, '建筑师'],
  ['叶青', '女', 29, 330000, '医生'],
  ['蒋一', '男', 26, 410000, '教师'],
  ['罗茜', '女', 31, 430000, '律师'],
  ['邵明', '男', 34, 370000, '金融顾问'],
  ['方宁', '女', 24, 350000, '品牌策划'],
  ['韩松', '男', 30, 210000, '软件工程师'],
  ['程露', '女', 28, 420000, '纪录片导演'],
  ['魏然', '男', 25, 450000, '游戏开发者'],
  ['白露', '女', 26, 520000, '舞蹈老师'],
  ['秦越', '男', 36, 620000, '创业者'],
  ['夏禾', '女', 22, 530000, '研究生'],
  ['孟哲', '男', 29, 130000, '机械工程师'],
  ['姚瑶', '女', 33, 140000, '人力资源经理'],
  ['邱泽', '男', 27, 150000, '编辑'],
  ['陶然', '女', 30, 230000, '营养师'],
  ['傅航', '男', 24, 220000, '动画师'],
  ['江月', '女', 35, 360000, '建筑设计师'],
  ['袁野', '男', 28, 370000, '产品运营'],
  ['莫言', '女', 27, 340000, '心理咨询师'],
  ['陆沉', '男', 31, 120000, '项目经理'],
  ['姜禾', '女', 23, 460000, '旅行博主'],
  ['段林', '男', 37, 500000, '医生'],
  ['温以', '女', 29, 650000, '翻译'],
  ['季风', '男', 26, 640000, '摄影爱好者'],
  ['乔木', '女', 32, 630000, '环境工程师'],
  ['安澜', '男', 28, 540000, '户外领队'],
  ['蓝田', '女', 25, 130000, '花艺师'],
  ['苏禾', '男', 34, 320000, '音乐制作人'],
  ['陆远', '男', 30, 350000, '供应链经理'],
  ['宋乔', '女', 24, 410000, '文案编辑'],
  ['明川', '男', 33, 430000, '体育教练'],
  ['简宁', '女', 28, 440000, '电商运营'],
  ['闻溪', '男', 29, 810000, '金融分析师'],
  ['林海', '女', 27, 820000, '活动策划']
]

/** 人员列表（50 条）；每条均包含完整详情媒体数据。 */
export const mockPersons = personSeeds.map(
  ([nickname, gender, age, provinceCode, job], index) => {
    const id = `p${String(index + 1).padStart(3, '0')}`
    const province = PROVINCE_CAPITALS.find(
      (item) => item.provinceId === provinceCode
    )
    const createdTime = `2026-${String((index % 9) + 1).padStart(2, '0')}-${String(
      (index % 27) + 1
    ).padStart(2, '0')} 10:00:00`

    return PersonModel.createDetail({
      id,
      nickname,
      gender,
      age,
      height: 158 + ((index * 7) % 31),
      weight: 48 + ((index * 3) % 28),
      cupSize: 'C',
      shoeSize: 35 + (index % 8),
      province: province.province,
      provinceId: province.provinceId,
      addressDescription: `${province.capital}周边`,
      avatar: AVATAR(id),
      xId: 'tb_fzy111',
      qq: String(100000001 + index),
      acceptOffline: index % 3 === 0,
      freeShipping: true,
      socksFirstOrderMinPrice: 29 + (index % 5) * 10,
      underwearFirstOrderMinPrice: 39 + (index % 6) * 15,
      createdTime,
      updateTime: createdTime,
      job,
      photos: PHOTO_TYPES.map(({ type }) => ({
        type,
        src: IMG(`${id}-photo-${type}`)
      })),
      videos: VIDEO_SOURCES.map((src, videoIndex) => ({
        src,
        sort: videoIndex + 1
      })),
      reviewLinks: [
        {
          date: createdTime.slice(0, 10),
          url: 'https://x.com/tb_fzy111'
        },
        {
          date: `2026-${String(((index + 1) % 9) + 1).padStart(2, '0')}-${String(((index + 7) % 27) + 1).padStart(2, '0')}`,
          url: 'https://x.com/tb_fzy111'
        }
      ]
    })
  }
)

/** 详情以用户模型为准；列表与详情共用同一份 Mock 记录。 */
export const mockDetails = Object.fromEntries(
  mockPersons.map((person) => [person.id, person])
)

/** 活动列表（活动页数据） */
export const mockActivities = [
  {
    id: 'a001',
    title: '城市摄影漫步',
    content: '周末外滩摄影漫步，边走边拍，记录城市光影。自带相机或手机即可，限 20 人。',
    date: '2026-10-18'
  },
  {
    id: 'a002',
    title: '前端技术沙龙',
    content: '主题：React 18 并发特性实战。两位一线工程师分享，含现场 Q&A 与茶歇。',
    date: '2026-10-20'
  },
  {
    id: 'a003',
    title: '插画创作工作坊',
    content: '从零完成一幅城市主题插画，画材全部提供，零基础可参加，限 15 人。',
    date: '2026-10-22'
  },
  {
    id: 'a004',
    title: '城市夜跑团',
    content: '每周三晚 8 公里夜跑，配速 6 分以内，路线：滨江大道往返。免费参加。',
    date: '2026-10-23'
  },
  {
    id: 'a005',
    title: '读书分享会',
    content: '本月共读《设计心理学》，分享各自的阅读笔记与实践案例，线上+线下同步。',
    date: '2026-10-25'
  },
  {
    id: 'a006',
    title: '独立游戏体验日',
    content: '试玩 6 款独立游戏 demo，与开发者面对面交流，欢迎带着作品来。',
    date: '2026-10-27'
  },
  {
    id: 'a007',
    title: '户外徒步露营',
    content: '两天一夜轻装徒步露营，装备租赁与路线攻略群内共享，限 12 人。',
    date: '2026-11-01'
  }
]
