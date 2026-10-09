---
name: state-pinia
description: >-
  Pinia state boundaries for Jura Vue 3 mid-admin: what belongs in store vs
  page, store naming, persist caveats, no new Vuex. Use when adding Pinia
  store, 跨页状态, 缓存筛选, useUserStore, useAppStore, or debating Vuex.
version: 1.0.0
status: stable
owner: "@jurassic-cooker-team"
updated: 2026-10-07
deprecated: false
---

# Pinia 状态边界

工程约定见 [`../project-conventions/SKILL.md`](../project-conventions/SKILL.md)。本技能只解决：**什么进 store、什么留在页面**。

## 强制

- 状态管理只用 **Pinia**（`src/stores/*`），禁止新增 Vuex 模块。
- Store 命名：`useXxxStore = defineStore('xxx', { ... })`，与仓库现有风格一致（options 或 setup store 二选一，跟随项目）。
- **默认不进 store**：弹窗 `open`、表单 `form`、当前页 `loading`、一次性详情数据、仅本页筛选。
- **适合进 store**：登录用户 / token / 权限码、侧栏折叠、全局语言、跨多页共享且生命周期长于单页的数据。
- 不要把整个列表接口结果无脑塞进 store 再在各页改（易脏数据）；列表以页面 `ref` + 请求为准。

## 页面 vs Store

| 放页面 | 放 Pinia |
| --- | --- |
| 筛选 keyword、pageNo | 当前登录用户、权限列表 |
| Modal open / form 字段 | 侧边栏 collapsed、设备类型 |
| 表格 dataSource | 全局语言、主题偏好（若项目有） |
| 提交中 submitting | 微前端下发的 userInfo 缓存（若已有） |

跨页「返回列表要保留筛选」：优先 **路由 query** 或 `keep-alive`（见 auth-router），其次再考虑 pinia 模块；不要默默全局缓存又不清。

## 写法要点

```ts
// src/stores/user.ts — 跟随项目已有 useUserStore
export const useUserStore = defineStore('user', {
  state: () => ({
    token: '' as string,
    permissions: [] as string[],
  }),
  actions: {
    setToken(token: string) {
      this.token = token
    },
  },
})
```

- 在 `<script setup>`：`const userStore = useUserStore()`，不要 `getCurrentInstance().proxy.$store`。
- 持久化（若用 pinia-plugin-persistedstate）：只持久化必要字段；**不要持久化整表数据**；注意微前端与独立运行的 storage 键冲突。

## 不要做的事

- 每个 CRUD 页一个「XxxListStore」只为了装 `dataSource`。
- Store action 里直接操作 DOM / 打开 Modal。
- 为图省事 `store.$patch` 巨对象却从不重置，导致二次进入脏状态。
