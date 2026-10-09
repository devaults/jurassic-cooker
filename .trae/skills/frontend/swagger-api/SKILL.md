---
name: swagger-api
description: >-
  Swagger/OpenAPI codegen for Jura Vue 3 templates: swagger-typescript-api,
  scripts/generate-api.js, src/swagger api and *Types, npm run
  generate-swagger-types, microservice prefix, request.ts binding. Use when
  联调, 生成接口, OpenAPI, Swagger, api-docs, src/swagger, 自动生成类型,
  AdminTypes, or replacing hand-written src/api DTOs.
version: 1.0.0
status: stable
owner: "@jurassic-cooker-team"
updated: 2026-10-07
deprecated: false
---

# Swagger 自动生成 API 与类型

Jura Vue3 模板（如 `oio-tempate-web`）通过 **`swagger-typescript-api`** + **`scripts/generate-api.js`**，从后端 Swagger/OpenAPI JSON 生成 **`src/swagger/`** 下的 TypeScript 类型与 axios 请求方法，并挂载项目 **`@/utils/request`**。OpenAPI 文档是接口的**唯一真相来源**。

无 `generate-swagger-types` 脚本、无 `src/swagger/` 的旧项目，仍按 [`../api-request/SKILL.md`](../api-request/SKILL.md) 手写 `src/api`。

## 何时使用

- 用户提到：Swagger、OpenAPI、`api-docs`、重新生成接口、联调、DTO/VO 类型同步。
- 任务涉及：`scripts/generate-api.js`、`src/swagger/**`、`npm run generate-swagger-types`。
- 新页面要调后端 REST 接口，且项目已集成 Swagger 生成链路。

## 强制

- **禁止手改生成物**：`src/swagger/**`（含各服务 `Api.ts` 与 `index.ts`）均为脚本输出，下次 `npm run generate-swagger-types` 会覆盖。自定义逻辑写在 **`src/api` 适配层**或页面 composable，不要改 `Api.ts`。
- **禁止绕过 request**：生成代码已通过 `index.ts` 把 `HttpClient.instance` 设为 `@/utils/request`。页面/业务层用 `import { api } from '@/swagger'`，不要对生成方法再包一层裸 `axios`。
- **禁止在 `.vue` 写 URL 字符串**：路径由 Swagger + `prefix` 注入，调用走 `api.[服务名].[分组].[方法]`。
- **类型优先用生成命名空间**：`AdminTypes`、`ComponentTypes` 等（服务名首字母大写 + `Types`），不要重复手写同名 interface。
- 列表字段仍做 **`Array.isArray` 守卫**；生成类型不保证运行时 null（见 [`../api-request/SKILL.md`](../api-request/SKILL.md)）。
- 401 / 业务错误 / loading 归属仍遵循 `request.ts` 与 [`../api-request/SKILL.md`](../api-request/SKILL.md)、[`../crud-page/SKILL.md`](../crud-page/SKILL.md)。

## 目录与产物

```text
scripts/generate-api.js     # 多服务配置 + 生成 + 聚合 index.ts
src/swagger/
  admin/Api.ts                # 单服务：类型 + Api 类（按 tag 分组的方法）
  component/Api.ts
  index.ts                    # ★ 自动聚合：api 实例 + *Types 导出
```

`package.json` 脚本名通常为：

```json
"generate-swagger-types": "node scripts/generate-api.js"
```

## 生成流程

### 1. 配置服务

编辑 `scripts/generate-api.js` 的 `services` 数组：

| 字段 | 含义 |
| --- | --- |
| `name` | 服务短名 → `api.admin`、`src/swagger/admin/` |
| `url` | Swagger JSON 地址（如 `.../admin/v2/api-docs`） |
| `prefix` | 网关/微服务前缀，钩子拼到每个 path 前（如 `/admin`） |

### 2. 执行命令

```bash
npm run generate-swagger-types
```

成功时终端应有 `Successfully generated for <name>` 与 `Successfully generated src/swagger/index.ts`。生成前需能访问各 `url`（VPN / hosts / 内网）。

### 3. 何时重新生成

- 后端 DTO/路径/方法变更后；Sprint 开始、联调前、提测前。
- 拉取后端相关变更后，若页面类型与联调不一致，先 regen 再改业务代码。

临时只生成部分服务：在 `services` 中注释其它项再执行命令（勿提交仅用于本地的注释状态，除非团队约定）。

## 模板封装要点（与 oio 模板一致）

`generate-api.js` 对 `swagger-typescript-api` 的典型配置：

