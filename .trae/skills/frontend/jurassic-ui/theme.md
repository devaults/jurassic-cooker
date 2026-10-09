# 主题（Jurassic UI 2.x）

2.x 使用 Ant Design Vue 4 的 **CSS-in-JS Design Token**，通过 `JuraConfigProvider` 的 `theme` 注入。不要配置 `less.modifyVars` / `javascriptEnabled`。

## 官方默认主题

库导出的 `juraTheme` 已把 Jurassic 色板映射到 AntD Token。业务应用应默认使用它（与 `examples/App.vue` 一致）。

```ts
import { juraTheme, variables, theme } from 'jurassic-ui'
```

`juraTheme.token` 当前映射（源码 `es/styles/index.js`）：

| Token | 值（来自 `variables`） |
| --- | --- |
| `colorPrimary` / `colorInfo` | `#0A459A`（`j-color-primary-6`） |
| `colorSuccess` | `#228C18` |
| `colorWarning` | `#D6A405` |
| `colorError` | `#BC0F11` |
| `colorText` | `#1D2129` |
| `colorTextSecondary` | `#4E5969` |
| `colorTextTertiary` | `#86909C` |
| `colorTextQuaternary` | `#C9CDD4` |
| `colorBgLayout` | `#F4F7FA` |
| `colorBgContainer` | `#FFFFFF` |
| `colorBorder` | `#DEE1E6` |
| `colorBorderSecondary` | `#EAEDF1` |
| `fontSize` | `14` |
| `borderRadius` | `4` |
| `fontFamily` | `'OppoSans', 'SourceHanSansCN', ...` |

## 全局启用

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

局部覆盖时再包一层 `jura-config-provider`，只改需要的 token。

## 改主色 / 覆盖 Token

合并默认 token，避免丢掉圆角和字体：

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { JuraConfigProvider, juraTheme } from 'jurassic-ui'

const primary = ref('#0A459A')
const themeConfig = computed(() => ({
  token: {
    ...juraTheme.token,
    colorPrimary: primary.value,
    colorInfo: primary.value,
  },
}))
</script>

<template>
  <jura-config-provider :theme="themeConfig">
    <jura-button type="primary">主按钮</jura-button>
  </jura-config-provider>
</template>
```

常用可改 token：`colorPrimary`、`borderRadius`、`fontSize`、`colorBgLayout`。完整列表见 Ant Design Vue「定制主题」。

## 暗色模式

`theme` 是从 `ant-design-vue` 再导出的算法工具（`defaultAlgorithm` / `darkAlgorithm` / `compactAlgorithm`）。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { JuraConfigProvider, juraTheme, theme } from 'jurassic-ui'

const isDark = ref(false)
const themeConfig = computed(() => ({
  algorithm: isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: juraTheme.token,
}))
</script>

<template>
  <jura-config-provider :theme="themeConfig">
    <jura-checkbox v-model:checked="isDark">暗色</jura-checkbox>
  </jura-config-provider>
</template>
```

## 组件尺寸

`JuraConfigProvider` 的 `componentSize`：`small` | `middle` | `large`。

```vue
<jura-config-provider component-size="small">
  <jura-input placeholder="小号输入" />
</jura-config-provider>
```

## 自有 CSS 使用 `variables`

`variables` 是 Jurassic 色板/间距字典，给**非组件**样式用，不要拿它直接当 ConfigProvider 的 `theme`。

```ts
import { variables } from 'jurassic-ui'

// variables['j-color-primary-6'] === '#0A459A'
// variables['j-spacing-m'] === '16px'
// variables['j-radius-default'] === '4px'
```

色阶：`j-color-primary-1`～`6`，`j-color-text-1`～`4`，`j-color-bg-1`～`5` / `j-color-bg-white`，`j-color-border-1`～`4`，success / warning / danger 各 1～6。尺寸：`j-height-s|m|l`，`j-font-size-s|m|l|xl|xxl|xxxl`，`j-spacing-xs|s|m|l`。

在 Vue 中可写成 CSS 变量：

```vue
<style scoped>
.page {
  background: v-bind('variables["j-color-bg-1"]');
  padding: v-bind('variables["j-spacing-m"]');
}
</style>
```

## ConfigProvider 其它常用项

| 属性 | 作用 |
| --- | --- |
| `locale` | 语言包，见 i18n.md |
| `theme` | Design Token / algorithm |
| `componentSize` | 默认控件尺寸 |
| `getPopupContainer` | Select/Tooltip/Menu 等挂载节点 |
| `direction` | `ltr` / `rtl` |
| `autoInsertSpaceInButton` | 两汉字按钮是否插空格 |
| `prefixCls` | 默认 `ant`，一般不要改 |

## 不要做的事

- 不要在 `vite.config` 里为 2.x 配 `css.preprocessorOptions.less.modifyVars` 当主题方案。
- 不要只改 CSS 覆盖 `.ant-btn-primary` 来换品牌色；Token 才能带动 Spin、Input focus、Menu 选中态等。
- `juraTheme` 与 `theme` 不是同一个对象：前者是默认 token 配置，后者是 AntD 的 `theme` 工具。
