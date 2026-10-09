---
name: project-conventions
description: >-
  Vue 3 + Vite + TypeScript engineering conventions for Jura mid-admin apps:
  directory layout, naming, script setup, Pinia, aliases, styles, and what not
  to add. Use when creating files, naming modules, choosing Options vs
  Composition API, placing views/api/stores/composables, or when the user
  mentions 规范, 目录, 命名, TypeScript, or project structure.
version: 1.0.0
status: stable
owner: "@jurassic-cooker-team"
updated: 2026-10-07
deprecated: false
---

# 工程约定（Vue3 + Vite + TS）

中后台项目的文件放哪、怎么起名、用哪套 API。组件标签与主题见 [`../jurassic-ui/SKILL.md`](../jurassic-ui/SKILL.md)；列表表单页见 [`../crud-page/SKILL.md`](../crud-page/SKILL.md)。

路径以当前仓库为准；下列为 oio / Jura 模板常见布局，项目已有不同结构时**跟随现有目录，不要另起一套**。

## 强制

- 新增页面与逻辑用 **`<script setup lang="ts">` + Composition API**。存量 Options API 可渐进改，禁止在新代码里加 `this.$xxx`。
- 状态用 **Pinia**（`src/stores/`），禁止新增 Vuex 模块。
- 路径别名用 `@/`，禁止 `../../../` 穿过多层。
- 静态资源顶部 `import`，禁止 Vite 下 `require()`。
- 样式默认 **scoped**；禁止用大量 `.ant-*` / `.jura-*` 全局覆盖换品牌色（主题走 `juraTheme`）。
- 文案：能复用 `common.*` 的不要硬编码中文；业务 key 中英双语一起加。
- 不要改 `node_modules`、不要在页面里裸 `fetch` / `axios.create`（走项目 `request`）。
- `any` 仅允许在边界且加注释；优先 `interface` / `type`。禁止 `as any` 消错后不管。

## 目录

```
src/
  api/           按业务域拆文件，只放请求函数
  views/         <business>/<page>/index.vue（+ detail.vue）
  views/components/  跨页复用的业务组件（非全局 UI 库）
  components/    更通用的展示组件（若项目已有）
  stores/        Pinia
  composables/   useXxx.ts
  router/
  locales/       zh-CN / en-US
  utils/         request.ts、纯函数
  types/         全局或共享类型
  layouts/       BasicLayout 等
```

- 页面文件：`src/views/<business>/<page>/index.vue`，不要在 `views` 根上堆 `XxxList.vue`。
- composable：`useUserList.ts` 这种动词前缀；不要把请求直接写进 `.vue` 超过一屏还不分。
- 类型：接口 DTO 可与 `api` 同文件或 `types/`，与页面 `reactive` 字段对齐。

## 命名

| 对象 | 约定 |
| --- | --- |
| 页面目录 / 路由 name | kebab-case 或项目现有风格，保持一致 |
| Vue 组件文件 | PascalCase（`UserFilter.vue`）或跟随仓库 |
| 模板组件标签 | 业务组件 PascalCase；Jura 用 `jura-*` |
| composable / store | `useXxx` / `useXxxStore` |
| API 函数 | 动词 + 资源：`fetchUserList`、`updateUser` |
| 常量 | `UPPER_SNAKE` 仅限真常量 |
| i18n key | `<page>.<context>.<field>` |

## import 顺序（建议）

1. `vue` / `vue-router` / `vue-i18n` / `pinia`
2. `jurassic-ui`、`@ant-design/icons-vue`
3. `@/api`、`@/stores`、`@/composables`、`@/utils`
4. 相对路径组件
5. 类型 `import type`
6. 样式（若单文件未写在底部 style）

## TypeScript

- `props` / `emits` 要有类型；`defineProps<{ ... }>()` 或 `withDefaults`。
- 模板用到的 ref 在 script 里类型可推断则不必处处手写。
- 禁止 `// @ts-ignore` 作为默认手段；实在需要写原因。
- `enum` 谨慎；字符串字面量联合通常更合适。

## 不要做的事

- 为「规范」新建与仓库平行的第二套目录。
- 把 Pinia 当什么都往里塞的全局变量（筛选条件、弹窗 open 默认留在页面）。
- 复制 `old-web` 的 Vue2 文件进 `src/`（迁移走 [`../vue3-jurassic-migration/SKILL.md`](../vue3-jurassic-migration/SKILL.md)）。

做完改动再读 [`../quality-review/SKILL.md`](../quality-review/SKILL.md)。
