---
name: jurassic-ui
description: >-
  Guides Vue 3 frontend UI work with the private Jurassic UI (jurassic-ui 2.x)
  library: Jura-prefixed Ant Design Vue 4 wrappers, ConfigProvider locale/theme,
  juraTheme tokens, merged zh_CN/en_US packs, JuraIcon/JuraSvgIcon, JuraColorPicker,
  JuraMap and JuraMicroContainer.
  Use when implementing pages from UI design drafts, Figma, MasterGo MCP design
  data, or screenshots, or when building forms, tables, theming, i18n, maps, or
  micro-frontends with
  jurassic-ui, Jurassic UI, JuraButton, or Ant Design Vue inside Jura apps.
version: 1.0.0
status: stable
owner: "@jurassic-cooker-team"
updated: 2026-10-07
deprecated: false
---

# Jurassic UI（2.x / Vue 3）

基于 **Vue 3 + Ant Design Vue 4** 的公司私有组件库。封装层前缀为 `Jura` / `jura-`；多数组件 API 与 Ant Design Vue 4.x 一致。当前稳定版 **2.0.6**。Vue 2 请用 `jurassic-ui@1`，不要套用本技能。若任务是 **Vue2 页面迁到 Vue3**，改读 [`../vue3-jurassic-migration/SKILL.md`](../vue3-jurassic-migration/SKILL.md)。

## 硬性约定

- 组件：`import { JuraButton } from 'jurassic-ui'`，模板用 `<jura-button>`。禁止 `JButton`、`a-button`（除非项目已在用 antd 原生标签且明确要求）。
- **表格场景优先使用 `JuraTable`（`<jura-table>`）**；大数据量用 jurassic-biz 的 `jura-vxe-table`（见 [`../jurassic-biz/SKILL.md`](../jurassic-biz/SKILL.md)）。**禁止用 `div` 手写表格**（含 flex/grid 模拟行列），除非有明确例外并在代码旁或 PR 中说明理由。
- 表单控件双向绑定用 **`v-model:value`**（不是 `v-model`），日期范围用 `JuraRangePicker`。
- 全局语言和主题必须走 **`JuraConfigProvider`**。不要 `app.use(JuraUI, { locale })`，插件 `install` 不接收 locale。
- 2.x **不要**用 Less `modifyVars` / `javascriptEnabled` 改主题。用 Design Token：`juraTheme`、`theme`、`variables`。
- 语言包用 **`import { locale } from 'jurassic-ui'`** 的 `locale.zh_CN` / `locale.en_US`（已合并 AntD + 业务文案）。不要只引 `ant-design-vue/es/locale/zh_CN`，否则缺 `common.*` 键。
- 必须引入重置样式一次：`import 'jurassic-ui/dist/reset.css'`（或项目已有的 `ant-design-vue/dist/reset.css`，二选一，勿重复）。
- **2.0.5+** 必须额外引入组件样式：`import 'jurassic-ui/dist/style.css'`（含 ColorPicker、Map 等自研组件样式）。
- 图标三选一，按场景选用（详见 [extras.md](extras.md) §图标）：
  - Ant Design 图标：`@ant-design/icons-vue` 按需导入（按钮、表单等通用场景首选）。
  - 公司 iconfont：`JuraIcon` + `import 'jurassic-ui/es/fontIcons/iconfont.css'`。
  - 内置/外链 SVG：`JuraSvgIcon`（sprite 自动注入，无需额外 CSS）。
- 弹层类组件优先设 `getPopupContainer`，避免在抽屉/弹窗内错位。
- 先读本文件；做列表/表单页再读 [`../crud-page/SKILL.md`](../crud-page/SKILL.md)；做主题读 [theme.md](theme.md)；做多语言读 [i18n.md](i18n.md)；地图/微前端读 [extras.md](extras.md)。

## 设计稿输入

设计稿来源不限于截图或 Figma，也可以是 **MasterGo MCP** 返回的结构化数据。

| 来源 | 用法 |
| --- | --- |
| Figma 链接 / 截图 | 视觉对照，按 jurassic-ui 组件落地 |
| MasterGo MCP | 在 Cursor 等已配置 MasterGo MCP 时，用链接或 `fileId` + `nodeId` 调用 MCP，获取节点树、尺寸、文案、颜色等，再映射为 `jura-*` 布局与组件 |
| old-web 路径 | 迁移场景见 [`../vue3-jurassic-migration/SKILL.md`](../vue3-jurassic-migration/SKILL.md) |

