---
alwaysApply: false
description: 编写或修改 HTML 模板时使用
---
### HTML / Template 编码规范

> **分工**：本文件只讲通用语法（缩进/引号/嵌套）。Jura 项目的模板写法（`jura-*` 标签、`#bodyCell`、
> `v-model:open` 等）以技能 [`skills/frontend/project-conventions`](../../../skills/frontend/project-conventions/SKILL.md)
> 与 [`skills/frontend/jurassic-ui`](../../../skills/frontend/jurassic-ui/SKILL.md) 为准。

#### 语法（强制）
- 缩进使用 2 个空格、不使用 Tab；嵌套元素缩进一次（2 空格），同层级保持一致
- 属性值统一使用双引号，不使用单引号
- 不省略可选的结束标签（如 `</li>`、`</body>`）
- 特殊符号使用 HTML 实体（`&nbsp;` `&copy;` `&yen;` `&reg;` `&gt;` `&lt;` `&amp;`）
- `td/th` 必须在 `tr` 内，`li` 必须在 `ul/ol` 内
- `ul/ol` 直接子元素只能是 `li`
- 行内元素内不可嵌套块级元素（如 `a` 内不要直接套 `div`，可给 `a` 设置 `display: block`）
- 不使用自定义标签（与 Vue 组件冲突）
- 不使用重复属性
- https 页面不引用 http 图片，用 `//` 开头按当前协议加载

#### 文档结构（强制）
- 每个 HTML 页面添加标准模式声明 `<!DOCTYPE html>`
- 根元素添加 `lang` 属性，如 `<html lang="zh-CN">`
- 声明字符编码 `<meta charset="UTF-8">`
- 引入 CSS/JS 时不指定 `type` 属性

#### 推荐与参考
- 【推荐】自闭合元素尾部不加斜线（`<img src="logo.png" alt>`）
- 【推荐】不使用属性设置样式（`width`/`height` 等），改用 style
- 【推荐】减少标签层级，避免多余包裹
- 【参考】自定义属性以 `data-` 开头
- 【参考】属性顺序：`class` → `id` → `name` → `data-*` → `src/for/type/href/value` → `placeholder/title/alt` → `aria-*/role` → `required/readonly/disabled`
- 【参考】遵循 HTML 标准和语义，用最少标签保持最小复杂度
