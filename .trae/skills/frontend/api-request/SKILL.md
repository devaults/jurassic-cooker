---
name: api-request
description: >-
  HTTP and API conventions for Jura Vue 3 apps: request.ts wrapper, domain API
  files, typed params/response, list empty guards, GET vs POST, 401/business
  codes, and loading ownership. Use when adding interfaces, 联调, axios,
  request.ts, 401, 错误码, DTO types, or changing src/api. If the project has
  generate-swagger-types and src/swagger, read swagger-api first.
version: 1.0.0
status: stable
owner: "@jurassic-cooker-team"
updated: 2026-10-07
deprecated: false
---

# 接口与请求

所有浏览器 HTTP 走项目封装，不在页面里私建 axios。页面怎么展示列表见 [`../crud-page/SKILL.md`](../crud-page/SKILL.md)。

## 与 Swagger 自动生成共存

若 `package.json` 存在 **`generate-swagger-types`**（或等价脚本）且仓库有 **`src/swagger/`**，**先读 [`../swagger-api/SKILL.md`](../swagger-api/SKILL.md)**：

- 类型与 REST 调用优先 **`import { api } from '@/swagger'`** 与 **`AdminTypes` 等命名空间**。
- 仍遵守本文件的 **request 拦截、401、loading、列表 null 守卫**；生成代码已绑定 `@/utils/request`。
- 仅在 **适配/聚合/命名统一** 时在 `src/api` 写薄封装，不要重复手写与 Swagger 同名的 DTO。

无 Swagger 集成的项目，继续以下手写 `src/api` 约定。

## 强制

- 只使用 `src/utils/request.ts`（或仓库现有同名封装）。它已负责 token、CLIENT 头、GET 时间戳、401。
- 新增接口放 `src/api/<domain>/...`，导出函数，不要把 URL 写进 `.vue`。
- GET 用 `params`，POST/PUT 用 `data`（除非项目封装已统一成一种，则跟随项目）。
- 列表字段先 `Array.isArray` 再 `.map`；`list` / `records` 为 null 当 `[]`。
- 类型写清入参和主要出参；禁止 `request<any>` 当默认。
- 错误提示：能走拦截器统一 toast 的不要每个页面再弹一遍；**业务可恢复错误**（校验失败文案）可在页面再 `JuraMessage`。
- Token：微前端优先 `window.$wujie` / `window.$qiankun` 的 `props.userInfo.access_token`，否则 Pinia `useUserStore`（以项目 request 实现为准，不要复制一套）。

## API 函数形状

```ts
import request from '@/utils/request'

export interface UserListQuery {
  keyword?: string
  pageNo: number
  pageSize: number
}

export interface UserRow {
  id: string
  name: string
}

export interface PageResult<T> {
  list: T[]
  total: number
}

export function fetchUserList(params: UserListQuery) {
  return request<PageResult<UserRow>>({
    url: '/api/users',
    method: 'get',
    params,
  })
}

export function updateUser(data: { id: string; name: string }) {
  return request({
    url: '/api/users/update',
    method: 'post',
    data,
  })
}
```

- 命名：`fetch*` 读、`create*` / `update*` / `delete*` 写。跟随仓库已有前缀（如 `getXxx`）则不要混用。
- URL：跟随后端网关前缀；不要在页面拼 query string。
- 上传：完整 `action` URL + `:headers`（Authorization），见 jurassic-ui Upload 约定。

## 响应怎么用

拦截器若已 `return res.data`，页面拿到的就是业务体；若仍是 AxiosResponse，跟随现有调用方式，**同一项目内不要两种拆包**。

常见列表：

```ts
const res = await fetchUserList(query)
const list = Array.isArray(res?.list) ? res.list : []
const total = Number(res?.total) || 0
```

不要假设一定有 `res.data.data.list`。不确定时先看 `request.ts` 和现有 `api` 调用。

## 错误与 401

| 情况 | 处理 |
| --- | --- |
| HTTP 401 | 交给拦截器：清登录态 / 跳登录 / 通知主应用，页面不要自己再跳一次 |
| 业务 code ≠ 成功 | 拦截器已 Message 则页面只 `return`；未统一时页面 Message + 中止后续 |
| 网络失败 | 拦截器提示「网络错误」类文案（`common.error.network`） |
| 表单提交 4xx 字段错误 | 页面把后端 message 放到表单项或 Message.error |

不要 `catch` 之后空着，导致 loading 永不结束（`finally` 关 loading）。

## loading 归谁

- **列表 / 提交按钮**：页面 `loading` / `confirm-loading`。
- **全局 Spin**：仅全屏阻塞（登录后拉用户信息等），不要列表翻页也全屏。
- 拦截器不要默认给每个请求加全局 Spin（会闪）。

## 联调

- 本地代理以 `vite.config` 现有 `server.proxy` 为准，不要随意改 target 影响同事。
- Mock：仅当接口未就绪且用户允许；类型仍按正式 DTO 写，避免 mock 字段名和后端不一致。
- 改字段：同时改 `interface`、页面赋值、表格 `dataIndex`。

## 不要做的事

- `axios.get(url)` 绕过封装（丢 token / 401）。
- 把 token 打进 `console.log` 或提交到仓库。
- 在组件 `onMounted` 里写死完整域名。
- 同一资源多个 URL 副本（删除、列表、详情应同一 domain 文件）。