**MasterGo MCP 落地流程**

1. 向用户确认 MasterGo 链接，或 `fileId` + 页面/节点 ID（对话里未给则先问）。
2. 调用 MasterGo MCP 拉取设计稿数据（图层结构、样式、文案、间距）。
3. 结合 [`../crud-page/SKILL.md`](../crud-page/SKILL.md) 识别列表、筛选、表单、弹窗等中后台模式。
4. 用 `jura-*` 实现；尺寸与间距尽量贴近 MCP 数据，无法 1:1 还原时选最接近的 Jurassic UI 组件。
5. MCP 未描述交互（分页、loading、校验、空态）时，按中后台惯例补全；颜色优先对齐 `juraTheme` token，不要硬编码与设计系统冲突的值。

## 安装（业务项目）

```bash
npm install jurassic-ui@latest --registry http://192.168.1.92:4873/
# 图标
npm install @ant-design/icons-vue
```

依赖：`vue@^3.5`、`ant-design-vue@^4`。地图依赖 `ol`，微前端依赖 `qiankun`（库已声明）。

## 推荐接入（与官方 examples 一致）

`main.ts`：全量注册插件 + 重置样式 + 组件样式。

```ts
import { createApp } from 'vue'
import JuraUI from 'jurassic-ui'
import 'jurassic-ui/dist/reset.css'
import 'jurassic-ui/dist/style.css'
// 如需 JuraIcon（iconfont），按需额外引入：
// import 'jurassic-ui/es/fontIcons/iconfont.css'
import App from './App.vue'

const app = createApp(App)
app.use(JuraUI)
app.mount('#app')
```

`App.vue`：最外层包一层 ConfigProvider，同时注入默认主题和中文包。

```vue
<script setup lang="ts">
import { JuraConfigProvider, juraTheme, locale } from 'jurassic-ui'
</script>

<template>
  <jura-config-provider :theme="juraTheme" :locale="locale.zh_CN">
    <router-view />
  </jura-config-provider>
</template>
```

需要 Message/Modal 带主题与 locale 上下文时，在 ConfigProvider 内再包 `<jura-app>`，用 `JuraApp.useApp()`。简单页可直接 `import { JuraMessage, JuraNotification, JuraModalService } from 'jurassic-ui'`。

### 导出清单（写代码时用这些名字）

`JuraButton`，`JuraInput` / `JuraInputSearch` / `JuraInputTextArea` / `JuraInputPassword` / `JuraInputGroup`，`JuraSelect` / `JuraSelectOption` / `JuraSelectOptGroup`，`JuraForm` / `JuraFormItem`，`JuraCheckbox` / `JuraCheckboxGroup`，`JuraRadio` / `JuraRadioGroup` / `JuraRadioButton`，`JuraSwitch`，`JuraDatePicker` / `JuraRangePicker`，`JuraTimePicker` / `JuraTimeRangePicker`，`JuraInputNumber`，`JuraTable`，`JuraModal`，`JuraDrawer`，`JuraPagination`，`JuraTabs` / `JuraTabPane`，`JuraCard`，`JuraTag`，`JuraTooltip`，`JuraPopconfirm`，`JuraDropdown` / `JuraDropdownButton`，`JuraMenu` / `JuraMenuItem` / `JuraSubMenu` / `JuraMenuDivider`，`JuraSpace`，`JuraDivider`，`JuraAlert`，`JuraSpin`，`JuraBreadcrumb` / `JuraBreadcrumbItem` / `JuraBreadcrumbSeparator`，`JuraLayout` / `JuraLayoutHeader` / `JuraLayoutSider` / `JuraLayoutContent` / `JuraLayoutFooter`，`JuraSteps` / `JuraStep`，`JuraAnchor` / `JuraAnchorLink`，`JuraDescriptions` / `JuraDescriptionsItem`，`JuraList` / `JuraListItem` / `JuraListItemMeta`，`JuraCollapse` / `JuraCollapsePanel`，`JuraTimeline` / `JuraTimelineItem`，`JuraStatistic`，`JuraEmpty`，`JuraImage`，`JuraAvatar`，`JuraBadge`，`JuraResult`，`JuraProgress`，`JuraSkeleton` 及 Avatar/Button/Input/Image 子件，`JuraMessage`，`JuraNotification`，`JuraModalService`，`JuraRow` / `JuraCol`，`JuraAffix`，`JuraConfigProvider`，`JuraApp`，`JuraFloatButton` / `JuraFloatButtonGroup`，`JuraWatermark`，`JuraFlex`，`JuraPageHeader`，`JuraAutoComplete`，`JuraCascader`，`JuraMentions` / `JuraMentionsOption`，`JuraRate`，`JuraSlider`，`JuraTransfer`，`JuraTreeSelect`，`JuraUpload` / `JuraUploadDragger`，`JuraCalendar`，`JuraCarousel`，`JuraComment`，`JuraPopover`，`JuraQRCode`，`JuraSegmented`，`JuraTour`，`JuraTree` / `JuraDirectoryTree` / `JuraTreeNode`，`JuraTypography` 及 Title/Text/Paragraph/Link，**`JuraColorPicker`**，**`JuraIcon`**，**`JuraSvgIcon`**，**`JuraMicroContainer`**，**`JuraMap`**。

