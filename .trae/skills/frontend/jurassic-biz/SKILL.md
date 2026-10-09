---
name: jurassic-biz
description: >-
  Guides Vue 3 frontend work with the private Jurassic Biz (jurassic-biz 2.x)
  business component library: Jura-prefixed visualization, file, GIS, GMS,
  H5, baike, report, draw-tools, and upload/download wrappers built on
  jurassic-ui. Use when implementing geological well logs, map graphics,
  file preview/upload, baike wiki, finereport, OnlyOffice docs, or
  component store preview/metric reporting with jurassic-biz.
version: 1.0.0
status: stable
owner: "@jurassic-cooker-team"
updated: 2026-10-07
deprecated: false
---

# Jurassic Biz（2.x / Vue 3）

基于 **Vue 3 + jurassic-ui** 的公司私有业务组件库。封装地质/油气行业可视化、文件管理、成图工具等业务逻辑组件。当前稳定版 **2.0.9**。Vue 2 请用 `jurassic-biz@1`，不要套用本技能。

源码位置：`packages/`（组件实现）、`examples/`（使用示例）。

## 硬性约定

- 组件注册：`import JurassicBizCom from 'jurassic-biz'` + `import 'jurassic-biz/lib/jurassic-biz.css'` + `Vue.use(JurassicBizCom)`。全量注册，不要按需。
- **表格场景**：常规列表用 jurassic-ui 的 `JuraTable`；**大数据量优先 `jura-vxe-table`（JuraVxeTable）**。**禁止用 `div` 手写表格**（含 flex/grid 模拟行列），除非有明确例外并在代码旁或 PR 中说明理由。电子表格编辑场景用 `jura-univer-table`，不在此禁令内。
- 所有 API 请求和文件 URL 从 **`localStorage.access_token`** 取鉴权凭据。**宿主系统负责写入**，组件库不负责登录。401 时自动清除 token 并刷新页面。
- **bo 空值拦截（全局规则）**：所有依赖后端数据的可视化组件（JuraBEcharts、JuraH5View、JuraBGms、JuraBaikeView、JuraBaguwen、JuraDocView、JuraReportView、JuraExternalView），在 `searchParams.bo` 不存在时**不会发起成图数据请求**。
- JuraBaikeView **无论何种模式**，没有 bo 参数时禁止请求数据接口，否则报错。
- 预览模式 prop 名为 `priviewShow`（注意拼写），仅在 JuraDrawTools 外层用 `preview` / `showTable`。
- 组件库所有请求走 `packages/utils/request.ts`，请求头自动加 `Authorization: Bearer <token>`。
- 国际化跟随宿主系统语言（`this.$locale`）。
- 先读本文件；查组件 API 读 [components.md](components.md)。

## 安装（业务项目）

```bash
# 公司内网需设置 npm 代理
npm config set registry http://192.168.1.92:4873/
npm i --save jurassic-biz
```

### 环境要求

| 项目 | 要求 |
| --- | --- |
| Node.js | **20.19+**（Vite 7 兼容） |
| 构建 | `NODE_OPTIONS='--max-old-space-size=8192'` 防 OOM |
| .npmrc | 必须含 `include=optional` |
| Vite resolve.extensions | 必须含 `.vue` |
| Vite css.preprocessorMaxWorkers | 资源受限服务器设为 `0` |
| Nginx 代理服务 | file、component、resources、bd-model、master |
| Nginx file-viewer | `^~ /file-viewer/` 前缀匹配，放正则规则之前；显式声明 mjs/wasm/woff2/otf/ttf/pfb/bcmap MIME 类型 |
| Nginx conf.d | 含裸 location 块的 include 文件不要放此目录 |

## 推荐接入

`main.ts`：

```ts
import { createApp } from 'vue'
import JurassicBizCom from 'jurassic-biz'
import 'jurassic-biz/lib/jurassic-biz.css'
import App from './App.vue'

const app = createApp(App)
app.use(JurassicBizCom)
app.mount('#app')
```

