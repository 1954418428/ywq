# yw-showcase 人物展示

移动端人物展示应用（**React 18 + Rsbuild**），纯前端实现，支持 **H5**，预留后端接口入口。

## 技术栈

| 能力 | 方案 |
| --- | --- |
| UI | React 18（函数组件 + Hooks） |
| 构建 | Rsbuild 2（Rspack + SWC） |
| 路由 | React Router 7，`HashRouter` |
| 轮播 | Swiper 14（`swiper/react`） |
| 样式 | SCSS，750 设计稿 px 构建时转为 rem |
| 状态 | 组件内 `useState` / `useRef`，无全局状态库 |
| 数据 | 内置聚合数据快照，可选远端覆盖 |

## 功能

- **首页（列表页）**：多人物信息卡片，关键词搜索、省份筛选、下拉刷新、上拉分页加载
- **活动页**：活动列表（tabBar 第二个 tab），下拉刷新、上拉分页
- **详情页**：视频 + 四类照片（全屏预览）、基本资料、测评链接、优惠活动、联系入口
- **录入页**：按 `PersonDetail` 结构录入资料（当前仅打印 payload，未提交后端）
- **tabBar**：首页 / 活动两个 tab，图标位于 `src/assets/tabbar/`
- **大屏适配**：手机上按视口等比缩放；平板/桌面根字号封顶 24px，列表按 2/4/6 列自适应

## 目录结构

```
├── index.html                   # H5 模板 + 根字号/外壳样式
├── rsbuild.config.mjs           # Rsbuild 配置（入口、html、assetPrefix、dev server）
├── postcss.config.js            # 750 设计稿 px -> rem（与 Taro pxtransform 一致的 40 基准）
├── tsconfig.json
└── src/
    ├── main.jsx                 # createRoot + HashRouter
    ├── App.jsx                  # 路由表 + tabBar 显隐 + 布局模式 + Toast 宿主
    ├── app.scss                 # 全局骨架（flex / fixed 布局、工具类、元素 reset）
    ├── layout/index.js          # 路由 -> 布局模式（flex / fixed）
    ├── assets/tabbar/           # tabBar 图标
    ├── components/
    │   ├── PageHeader/          # 顶部导航栏（替换 Taro navigationBar）
    │   ├── TabBar/              # 底部 tab（替换 Taro tabBar）
    │   ├── PullToRefresh/       # 下拉刷新容器（替换 ScrollView refresher）
    │   ├── MediaCarousel/       # 媒体轮播（Swiper 的 React 组件）
    │   ├── ImagePreview/        # 全屏图片预览（替换 previewImage）
    │   ├── Toast/               # 轻量提示（替换 showToast）
    │   ├── InfoModal/           # 规则说明弹窗
    │   └── SelectionModal/      # 省份/选项选择抽屉
    ├── constants/index.js       # 省会、照片类型、活动规则文案
    ├── data/
    │   ├── yyq.json             # 聚合数据快照（构建时打包，默认数据源）
    │   └── mock.js              # 历史 Mock 数据（未使用）
    ├── model/user.ts            # PersonBase / PersonDetail 数据契约 + 工厂
    ├── pages/
    │   ├── index/               # 首页列表
    │   ├── activity/            # 活动列表
    │   ├── detail/              # 人物详情
    │   └── user-form/           # 资料录入
    ├── services/api.js          # ★ 唯一数据入口（请求、校验、缓存、分页）
    └── utils/
        ├── index.js             # 资源地址、复制文本、时长格式化
        └── storage.js           # localStorage 封装
```

## 运行

```bash
npm install
npm run dev          # 开发服务器 http://localhost:10086
npm run build        # 生产构建，输出 dist/
npm run preview      # 预览 dist/
npm run type-check   # tsc --noEmit（当前只覆盖 .ts 模型文件）
```

Node.js >= 20.19（Rsbuild 2 的要求；CI 使用 Node 20）。

## 路由（hash 模式）

保留了原 Taro 版本的页面路径，旧链接可以直接使用：

```
http://host:10086/#/pages/index/index
http://host:10086/#/pages/activity/index
http://host:10086/#/pages/detail/index?id=p001
http://host:10086/#/pages/user-form/index
```

未匹配的路径会重定向到首页。hash 路由不需要服务端配置 history fallback，可部署在任意子路径。

## 布局模式

布局按路由声明，集中在 [`src/layout/index.js`](src/layout/index.js) 的 `ROUTE_META`；`App` 把模式写到 `.app-shell` 的 `data-layout` 上，具体样式按属性选择器区分。

| 模式 | 结构 | 使用页面 |
| --- | --- | --- |
| `flex` | `.app-shell` 用 `position: fixed; top/right/bottom/left: 0` 贴住可视区（不用 `100vh`，避免移动端把浏览器底部工具栏算进去）；顶栏是 flex 第一行，内容容器（`.list` / `.activity-list` / `.user-form-body`）`overflow-y: auto` 内部滚动 | 首页、活动页、录入页 |
| `fixed` | 页面不限制高度，由文档滚动；`.app-header` 为 `position: fixed`，详情页用 `padding-top: var(--app-header-height)` 让出顶栏高度，底部联系栏也固定在视口底部 | 详情页 |