另导出：`locale`、`juraTheme`、`variables`、`theme`（来自 ant-design-vue，含 algorithm）、`juraSvgIconNames`（内置 SVG 名称列表）。

默认导出插件注册组件名（`JuraButton` 等）。`JuraSelectOption` / `JuraSelectOptGroup` 会再手动注册一次。

## 页面写法要点

- Props / Events / Slots 查 [Ant Design Vue 4 组件文档](https://antdv.com/components/overview-cn)，把 `a-` 换成 `jura-`，`A` 换成 `Jura`。
- Table 自定义列用插槽 `#列key="{ record, index }"`，并设唯一 `row-key`。
- Modal / Drawer 表单用 `:destroy-on-close="true"`，避免残留校验状态。
- Layout：`JuraLayoutSider` 的 `collapsed` 用 Vue 绑定（`:collapsed` / `@update:collapsed`），不要写 JSX 的 `trigger={null}`。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { JuraForm, JuraFormItem, JuraInput, JuraButton, JuraMessage } from 'jurassic-ui'

const formRef = ref()
const formData = ref({ name: '' })
const onSubmit = async () => {
  await formRef.value.validate()
  JuraMessage.success('提交成功')
}
</script>

<template>
  <jura-form ref="formRef" :model="formData" layout="vertical">
    <jura-form-item label="姓名" name="name" :rules="[{ required: true, message: '请输入姓名' }]">
      <jura-input v-model:value="formData.name" placeholder="请输入姓名" />
    </jura-form-item>
    <jura-form-item>
      <jura-button type="primary" @click="onSubmit">提交</jura-button>
    </jura-form-item>
  </jura-form>
</template>
```

## 按需引入

官方 examples 是 **全量 `app.use(JuraUI)`**。若项目坚持 unplugin 按需：不要用 `AntDesignVueResolver({ prefix: 'jura' })` 当唯一方案（那会解析到 antd 包，不是 `jurassic-ui` 的 `JuraMap` 等扩展组件）。优先全量注册；按需时从 `jurassic-ui` 显式 import。

## 扩展组件

| 组件 | 用途 |
| --- | --- |
| `JuraColorPicker` | 颜色拾取（主题色/标准色/原生取色器，hex/rgb/rgba） |
| `JuraIcon` | 公司 iconfont 字体图标（需引入 iconfont.css） |
| `JuraSvgIcon` | 内置 SVG sprite 或外链 mask 图标 |
| `JuraMap` | OpenLayers 地图（点线面、聚合、热力、测量、超图 SQL） |
| `JuraMicroContainer` | qiankun 多实例微应用容器 |

细节见 [extras.md](extras.md)。

## 相关链接

- 私有源：http://192.168.1.92:4873/
- Ant Design Vue 4 API：https://antdv.com/components/overview-cn
- 主题 Token：https://antdv.com/docs/vue/customize-theme-cn
- 图标：https://antdv.com/components/icon-cn
