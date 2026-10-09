---
alwaysApply: false
description: 编写或修改 CSS/Less/SCSS 样式时使用（命名、语法、属性顺序、z-index、变量与主题、:deep()、预处理器）
---

### CSS / Less / SCSS 编码规范

> **分工**：本文件是通用样式规范。jurassic-ui 项目的主题与变量用法以技能
> [`skills/frontend/jurassic-ui/theme.md`](../../../skills/frontend/jurassic-ui/theme.md) 为准
> （主题走 `juraTheme`，**禁止**大面积覆盖 `.ant-*` / `.jura-*` 换品牌色）。

## 一、命名（强制）

- 类名小写字母 + 中划线（`.company-name`）；id 用驼峰（`#companyName`）
- Less 变量、函数、mixin 用驼峰（`@mainFontColor`）
- 推荐 BEM：`block__element--modifier`（`.header__body`、`.header__button--primary`）

## 二、语法（强制）

- 所有声明以分号结尾；0 值不带单位（`margin: 0`）
- 属性选择器加双引号（`input[type="text"]`）
- 十六进制值全小写并用简写（`#fff`）
- 不出现空规则；不设置过大的 z-index（见第七节）
- 非通用样式使用嵌套编写

## 三、代码风格（强制）

- 缩进 2 空格；分组选择器每个单独一行
- 声明块左花括号前加空格，右花括号单独成行
- 每条声明 `:` 后加空格、独占一行
- 逗号分隔的属性值，逗号后加空格（`transition: border .2s, color .3s`）
- Less 数学表达式在数值、变量、操作符之间加空格

## 四、选择器

- 【强制】不为 id / class 选择器添加类型选择器（避免 `input#error`、`p.message`）
- 【推荐】不使用 `*` 选择器；嵌套不超过 4 层
- 【推荐】用 `:before` / `:after` 画辅助性元素

## 五、声明顺序（参考）

按分组书写，组间留空行：

1. **Positioning**：`position` `top` `right` `bottom` `left` `z-index`
2. **Box model**：`display` `float` `width` `height` `margin` `padding` `border`
3. **Typographic**：`font` `line-height` `color` `text-align`
4. **Visual**：`background-color` `border-radius`
5. **Misc**：`opacity`

## 六、动画与兼容性

- 【强制】CSS3 语法添加浏览器前缀
- 【推荐】不用 `transition: all`，明确指定属性（避免 Safari 抖动）
- 【推荐】位移动画用 `transform` 替代 `position`
- 【推荐】不用 input 的 `line-height` 做垂直居中（Safari 光标异常）

## 七、z-index 层级管理（强制）

| 层级范围 | 用途 |
|---------|------|
| 0 - 10 | 普通文档流 |
| 10 - 100 | 导航/头部/悬浮元素 |
| 100 - 1000 | 下拉/弹出层（局部） |
| 1000 - 2000 | Modal/弹窗/抽屉 |
| 2000 - 3000 | 通知/Loading/Toast |
| 3000+ | 特殊场景（需注释说明） |

```less
@z-index-header: 100;
@z-index-dropdown: 100;
@z-index-modal: 1000;
@z-index-toast: 2000;
```

## 八、变量与主题

- 主题相关颜色、间距、圆角、字体**必须用变量**，禁止硬编码；魔法数值必须抽为变量
- 命名按用途分类：`--color-primary`、`--bg-card`、`--text-primary`（CSS 变量）或 `@color-primary`、`@spacing-md`（Less）
- 全局变量放 `@/styles/variables.less`；组件私有变量放 `<style>` 块顶部
- 重复出现 3 次以上的样式片段才抽 mixin；mixin 小驼峰命名，放 `@/styles/mixins/`，常用 `.ellipsis(@line)`、`.flex-center()`
- 暗色/明亮主题切换：同一变量名在不同主题下定义不同值
- 覆盖第三方组件主题色时，优先修改组件库的 CSS 变量

## 九、!important 使用限制

- 业务代码中**禁止**使用 `!important`（通过提高选择器权重解决）
- **唯一允许**：覆盖第三方组件库的内联样式，或第三方库本身用了 `!important` 且无法其他方式覆盖
- 使用时**必须加注释**说明原因

## 十、:deep() 穿透选择器

仅在覆盖第三方组件库内部样式时使用，且**前面必须有父级选择器限定范围**：

```less
// ✓ 正确：限定在 .my-component 内
.my-component {
  :deep(.van-button__text) { color: red; }
}
// ❌ 错误：无父级限定，等于全局样式
:deep(.van-button__text) { color: red; }
```

## 十一、预处理器（Less / SCSS）

### 嵌套（强制）
- 嵌套深度不超过 4 层
- 嵌套中不出现多余标签选择器（用 `.header` 不用 `div.header`）
- BEM 嵌套用 `&` 连接：`&__header`、`&--active`

### 运算
- 运算符前后加空格（`@width + 10px`）；不同单位不做加减法
- `calc()` 中 Less 变量用插值：`calc(~"100% - @{header-height}")`

### 导入
- 导入语句放 `<style>` 块最顶部
- 全局变量与 mixin 通过构建配置自动注入，不手动 `@import`

### 语法差异

| Less | SCSS |
|------|------|
| `@variable` | `$variable` |
| `.mixin-name()` | `@mixin` / `@include` |
| `@import` | `@use` / `@forward` |
| `&:extend(.class)` | `@extend .class` |
| `when` 条件 | `@if` / `@else` |
| `~"..."` 转义 | `#{...}` 插值 |

### 特性取舍
✅ 推荐：变量、嵌套、mixin、`&` 父选择器 ｜ ⚠️ 谨慎：`extend`（生成冗余选择器）、`lighten()`/`darken()` ｜ ❌ 避免：JavaScript 内联评估

## 十二、Vue 中的样式（强制）

- 单文件组件样式**默认加 `scoped`**；需要全局生效时写在无 `scoped` 的样式块或 `@/styles/global/`
- `<style scoped>` 内不需要再加组件名前缀
- 全局样式放 `@/styles/global/`，类名加统一前缀（如 `app-`）
- 样式修改时先找原声明改，不要叠加覆盖

## 附：移动端与暗色主题（仅相关项目适用）

**移动端**：触摸目标最小 44×44px；禁止 `100vh`（iOS 地址栏跳动），改用 `100%` 或 `min-height: -webkit-fill-available`；字体不小于 12px，正文推荐 14px。

**暗色主题**：文字透明度分层（主 0.85 / 次要 0.6 / 辅助 0.3-0.4）；边框分割线用低透明度白/黑（如 `rgba(255,255,255,.1)`）而非灰色；背景色按页面 → 卡片 → 浮层层层递进；阴影减弱或改用边框。