非 qiankun 环境需手动设置 access_token：

```javascript
if (!window.__POWERED_BY_QIANKUN__) {
  if (!localStorage.getItem('access_token')) {
    localStorage.setItem('access_token', this.$store.state.user.access_token)
  }
}
```

### 多语言接入（vue-i18n）

组件库导出 `lang` 多语言包（`zh_CN` / `en_US`），宿主必须合并进自己的 vue-i18n messages，否则组件内文案缺失：

```ts
// src/locales/index.ts
import { createI18n } from 'vue-i18n'
import { lang as juraBizLang } from 'jurassic-biz'   // jurassic-biz 多语言包
import { locale as juraLocale } from 'jurassic-ui'    // jurassic-ui 多语言包
const { zh_CN: juraBizZhCN, en_US: juraBizEnUS } = juraBizLang
const { zh_CN: juraZhCN, en_US: juraEnUS } = juraLocale

const messages = {
  'zh-CN': { ...juraZhCN, ...juraBizZhCN, ...projectZhCN }, // 项目语言包放最后覆盖
  'en-US': { ...juraEnUS, ...juraBizEnUS, ...projectEnUS },
}
const i18n = createI18n({ legacy: false, locale: localStorage.getItem('lang')?.replace('_', '-') || 'zh-CN', fallbackLocale: 'zh-CN', messages })
```

## 导出清单

`JuraBoSelect`，`JuraPtSelect`，`JuraBigDataSelect`，`JuraBigDataList`，`JuraBigDataTree`，`JuraFileUpload` / `JuraFileListArea` / `JuraUploadArea`，`JuraFileDownload`，`JuraFilePriview`，`JuraImagePreView`，`JuraBEcharts` / `JuraEcharts`，`JuraH5View` / `JuraH5Curve`，`JuraGis`，`JuraBaikeView`，`JuraBaguwen` / `JuraEditor`，`JuraBGms` / `JuraGeoMap`，`JuraDocView`，`JuraReportView`，`JuraExternalView`，`JuraDrawTools` / `JuraDrawData`，`JuraH5Design`，`JuraMultiLangCollectionTool`，`JuraVxeTable`，`JuraUniverTable`，`JuraTwoLayout`，`JuraUnifiedCompEnter`，`JuraWordEditor`，`JuraH5Design`。

另导出：`lang`（多语言包）、`registerDirectives`（注册 `v-loading` 指令）。

## 组件识别决策树

根据用户需求关键词，按下表定位组件。命中后查 [components.md](components.md) 对应章节。

