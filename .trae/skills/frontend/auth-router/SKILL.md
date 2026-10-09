---
name: auth-router
description: >-
  Route, menu, and permission rules for Jura mid-admin Vue 3 apps: asyncRoutes,
  meta.title i18n keys, hidden menus, button-level auth, 401/403, keep-alive
  notes, and micro-frontend base/token. Use when adding routes, 菜单, 权限,
  hidden, 按钮权限, login redirect, or syncing BasicLayout menuItems.
version: 1.0.0
status: stable
owner: "@jurassic-cooker-team"
updated: 2026-10-07
deprecated: false
---

# 路由、菜单与权限

中后台「能进哪个页、能点哪个按钮」。页面 CRUD 见 [`../crud-page/SKILL.md`](../crud-page/SKILL.md)；401 请求见 [`../api-request/SKILL.md`](../api-request/SKILL.md)。

路径名（`asyncRoutes`、`BasicLayout.vue`、`formatToRoot`）以**当前仓库**为准。

## 强制

- 新增页面必须：**路由表 + 菜单数据**一起改。只加 `views` 不加路由 = 死链；只加路由不加菜单 = 用户找不到（除非 `hidden` 详情页）。
- `meta.title` 用 **i18n key**（如 `'menu.access'`），不要写死「用户管理」。
- 菜单渲染过滤：`r.name && r.meta?.title && !r.hidden`。
- 详情 / 编辑全屏页：`hidden: true`，从列表跳入，不要出现在侧栏。
- 无权限：按钮**不渲染**（不是仅 disabled）；整页无权限走 403 页或拦截，不要空白布局。
- 权限码、指令名、store 字段跟随项目已有实现（如 `v-auth` / `hasPermission('xxx')`），不要新发明一套。

## 加一个列表页的步骤

1. `src/views/<biz>/<page>/index.vue`（conventions + crud-page）
2. `src/router` 的 `asyncRoutes`（或项目等价表）增加：

```ts
{
  path: 'users',
  name: 'BizUsers',
  component: () => import('@/views/biz/users/index.vue'),
  meta: { title: 'menu.biz.users' },
}
```

3. 布局菜单 `menuItems`（或由路由生成菜单的函数）同步；若菜单完全由路由生成，确认 filter 含 `hidden`。
4. `locales` 增加 `menu.biz.users` 中英文。
5. 微前端：确认 `base`（含 `/jc/` 时常见 `/micro/jtemplate/`，独立部署另一套，以 `vite.config.ts` 为准）。子应用路由不要写死主应用域名。

## `hidden` 与嵌套

- 列表在菜单展示；`detail/:id` 设 `hidden: true`。
- 微前端 qiankun `/jc/` 下若存在 `formatToRoot` 展平 children，不要再按「本地嵌套菜单」假设侧栏结构。
- 改 `children` 后点一遍侧栏 + 直接打开子路由，两种都要通。

## 按钮权限

```vue
<jura-button v-if="can('user:edit')" type="link" @click="openEdit(record)">
  {{ t('common.button.edit') }}
</jura-button>
```

`can` 换成项目真实 API（store getter / 指令）。权限字符串与后端约定一致，不要页面里写中文角色名判断 `role === '管理员'`。

路由级：`meta.permission`（或现有字段）在全局 `beforeEach` 里校验，失败跳 403。

## 登录与 401

- 未登录访问业务路由 → 登录页（或主应用登录），`redirect` 带回原 path（项目已有则复用）。
- 请求 401 → **只在 request 拦截器处理一次**，路由守卫不要和拦截器各跳一次造成循环。
- Token 来源：微前端 props 优先，否则 `useUserStore`。

## keep-alive / 页签

仅当项目已有 `keep-alive` 或多页签时：

- 需要缓存的路由 `name` 必须与 `App`/`Layout` 里 `include` 一致。
- 从详情返回列表若要保留筛选，用 keep-alive 或把 query 写进 URL，不要默默丢筛选又不说明。
- 不要给所有路由无脑 `keep-alive`（表单页缓存会残留）。

## 不要做的事

- 菜单写死一份、路由写死另一份还经常忘同步。
- 用 `v-show` 藏无权限按钮仍挂 `@click` 删除。
- 在子应用里改主应用路由表。
- 为了跳转 `window.location.href` 打到外网绝对地址（除非跳登录 SSO 且项目已如此）。
