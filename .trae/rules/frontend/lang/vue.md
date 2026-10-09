---
alwaysApply: false
description: 编写或修改 Vue 单文件组件时使用；按仓库实际版本分流（Vue2 选项式 / Vue3 script setup），先判断版本再取用对应章节
---

# Vue 组件编码规范

> **先判断版本，再用对应章节（强制）**
>
> | 仓库版本 | 特征 | 该读哪几章 |
> |---|---|---|
> | **Vue 2** | `vue@^2`、`@vue/cli-service` | 第一章 + **第三章** |
> | **Vue 3** | `vue@^3`、Vite、jurassic-ui 2.x | 第一章 + **第二章** |
>
> 项目到底哪一版：查使用方项目注册表（项目技术栈的权威来源），不要凭印象。
>
> Jurassic UI 2.x（Vue3）项目的组件标签、主题、目录约定以技能为准
> （[`skills/frontend/project-conventions`](../../../skills/frontend/project-conventions/SKILL.md)、
> [`skills/frontend/jurassic-ui`](../../../skills/frontend/jurassic-ui/SKILL.md)）：
> **新代码与技能冲突时以技能为准**；本文件第三章只在维护存量 Vue2 仓库时生效。
> （全局冲突优先级见使用方本地项目规则中的「工作区地图」）

## 一、通用（Vue 2 / Vue 3 都适用，强制）

### 命名
- 组件名始终是多个单词，根组件 `App` 除外
- 单文件组件文件名 PascalCase（`MyComponent.vue`）或 kebab-case，**项目内统一**
- 紧密耦合的子组件以父组件名作为前缀（`TodoList.vue` / `TodoListItem.vue`）
- 组件名以高级别单词开头，描述性修饰词结尾（`SearchButtonClear.vue`）
- JS/JSX 中组件名 PascalCase
- 基础组件以 `Base`/`App`/`V` 前缀，单例组件以 `The` 前缀
- 组件名倾向完整单词而非缩写

### 语法
- `v-for` 必须设置 `key`，组件上的 `v-for` 必须用 `key`
- **不要把 `v-if` 和 `v-for` 同时用在同一元素上**（用计算属性实现）
- 无内容组件自闭合（`<MyComponent/>`），DOM 模板中不自闭合
- 模板中组件名 PascalCase（SFC/字符串模板），DOM 模板中 kebab-case
- 模板只包含简单表达式，复杂表达式重构为计算属性或方法
- 指令使用简写（`:` 表示 `v-bind:`，`@` 表示 `v-on:`）
- Prop 声明用 camelCase，模板中用 kebab-case
- 多特性元素分多行撰写，每个特性一行

### 组件结构
- SFC 顶级标签顺序（强制）：`<template>` → `<script>` → `<style>`

### 父子通信（强制）
- 优先通过 prop 和事件通信，而非 `this.$parent` 或直接改 prop
- 理想状态：prop 向下传递，事件向上传递

### 元素特性顺序（参考）
1. 定义：`is` ｜ 2. 列表：`v-for` ｜ 3. 条件：`v-if` `v-else-if` `v-else` `v-show` `v-cloak`
4. 渲染方式：`v-pre` `v-once` ｜ 5. 全局感知：`id` ｜ 6. 唯一特性：`ref` `key` `slot`
7. 双向绑定：`v-model` ｜ 8. 其他特性 ｜ 9. 事件：`v-on` ｜ 10. 内容：`v-html` `v-text`

## 二、Vue 3 新代码（强制）

适用于新建文件与迁移后的代码，也是 Jura 中后台的默认形态。

- 一律 **`<script setup lang="ts">` + Composition API**；禁止 `this.$xxx`
- 状态用 **Pinia**（`src/stores/`），**禁止新增 Vuex 模块**
- 目录/命名/别名/样式等工程约定见 [`skills/frontend/project-conventions`](../../../skills/frontend/project-conventions/SKILL.md)
- 组件标签用 `jura-*`；Jurassic UI 2.0.5+ 须引入 `jurassic-ui/dist/style.css`
  （主题与样式约束见 [`css.md`](./css.md) 与技能 [`skills/frontend/jurassic-ui`](../../../skills/frontend/jurassic-ui/SKILL.md)）

### `<script setup>` 结构顺序（强制）
`imports → router/store → props/emits → ref/reactive → computed → 方法 → watch → 生命周期 → defineExpose`

### ref vs reactive
- **基本类型**用 `ref`；**对象/数组**用 `reactive`（团队统一也可全用 `ref`）
- 避免用 `reactive` 包基本类型（无响应式效果）
- 解构 `reactive` 会丢失响应式，用 `toRefs` 包裹
- `ref` 在 `<template>` 中自动解包，JS 中需 `.value`

### props / emits
- `defineProps<{...}>()`、`defineEmits<{...}>()` 使用类型标注
- `withDefaults` 设置默认值；`defineExpose` 显式暴露需被父组件调用的方法

### composable
- 命名 `use` 前缀 + 业务名（`useUserList`、`useDialog`）
- 放 `@/composables/` 或组件同级 `useXxx.ts`
- 返回对象而非数组（除非状态少且固定）
- 内部不直接操作组件实例，通过参数传入

### watch
- 监听 `reactive` 对象属性用函数形式：`watch(() => state.count, ...)`；监听 `ref` 直接传
- `immediate: true` 适合初始化加载
- `deep: true` 谨慎使用（性能开销大），优先监听具体属性
- `watchEffect` 适合自动追踪依赖的场景

### 响应式陷阱
- `reactive` 解构丢失响应式 → 用 `toRefs`
- `ref` 赋值对象时整体替换，注意用 `Object.assign` 保持引用
- 模板中 `ref` 自动解包，但**嵌套在对象中不会自动解包**

## 三、Vue 2 存量仓库（仅存量维护，强制）

> 本节写法**只适用于已有 Vue2 仓库的 bug 修复与小需求**。新页面/新组件按第二章；
> 升级到 Vue3 时走 [`skills/frontend/vue3-jurassic-migration`](../../../skills/frontend/vue3-jurassic-migration/SKILL.md)（按路由逐个改）。

- 组件 `data` 必须是函数
- `prop` 定义至少指定类型，尽量详细（`type`/`required`/`validator`）
- 选项式 API 选项顺序（参考）：
  1. 副作用：`el`
  2. 全局感知：`name` `parent`
  3. 组件类型：`functional`
  4. 模板修改器：`delimiters` `comments`
  5. 模板依赖：`components` `directives` `filters`
  6. 组合：`extends` `mixins`
  7. 接口：`inheritAttrs` `model` `props`/`propsData`
  8. 本地状态：`data` `computed`
  9. 事件：`watch` + 生命周期钩子（按调用顺序）
  10. 非响应式属性：`methods`
  11. 渲染：`template`/`render` `renderError`
- 若仓库已装 `@vue/composition-api`，可用组合式写法，但**同一文件不要混用两套风格**
- Vuex 模块按职责拆分，访问 `this.$store.state.<module>.<field>`
- **禁止**在 Vue2 仓库里用 Vue3 专属语法（`defineModel`、多参数 `v-model`、`v-model:open` 等）
