# yw-showcase 人物展示

移动端人物展示应用（**Taro 4 + React 18 + JavaScript**），支持 **H5**，纯前端实现，预留后端接口入口。

## 功能

- **首页（列表页）**：多人物基本信息卡片列表，支持关键词搜索、下拉刷新、上拉分页加载
- **活动页**：活动列表（tabBar 第二个 tab），支持下拉刷新、上拉分页加载
- **详情页**：基本信息 + **四类图片**（支持全屏预览）+ **视频**（播放器）
- **tabBar**：首页 / 活动 两个 tab（`app.config.js` 配置驱动，图标位于 `src/assets/tabbar/`）
- **大屏适配**：移动端优先；rem 根字号限制在 20~24px（`maxRootSize: 24`），手机上满屏贴合，平板/桌面浏览器下自动变为 450px 宽的居中"手机卡片"，元素比例与设计稿一致

## 目录结构

```
├── config/                  # Taro 构建配置
│   ├── index.js             #   designWidth=750，H5 hash 路由
│   ├── dev.js / prod.js     #   环境 deltas
├── src/
│   ├── app.js / app.config.js / app.scss   # 应用入口
│   ├── index.html           # H5 模板（含大屏限宽居中外壳样式）
│   ├── constants/index.js   # 省会及图片类型常量
│   ├── model/user.ts        # 用户数据模型
│   ├── services/
│   │   ├── request.js       # ★ 统一请求封装（域名/token/错误处理）
│   │   └── api.js           # ★ 接口定义（读取 Supabase 聚合 JSON）
│   ├── data/
│   │   ├── mock.js          # 本地 Mock 数据（保留，不参与运行时数据加载）
│   │   ├── persons.json     # 人员数据的本地 JSON 快照
│   │   ├── activities.json  # 活动数据
│   │   └── yyq.json         # 聚合数据（version、persons、activities）
│   ├── utils/index.js       # 资源地址拼接、时长格式化
│   └── pages/
│       ├── index/           # 首页列表（tabBar tab 1）
│       ├── activity/        # 活动列表（tabBar tab 2）
│       └── detail/          # 详情页（图片/视频）
```

## 运行

```bash
npm install            # 建议使用可达的 registry
# H5
npm run dev:h5         # 开发（dist/ 产物，浏览器打开）
npm run build:h5       # 构建
```

### 路由（hash 模式）

H5 使用 hash 路由（`http://host:10086/#/pages/index/index`）。路由保存在 URL 的 `#` 后，刷新时仍请求 HTML 入口，不需要生产服务器配置 history fallback。`publicPath` 已设为 `/`；如部署在子路径，需同时调整 `publicPath`。

## 对接后端接口

页面只调用 `src/services/api.js`，接口切换不影响页面代码：

1. 人员和活动数据从 Supabase Storage 的 JSON 地址加载，响应对象包含 `version`、`persons` 和 `activities`；前端缓存整份数据 1 天，过期后重新请求；
2. 若后端返回相对路径的媒体地址，设置 `RESOURCE_BASE_URL` 前缀；
3. 若响应包结构不是 `{ code, message, data }`，在 `src/services/request.js` 中调整解包逻辑；需要登录态时在该文件的 `buildHeader` 中补充 token；
4. 用户数据按 `src/model/user.ts` 中的 `PersonDetail` 结构组织。远程聚合数据请求失败时会将错误返回给调用方，不使用本地兜底数据。`src/data/yyq.json` 是版本号、人员和活动数据的本地聚合快照。当前只使用固定省会数据，城市字段暂不使用。

## 样式注意

- 所有 SCSS 仅使用**类选择器**
- 布局用 flex；尺寸用 750 设计稿 px（Taro 自动转换）
- H5 专属的 `html/body/#app` 外壳样式写在 `index.html` 中
