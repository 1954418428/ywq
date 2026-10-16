/**
 * 全局常量
 * 对接后端时只需修改本文件与 services/，页面代码无需改动
 */

// 后端接口基础地址（部署后替换为真实地址）
export const API_BASE_URL = 'https://api.example.com'

// 是否使用本地 Mock 数据；后端就绪后置为 false 即切换真实接口
export const USE_MOCK = true

// Mock 数据模拟延迟（ms），纯前端阶段置 0 不等待；需要观察 loading 状态时可临时调大
export const MOCK_DELAY = 0

// 媒体资源（图片/视频/音频）地址前缀：
// 后端返回相对路径（如 /upload/a.jpg）时自动拼接
export const RESOURCE_BASE_URL = ''

// 分页默认值
export const DEFAULT_PAGE_SIZE = 10
