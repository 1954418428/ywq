# yw-showcase 人物展示

移动端人物展示应用（**Taro 4 + React 18 + JavaScript**），支持 **H5** 与 **原生 APP（React Native / Expo）** 双端，纯前端实现，预留后端接口入口。

## 功能

- **首页（列表页）**：多人物基本信息卡片列表，支持关键词搜索、下拉刷新、上拉分页加载
- **活动页**：活动列表（tabBar 第二个 tab），支持下拉刷新、上拉分页加载
- **详情页**：基本信息 + **图片**（轮播 + 全屏预览）+ **视频**（播放器）+ **音频**（自定义播放器）
- **tabBar**：首页 / 活动 两个 tab（`app.config.js` 配置驱动，图标位于 `src/assets/tabbar/`）
- **大屏适配**：移动端优先；rem 根字号限制在 20~24px（`maxRootSize: 24`），手机上满屏贴合，平板/桌面浏览器下自动变为 450px 宽的居中"手机卡片"，元素比例与设计稿一致；RN 端 portrait 固定

## 目录结构

```
├── config/                  # Taro 构建配置
│   ├── index.js             #   designWidth=750，H5 hash 路由
│   ├── dev.js / prod.js     #   环境 deltas
├── src/
│   ├── app.js / app.config.js / app.scss   # 应用入口（仅类选择器，RN 兼容）
│   ├── index.html           # H5 模板（含大屏限宽居中外壳样式）
│   ├── constants/index.js   # ★ 对接后端入口：API_BASE_URL / USE_MOCK 等
│   ├── services/
│   │   ├── request.js       # ★ 统一请求封装（域名/token/错误处理）
│   │   └── api.js           # ★ 接口定义（当前走 Mock，一键切换真实接口）
│   ├── data/mock.js         # Mock 数据（字段结构即接口约定）
│   ├── utils/index.js       # 资源地址拼接、时长格式化
│   └── pages/
│       ├── index/           # 首页列表（tabBar tab 1）
│       ├── activity/        # 活动列表（tabBar tab 2）
│       └── detail/          # 详情页（图片/视频/音频 + AudioPlayer 组件）
├── index.js                 # RN（Expo）应用入口
├── app.json                 # Expo 配置（包名/图标/插件）
└── metro.config.js          # RN Metro 配置
```

## 运行

```bash
npm install            # 建议使用可达的 registry
# H5
npm run dev:h5         # 开发（dist/ 产物，浏览器打开）
npm run build:h5       # 构建
# 原生 APP（React Native / Expo 50，需 Node 18+、Xcode/Android Studio）
npm run dev:rn         # 开发 watch（Metro）
npm run build:rn       # 打 JSBundle
```

> 说明：RN 端壳配置（index.js / app.json / metro.config.js）按 Expo 50 + RN 0.73 编写；
> 如与你本地 `taro init --template rn` 生成的官方模板有出入，以官方模板为准调整壳文件，`src/` 源码无需改动。

### 路由（history 模式）

H5 使用 browser history 路由（`http://host:10086/pages/index/index`），**生产部署**需要服务端 fallback（所有路由回退到 index.html），nginx 示例：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

`publicPath` 已设为 `/`（history 模式下资源必须绝对路径）；如部署在子路径，需同时改 `publicPath`。

## 对接后端接口

页面只调用 `src/services/api.js`，接口切换不影响页面代码：

1. `src/constants/index.js` 中把 `API_BASE_URL` 改为真实地址、`USE_MOCK` 置为 `false`；
2. 若后端返回相对路径的媒体地址，设置 `RESOURCE_BASE_URL` 前缀；
3. 若响应包结构不是 `{ code, message, data }`，在 `src/services/request.js` 中调整解包逻辑；需要登录态时在该文件的 `buildHeader` 中补充 token；
4. `src/data/mock.js` 中的字段结构（列表项：`id/name/gender/age/city/occupation/avatar/brief/tags`；详情：`intro/photos[]/videos[]/audios[]`）即接口约定，保持一致即可无缝切换。

## 样式注意（RN 兼容）

- 所有 SCSS 仅使用**类选择器**（RN 不支持标签/ID/后代选择器与伪类）
- 布局用 flex；尺寸用 750 设计稿 px（Taro 自动转换）
- H5 专属的 `html/body/#app` 外壳样式写在 `index.html` 中，不进 RN
- RN 不支持 `vh` 单位，页面高度用 `flex: 1` 撑开（H5 通过 `process.env.TARO_ENV` 条件补充）