底部统一处理（变量定义在 [`src/app.scss`](src/app.scss) 的 `:root`）：

- `--safe-bottom = env(safe-area-inset-bottom)`：tabBar、详情底部按钮条都带这个内边距，适配 iPhone 底部安全区；
- `--app-tabbar-height` / `--app-contact-height` 是底栏实际高度（含安全区）：详情页用 `--app-contact-height` 预留 `padding-bottom`，滚到底不会被按钮条挡住；
- `--app-header-height = 80px + --safe-top`，两种布局的顶栏和内容让位共用；
- 不支持 `env()` 的浏览器变量回退为 `0px`，`viewport-fit=cover` 已在 `index.html` 的 viewport meta 中开启。

补充：`flex` 模式滚动的是内部容器，`fixed` 模式滚动的是 `window`；新增页面时在 `ROUTE_META` 加一行即可，未声明路由默认 `flex`；从 `fixed` 返回 `flex` 时 `App` 会把文档滚回顶部，列表自身的滚动位置由 keep-alive 保留。

## 适配方案

1. `index.html` 中根字号为 `clamp(20px, 5.3333vw, 24px)`：375px 宽时 20px，450px 以上封顶 24px；
2. `postcss.config.js` 在构建时把声明里的设计稿 px 除以 40 转成 rem（30px -> 0.75rem），与 Taro pxtransform 的 750 方案一致；
3. `@media` 条件里的 px 不转换，仍按真实视口宽度判断断点（600px / 1024px）；
4. 布局分 `flex` / `fixed` 两种模式（见上一节）；尺寸仍按 750 设计稿编写。

## 数据对接

页面只调用 `src/services/api.js`，切换后端不影响页面代码。

默认数据源是仓库里的静态快照 [`src/data/yyq.json`](src/data/yyq.json)，构建时直接打进 bundle，**运行时不会发起任何数据请求**。原先的 Supabase 签名地址在部分网络环境下 TLS 会被重置（`ERR_CONNECTION_RESET`），因此不再作为默认源。

数据文件结构：

```json
{
  "version": "0.0.1",
  "persons": [],
  "activities": []
}
```

更新数据：替换 `src/data/yyq.json` 后重新构建即可（push 到 `main` 后 GitHub Actions 会自动构建发布）。

### 接入远端接口

在 `index.html` 的入口脚本之前注入地址（无需改代码）：

```html
<script>window.__YYQ_DATA_URL__ = 'https://example.com/yyq.json'</script>
```

- 远端响应结构需与本地快照一致，`version`、`persons`、`activities` 缺一不可；
- 请求会追加 `cacheBust` 时间戳，成功后整份数据缓存 24 小时（`localStorage`，key 为 `yyq-data-cache`），并发请求会去重；
- **远端失败时自动回退到内置快照**，并在控制台打印 `console.warn`，页面不会出现空列表；
- 列表的搜索/省份筛选/分页都在前端完成；详情页支持列表预取 + 首帧同步直出；
- 用户数据按 `src/model/user.ts` 的 `PersonDetail` 结构组织。

## 与原 Taro 版本的主要差异

| 原实现 | 现实现 |
| --- | --- |
| `@tarojs/components`（View/Text/Image/Input/ScrollView/Swiper） | 原生 `div`/`span`/`img`/`input` 及 `MediaCarousel`（Swiper 14） |
| Taro 内置 navigationBar / tabBar | `PageHeader` / `TabBar` 组件 |
| `Taro.navigateTo` / `useRouter` | React Router 的 `useNavigate` / `useSearchParams` |
| `Taro.request` / storage / showToast / previewImage / clipboard | `fetch` / localStorage / `Toast` / `ImagePreview` / `navigator.clipboard` |
| ScrollView `refresherEnabled` | `PullToRefresh`（原生 touch 事件） |
| Taro 编译（vite runner + pxtransform） | Rsbuild + PostCSS 自定义 px->rem 插件 |

迁移时顺带修复的问题：

- 详情页引用未定义的 `pageStyle`，直接打开/刷新详情会抛 `ReferenceError`；
- 上拉加载在 `loading` 状态提交前可能重复追加同一页；
- 没有视频的人物，详情页媒体 tab 初始高亮错误；
- `Taro.request` 用字符串拼接 cacheBust 参数，遇到不带查询串的数据地址会拼错（现改为 `URL` API）。

为对齐 Taro 页面栈的体验，首页和活动页在 `App.jsx` 中常驻挂载（keep-alive），只切换显隐：从详情返回或切换 tab 时，列表数据、筛选条件和滚动位置都会保留。

## 样式注意

- 所有 SCSS 仅使用类选择器；
- 布局用 flex / grid，尺寸写 750 设计稿 px，构建时自动转 rem；
- H5 专属外壳样式（根字号、`#root` 背景与阴影）写在 `index.html` 中。

## 部署

GitHub Actions（`.github/workflows/static.yml`）会在 push 到 `main` 时执行 `npm ci && npm run build`，把 `dist/` 发布到 GitHub Pages。`assetPrefix` 为相对路径，因此仓库部署在 `/<repo>/` 子路径下也能正确加载资源。