| 用户意图关键词 | 组件标签 | 组件名 | 章节 |
|---|---|---|---|
| 选井/选对象/BO 选择 | `jura-bo-select` | JuraBoSelect | §1 |
| 选数据集/选 PT/业务表 | `jura-pt-select` | JuraPtSelect | §2 |
| 大数据下拉/虚拟下拉 | `jura-big-data-select` | JuraBigDataSelect | §3 |
| 大数据列表/虚拟列表/无限滚动 | `jura-big-data-list` | JuraBigDataList | §4 |
| 大数据树/虚拟树 | `jura-big-data-tree` | JuraBigDataTree | §5 |
| 文件上传/断点续传/分片上传 | `JuraFileUpload` | JuraFileUpload | §6 |
| 文件下载/分片下载 | `JuraFileDownload` | JuraFileDownload | §7 |
| 文件预览/kkFileView/file-viewer | `jura-file-priview` | JuraFilePriview | §8 |
| 图片预览/缩略图 | `jura-image-preView` | JuraImagePreView | §9 |
| ECharts 图表/柱状图/折线图 | `JuraBEcharts` | JuraBEcharts | §10 |
| H5 单井图/曲线/柱状图 | `juraH5View` | JuraH5View | §11 |
| GIS 地图/圈选/框选 | `jura-gis` | JuraGis | §12 |
| 百科/知识库/Wiki | `jura-baike-view` | JuraBaikeView | §13 |
| 八股文/富文本/wangEditor | `JuraBaguwen` | JuraBaguwen | §14 |
| GMS 地图/D3/单井/地化/平面图 | `JuraBGms` | JuraBGms | §15 |
| 报告/OnlyOffice/docx/xlsx | `jura-doc-view` | JuraDocView | §16 |
| 报表/帆软/FineReport | `jura-report-view` | JuraReportView | §17 |
| 外部组件/iframe 嵌入 | `jura-external-view` | JuraExternalView | §18 |
| 绘图工具/统一入口/成图 | `jura-draw-tools` | JuraDrawTools | §19 |
| H5 模板设计/单井设计器 | `jura-h5-design` | JuraH5Design | §20 |
| 多语言/国际化采集 | `jura-multi-lang-collection-tool` | JuraMultiLangCollectionTool | §21 |
| 表格/vxeTable/vxe-grid | `jura-vxe-table` | JuraVxeTable | §22 |
| 文档编辑/Wps/OnlyOffice | `jura-word-editor` | JuraWordEditor | §23 |
| 电子表格/Univer | `jura-univer-table` | JuraUniverTable | §24 |
| 双栏布局/图左表右 | `jura-two-layout` | JuraTwoLayout | §25 |
| 组件统一入口/按类型渲染 | — | JuraUnifiedCompEnter | §26 |
| 纯前端 ECharts/自备 option | `JuraEcharts` | JuraEcharts | §27 |
| 纯富文本编辑/自备内容 | `JuraEditor` | JuraEditor | §28 |
| H5 曲线渲染/自备模板+数据 | `JuraH5Curve` | JuraH5Curve | §29 |
| GMS SVG 图件/自备 svgUrl | `JuraGeoMap` | JuraGeoMap | §30 |
| 加载中/loading 指令 | `v-loading` | —（全局指令） | §31 |

## 通用约定

### bo 参数空值拦截

| 组件 | 拦截方式 |
|---|---|
| JuraBEcharts | bo 不存在时仅展示模板数据 |
| JuraH5View | watch 内 `val.bo && templateData` 双重判断 |
| JuraDocView | `if (!bo) { loading=false; return }` |
| JuraReportView | `if (val && val.bo)` |
| JuraExternalView | `if (val && val.bo)` |
| JuraBGms | `if (!bo) { console.warn; return }` |
| JuraBaikeView | `if (!props.searchParams?.bo) return`（**任何模式下**） |
| JuraBaguwen | `if (props.compId && newVal && newVal.bo)` |

### 预览模式（priviewShow）

- 预览模式模板查询走 `getPriviewTempData`，成图数据走 `getPriviewCompV3Data`
- 支持 priviewShow 的组件：JuraBEcharts、JuraH5View、JuraExternalView、JuraBGms、JuraBaikeView、JuraBaguwen
- JuraDrawTools 有两种预览：`preview=true`（配置预览，仅隐藏表格，不调日志）和 `showTable=false`（商店预览，隐藏表格+走预览接口+调日志）

### comp-metric 上报

- 参数：`{ componentId: props.compId, requestId: timestamp }`
- JuraBEcharts 用 ECharts finished 事件精准触发；其余 setTimeout(500ms)
- 上报链：子组件 → JuraUnifiedCompEnter → JuraDrawTools → 外部
- 上报接口由外部实现（组件只 emit 事件）

### saveGraphic / updateData

JuraBEcharts、JuraH5View、JuraBGms 均暴露 `saveGraphic()` 和 `updateData(data)`，JuraUnifiedCompEnter 统一转发。

## 相关链接

- 私有源：http://192.168.1.92:4873/
- 组件 API 详情：[components.md](components.md)
- 依赖库 jurassic-ui：[`../jurassic-ui/SKILL.md`](../jurassic-ui/SKILL.md)
