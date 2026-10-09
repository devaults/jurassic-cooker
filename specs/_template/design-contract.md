# <功能名> · API 契约（阶段三）

> **阶段三产物**（接口契约 · 同步闸口）·
> 主导角色：[`architect-role.md`](${rel.cooker}/.trae/steering/architect-role.md) ·
> 对应提示词：[`03-contract.md`](${rel.cooker}/.trae/prompts/stages/03-contract.md)
>
> **本模板只写契约**。**不写实现代码**（Java / SQL / Vue / TS）。
> 单一权威源（Single Source of Truth）：前后端均从本契约派生实现。
>
> **本阶段产物签字后，阶段 4（后端）+ 阶段 5（前端）才可开工**（同步闸口）。

## 0. 元信息

| 项 | 值 |
|---|---|
| 上游需求 | `requirements.md` v`<x>`（已签字） |
| 上游 UI Spec | `design-ui.md` v`<x>`（已签字，如有） |
| 契约版本 | `v1` |
| 状态 | `草稿 / 已签字` |
| 主导 | 接口架构师 |
| **下游实现版本** | 阶段 4 后端 / 阶段 5 前端均**必须引用本 v1 契约** |

---

## 1. 接口列表

> 按业务域分组（tags）；每行一个接口。

| # | 方法 | 路径 | 用途 | 鉴权 | Tag |
|---|---|---|---|---|---|
| 1 | `GET` | `/api/v1/<resource>` |  |  |  |
| 2 | `POST` | `/api/v1/<resource>` |  |  |  |
| 3 | `GET` | `/api/v1/<resource>/:id` |  |  |  |
| 4 | `PUT` | `/api/v1/<resource>/:id` |  |  |  |
| 5 | `DELETE` | `/api/v1/<resource>/:id` |  |  |  |

## 2. 接口详情

> 每个接口一节，按 OpenAPI 3 字段写。

### 2.1 `<METHOD> /api/v1/<resource>` — <用途>

- **summary**：
- **tags**：`<业务域>`
- **请求参数**：
  - path：…
  - query：…（分页：`page` / `pageSize` / `sort`）
  - header：`Authorization: Bearer <token>`（如有）
- **requestBody**：

```yaml
# 字段 / 类型 / 必填 / 说明 / 示例
<resource>CreateRequest:
  field1: string, required, "说明"
  field2: number, optional, "说明"
```

- **响应 200**：

```yaml
<resource>Response:
  id: string
  field1: string
  createdAt: string  # ISO 8601
  # ...
```

- **错误码**：

| HTTP | 业务码 | 场景 | 用户提示 |
|---|---|---|---|
| 400 | — | 入参校验失败 |  |
| 401 | — | 未登录 |  |
| 403 | — | 无权限 |  |
| 404 | `<resource>.not_found` | 资源不存在 |  |
| 409 | `<resource>.duplicate` | 资源重复 |  |
| 422 | `<resource>.invalid_state` | 状态非法 |  |
| 500 | — | 服务端异常 |  |

> 业务码命名与登记见 §5；本表只列该接口**实际会返回**的码。

## 3. 数据模型

> 与路径里的资源一一对应；分 Entity / DTO 写。

### 3.1 `<Resource>` Entity（数据库）

| 字段 | 类型 | 必填 | 说明 | 索引 |
|---|---|---|---|---|
| `id` | `string` / `bigint` | ✓ | 主键 | PK |
| `<field>` |  |  |  |  |

### 3.2 `<Resource>` DTO

- `Request`（入参）
- `Response`（出参）
- `ListItem`（列表项精简版）

## 4. 通用约定

- **响应包装**：`Result<T> { code, message, data: T, traceId }`（按项目惯例）
- **分页响应**：`Page<T> { list: T[], total, page, pageSize }`
- **时间格式**：ISO 8601（`2026-10-07T14:30:00+08:00`）
- **鉴权**：`<JWT in Authorization header / OAuth 2.0 / SSO Token>`
- **版本策略**：`<URL 路径 /api/v1/...>`

## 5. 错误码约定

**业务码格式**：`<命名空间>.<错误>`（小写 + snake_case），如 `order.not_found`、`user.forbidden`。
HTTP 码只表达协议层结果；**同一业务错误跨接口复用同一业务码**，不按接口造码。

| 命名空间 | 业务域 | 示例 |
|---|---|---|
| `<resource>.*` | 资源/资产 | `order.not_found` · `order.duplicate` |
| `user.*` | 用户/权限 | `user.forbidden` · `user.token_expired` |
| `io.*` | 导出/导入 | `io.row_invalid` · `io.template_mismatch` |
| `file.*` | 文件 | `file.too_large` · `file.unsupported_type` |
| `sys.*` | 系统级 | `sys.internal_error` · `sys.downstream_timeout` |

> 新增业务码必须在本表登记并升 v2 契约。使用方已有错误码体系时，本节按该体系登记，**全文只保留一套**（不得与 §2.1 各接口表并存两套写码方式）。

## 6. 待澄清问题（Q&A）

> 列需要产品 / UI / QA 回答的问题；至少 3 个。

- [ ] 业务边界：…
- [ ] 权限边界：…
- [ ] 性能边界：…

### 6.1 变更联系人（契约 v2 升级用）

| 角色 | 联系人 | 备注 |
|---|---|---|
| 契约变更裁决方 | **接口架构师** | 任何歧义 / 字段增删 / 错误码调整 → **必须升 v2**，由接口架构师签字 |
| 升 v2 触发场景 | 后端/前端任一方发现契约与实现冲突 / 字段遗漏 / 业务理解不一致 | **禁止私下约定 / 硬编码兜底** |
| v2 流程 | 改本文件 → 升 v2 → 通知后端 + 前端（**双方都重读契约后**再继续） | 阶段 4/5 任意阶段均可能触发 |

---

## 签字与版本

```markdown
API 契约 v1 ✅ 已签字 @架构师名 YYYY-MM-DD
- 范围：
- 不做：
- 后续变更：升 v2 契约（不在后端悄悄加接口）
```

---

## 下游衔接

API 契约 v1 签字后，前后端可同步进入开发（可并行）：

- 后端走 [`./tech-solution-backend.md`](./tech-solution-backend.md)（阶段 4）
- 前端走 [`./tech-solution-frontend.md`](./tech-solution-frontend.md)（阶段 5）

**任何契约变更必须升 v2**：不要在后端悄悄加接口、前端硬编码兜底。