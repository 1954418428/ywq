/**
 * 本地 Mock 数据
 * 字段结构即"后端接口约定"：对接后端后保持一致即可无缝切换
 *
 * 图片样例：picsum.photos 随机图
 * 视频样例：Google 公开示例视频
 * 音频样例：SoundHelix 公开示例音频
 */

const IMG = (seed, w = 600, h = 400) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`
const AVATAR = (seed) => `https://picsum.photos/seed/${seed}/200/200`
const VIDEO =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
const AUDIO = (name) => `https://www.soundhelix.com/examples/mp3/${name}.mp3`

/** 人员列表（首页数据） */
export const mockPersons = [
  {
    id: 'p001',
    name: '林晓',
    gender: '女',
    age: 26,
    city: '上海',
    occupation: '产品经理',
    avatar: AVATAR('linxiao'),
    brief: '专注 B 端产品五年，喜欢摄影和徒步。',
    tags: ['产品', '摄影', '徒步']
  },
  {
    id: 'p002',
    name: '陈默',
    gender: '男',
    age: 31,
    city: '深圳',
    occupation: '前端工程师',
    avatar: AVATAR('chenmo'),
    brief: 'React / Vue 双修，热爱开源与机械键盘。',
    tags: ['前端', '开源', '键盘']
  },
  {
    id: 'p003',
    name: '苏晴',
    gender: '女',
    age: 24,
    city: '杭州',
    occupation: '视觉设计师',
    avatar: AVATAR('suqing'),
    brief: '插画爱好者，作品多次参展。',
    tags: ['设计', '插画', '看展']
  },
  {
    id: 'p004',
    name: '周远',
    gender: '男',
    age: 35,
    city: '北京',
    occupation: '后端架构师',
    avatar: AVATAR('zhouyuan'),
    brief: '高并发系统设计，马拉松跑者。',
    tags: ['架构', '马拉松', '读书']
  },
  {
    id: 'p005',
    name: '何雨',
    gender: '女',
    age: 28,
    city: '成都',
    occupation: '运营策划',
    avatar: AVATAR('heyu'),
    brief: '内容运营五年，火锅十级爱好者。',
    tags: ['运营', '写作', '美食']
  },
  {
    id: 'p006',
    name: '吴迪',
    gender: '男',
    age: 22,
    city: '广州',
    occupation: '在校研究生',
    avatar: AVATAR('wudi'),
    brief: '人机交互方向，独立游戏开发者。',
    tags: ['HCI', '游戏', 'Unity']
  },
  {
    id: 'p007',
    name: '郑冉',
    gender: '女',
    age: 30,
    city: '南京',
    occupation: '数据分析师',
    avatar: AVATAR('zhengran'),
    brief: '用数据讲故事，业余长跑与烘焙。',
    tags: ['数据', '长跑', '烘焙']
  },
  {
    id: 'p008',
    name: '王砚',
    gender: '男',
    age: 27,
    city: '武汉',
    occupation: '测试工程师',
    avatar: AVATAR('wangyan'),
    brief: '自动化测试专家，桌游收藏书友。',
    tags: ['测试', '自动化', '桌游']
  },
  {
    id: 'p009',
    name: '李潇',
    gender: '女',
    age: 29,
    city: '西安',
    occupation: '市场经理',
    avatar: AVATAR('lixiao'),
    brief: '品牌市场五年，古筝十级。',
    tags: ['市场', '古筝', '旅行']
  },
  {
    id: 'p010',
    name: '张阔',
    gender: '男',
    age: 33,
    city: '苏州',
    occupation: '运维工程师',
    avatar: AVATAR('zhangkuo'),
    brief: '云原生与稳定性建设，钓鱼发烧友。',
    tags: ['运维', 'K8s', '钓鱼']
  },
  {
    id: 'p011',
    name: '刘念',
    gender: '女',
    age: 25,
    city: '长沙',
    occupation: '新媒体编辑',
    avatar: AVATAR('liunian'),
    brief: '短视频策划与剪辑，播客主播。',
    tags: ['新媒体', '剪辑', '播客']
  },
  {
    id: 'p012',
    name: '赵屹',
    gender: '男',
    age: 38,
    city: '厦门',
    occupation: '技术总监',
    avatar: AVATAR('zhaoyi'),
    brief: '团队管理与技术选型，潜水教练。',
    tags: ['管理', '潜水', '技术']
  }
]

/** 人员详情（key 为人员 id，含图片/视频/音频媒体） */
export const mockDetails = {
  p001: {
    ...personBrief('p001', '从 0 到 1 搭建 B 端产品矩阵，主导三款 SaaS 产品设计。'),
    photos: [IMG('p001-1'), IMG('p001-2'), IMG('p001-3')],
    videos: [
      {
        id: 'p001-v1',
        title: '产品评审现场片段',
        poster: IMG('p001-v1', 600, 340),
        url: VIDEO,
        duration: 15
      }
    ],
    audios: [
      {
        id: 'p001-a1',
        title: '播客：聊聊产品思维',
        url: AUDIO('SoundHelix-1'),
        duration: 372
      },
      {
        id: 'p001-a2',
        title: '音频：产品复盘节选',
        url: AUDIO('SoundHelix-2'),
        duration: 325
      }
    ]
  },
  p002: {
    ...personBrief('p002', '开源组件库维护者，社区演讲常客。'),
    photos: [IMG('p002-1'), IMG('p002-2'), IMG('p002-3')],
    videos: [
      {
        id: 'p002-v1',
        title: '技术分享：React 性能优化',
        poster: IMG('p002-v1', 600, 340),
        url: VIDEO,
        duration: 15
      }
    ],
    audios: [
      {
        id: 'p002-a1',
        title: '播客：前端工程化漫谈',
        url: AUDIO('SoundHelix-3'),
        duration: 418
      }
    ]
  },
  p003: {
    ...personBrief('p003', '个人插画展「城市呼吸」主理人。'),
    photos: [IMG('p003-1'), IMG('p003-2'), IMG('p003-3')],
    videos: [
      {
        id: 'p003-v1',
        title: '创作过程延时记录',
        poster: IMG('p003-v1', 600, 340),
        url: VIDEO,
        duration: 15
      }
    ],
    audios: [
      {
        id: 'p003-a1',
        title: '音频：灵感来源自述',
        url: AUDIO('SoundHelix-4'),
        duration: 289
      }
    ]
  }
}

/** 未单独编写详情的人员，生成通用详情 */
;['p004', 'p005', 'p006', 'p007', 'p008', 'p009', 'p010', 'p011', 'p012'].forEach(
  (id, i) => {
    mockDetails[id] = {
      ...personBrief(id, '个人简介（示例）：热爱生活，专注专业。'),
      photos: [IMG(`${id}-1`), IMG(`${id}-2`), IMG(`${id}-3`)],
      videos: [
        {
          id: `${id}-v1`,
          title: '个人介绍视频',
          poster: IMG(`${id}-v1`, 600, 340),
          url: VIDEO,
          duration: 15
        }
      ],
      audios: [
        {
          id: `${id}-a1`,
          title: '语音自述',
          url: AUDIO(`SoundHelix-${(i % 8) + 5}`),
          duration: 300 + i * 7
        }
      ]
    }
  }
)

/** 组装基础信息（复用列表字段，保持接口结构一致） */
function personBrief(id, detailIntro) {
  const base = mockPersons.find((p) => p.id === id) || {}
  return { ...base, id, intro: detailIntro }
}

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