- `httpClientType: 'axios'`，`generateClient: true`，`singleHttpClient: true`
- `extractRequestParams` / `extractRequestBody` / `extractEnums: true`
- `unwrapResponseData: true`（返回值相对原始 axios 可能已解包一层，**以 `request.ts` + 现有页面调用为准**）
- `onCreateRoute`：为每个 path 注入 `service.prefix`

`index.ts` 生成逻辑：各服务 `new XxxHttpClient()` → **`xxxHttpClient.instance = request`** → `export const api = { admin: new AdminApi(...), ... }`，并 `export type * as AdminTypes from './admin/Api'`。

## 业务代码用法

### 调用接口

```ts
import { api } from '@/swagger'

// 结构：api.[serviceName].[tag分组camelCase].[operationMethod]
// 分组名、方法名来自 Swagger tags / operationId，以 IDE 跳转 Api.ts 为准
const res = await api.admin.dept.someMethodUsingGet({ /* query/body 由类型提示 */ })
```

文档示例里的 `api.admin.user.getUserList` 仅为说明层级；真实方法名常为 `xxxUsingGet` / `xxxUsingPost`，分组名如 `dept`、`dict`，**不要臆造**，在 `src/swagger/<service>/Api.ts` 的 `export class Api` 内查找。

### 引用类型

```ts
import type { AdminTypes, ComponentTypes } from '@/swagger'

const rows = ref<AdminTypes.SomeVo[]>([])
const query = ref<AdminTypes.SomeQueryDto>({ page: 1, size: 10 })
```

### Vue 页面组合（与 crud-page 一致）

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/swagger'
import type { AdminTypes } from '@/swagger'
import { JuraMessage } from 'jurassic-ui'

const loading = ref(false)
const list = ref<AdminTypes.SomeVo[]>([])

onMounted(async () => {
  loading.value = true
  try {
    const res = await api.admin.someGroup.someMethodUsingPost(queryDto)
    list.value = Array.isArray(res?.records) ? res.records : []
  } catch {
    /* 拦截器已 toast 则勿重复 */
  } finally {
    loading.value = false
  }
})
</script>
```

组件示例用 `jura-table` / `jura-*`，见 [`../jurassic-ui/SKILL.md`](../jurassic-ui/SKILL.md)。

## 与手写 `src/api` 的分工

| 场景 | 做法 |
| --- | --- |
| 标准 REST，Swagger 完整 | 页面/composable 直接用 `api` + `*Types` |
| 需统一命名、组合多接口、裁剪字段 | 在 `src/api/<domain>/foo.ts` **薄封装**生成方法，导出 `fetchXxx` 供页面使用 |
| Swagger 质量差（全 `object` / `any`） | 业务层强类型包装 + 与后端推动注解；必要时局部手写类型 |
| 非 REST（WebSocket 等） | 不用本技能；手写 [`../api-request/SKILL.md`](../api-request/SKILL.md) |

封装示例：

```ts
// src/api/user/list.ts — 允许手写适配层，内部仍调生成 API
import { api } from '@/swagger'
import type { AdminTypes } from '@/swagger'

export type UserRow = AdminTypes.UserVo

export async function fetchUserList(params: AdminTypes.UserQueryDto) {
  const res = await api.admin.user.listUsingGet(params)
  return {
    list: Array.isArray(res?.records) ? res.records : [],
    total: Number(res?.total) || 0,
  }
}
```

## 版本管理

模板默认 **`src/swagger/` 纳入 Git**（CI 不依赖实时访问 Swagger）。若改为 `.gitignore`，须在 CI 构建前执行 `generate-swagger-types` 且保证网络可达。

## 局限（智能体须知）

- 生成质量依赖后端 Swagger 注解（description、required、具体 schema）。
- 动态 Map 类接口类型可能过宽，需业务层收窄。
- 单文件 `Api.ts` 可能很大，用 IDE 符号搜索，不要整文件粘贴进对话。

## 不要做的事

- 修改 `src/swagger/**` 后指望长期保留。
- 为「少一层 import」在页面复制 DTO interface。
- 生成失败仍手写与 Swagger 冲突的路径/方法名。
- 忽略 regen，仅改页面导致类型与后端 silently 不一致。

## 相关

- 请求拦截、401、列表拆包：[`../api-request/SKILL.md`](../api-request/SKILL.md)
- 列表页范式：[`../crud-page/SKILL.md`](../crud-page/SKILL.md)
- 交卷前检查：[`../quality-review/SKILL.md`](../quality-review/SKILL.md)
