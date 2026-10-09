---
name: micro-frontend
description: >-
  Micro-frontend conventions for Jura Vue 3 sub-apps: qiankun/wujie base path,
  token from host props, route flattening, JuraMicroContainer, and main/sub
  communication. Use when embedding as micro-app, /jc/, qiankun, wujie,
  JuraMicroContainer, 主子应用, or fixing token/base under micro frontend.
version: 1.0.0
status: stable
owner: "@jurassic-cooker-team"
updated: 2026-10-07
deprecated: false
---

# 微前端（子应用 / 容器）

oio 系常见：子应用挂在主应用 qiankun / wujie 下；也可在本应用内用 `JuraMicroContainer` 再嵌套微应用。组件 API 见 [`../jurassic-ui/extras.md`](../jurassic-ui/extras.md)；路由菜单见 [`../auth-router/SKILL.md`](../auth-router/SKILL.md)。

路径与 `base` 以**当前仓库** `vite.config.ts`、主应用注册名为准。

## 强制

- 子应用 `base` / `router history` 必须与独立部署、微前端两套约定一致；含 `/jc/` 时常见微前端 base（如 `/micro/jtemplate/`），独立部署另一套——**不要写死主应用域名**。
- Token：优先 `((window as any).$wujie || (window as any).$qiankun)?.props?.userInfo?.access_token`，否则 `useUserStore`；与 `request.ts` 现有逻辑对齐，不要页面再抄一套。
- 微前端模式下若存在 `formatToRoot` 展平 `children`，侧栏结构不要按「本地嵌套菜单」假设。
- 子应用内禁止改主应用路由表；跳登录若走 SSO，跟随项目现有 `window.location` / 主应用 API，不要随意新造。
- 用 `JuraMicroContainer` 时：`list[].name` 与子应用注册名一致；`container` 选择器必须在插槽 DOM 里存在。

## 作为子应用接入（检查清单）

1. `vite.config`：`base`、`server.origin` / CORS（按项目文档）。
2. `vue-router`：`createWebHistory(base)` 与微前端激活路径匹配。
3. 生命周期：若项目有 `mount` / `unmount` 导出给 qiankun，卸载时清掉定时器、事件、Pinia 订阅（跟随现有 `main.ts`）。
4. 样式：避免污染主应用；scoped + 谨慎全局 `.ant-*`。
5. 路由 `meta.title` 仍用 i18n key；菜单过滤 `hidden`。

## 作为主应用嵌套子应用

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { JuraMicroContainer } from 'jurassic-ui'

const list = ref([
  {
    name: 'sub-app',
    entry: 'https://your-micro-app.example/',
    container: '#micro-root',
    route: '/home',
    props: { userInfo: { /* 只传必要字段 */ } },
  },
])
</script>

<template>
  <jura-micro-container :list="list" :props="{ from: 'main' }">
    <div id="micro-root" />
  </jura-micro-container>
</template>
```

- `singular: false`（库内）：可多实例；卸载容器会 `unmount` 子应用。
- 不要把完整 access_token 打进日志或写进仓库示例。

## 主 ↔ 子通信

- 优先用项目已有 props / 全局事件总线 / 主应用下发的 API，不要引入第二套通信库。
- 子应用读主应用用户信息：只读 props / 约定 window 字段，不要假设 `localStorage` 键名与独立运行相同。

## 不要做的事

- 微前端与独立部署共用错误的 `base` 导致白屏 / 资源 404。
- 子应用内 `window.location.href = 'http://主应用绝对地址/...'` 乱跳（除非项目 SSO 已如此）。
- 在业务页重复实现 qiankun `loadMicroApp`（优先 `JuraMicroContainer`）。
