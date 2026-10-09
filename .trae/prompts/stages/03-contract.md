# 阶段 3：接口契约（架构师主导）

> 输入：PRD v1 + UI Spec v1（均已签字）
> 输出：**`design-contract.md`（API 契约 v1）**—— 含接口路径 + 字段 + 数据模型 + 错误码 + 版本号
> 主导角色：[架构师](../../steering/architect-role.md)
> 路线：被 [`full-pipeline`](../routes/full-pipeline.md) 与 [`both-ends`](../routes/both-ends.md) 与 [`backend-only`](../routes/backend-only.md) 与 [`frontend-only`](../routes/frontend-only.md) 引用
> **同步闸口**：本阶段产物未签字 → 阶段 4 / 5 不得开工（**个人 spec 例外**：落外置个人根的个人 spec 免签字）

---

## 与"前后端拆分"的设计

这是**前后端的唯一同步点**。本阶段只产出**契约**，**不写任何实现代码**。
- 不写 Java / Spring 注解
- 不写 Vue 组件 / API 函数
- 不写数据库 SQL / schema

只产出一份**单一权威源（Single Source of Truth）**——前后端都从这一份文档派生自己的实现。
落地形式：`specs/domains/<domain>/<feature>/design-contract.md`，结构照 [`../../../specs/_template/design-contract.md`](../../../specs/_template/design-contract.md)；需要机器可读时在 §2 内嵌 OpenAPI 3 片段。

---

## 完整提示词模板（复制后填空）

```markdown
# 角色
你是熟悉 [Java + Spring Boot 3 + MyBatis-Plus / 或 Vue 3 + TS] 的**接口架构师**。
你的职责：定义接口、设计数据模型、定错误码、定版本号、维护单一契约文档。
你不写实现代码（那是阶段 4 后端、阶段 5 前端的事）；你只定义**契约**。

# 当前阶段
接口契约。我要把 PRD + UI Spec 转成 `design-contract.md`（API 契约 v1）。

# 输入物
## PRD v[N]
[链接或粘贴：功能范围、用户故事、业务流程、验收清单]

## UI Spec v[N]（如有）
[链接或粘贴：IA、wireframe、组件清单、交互流程、给架构师的接口能力清单]

## 项目上下文
- 后端技术栈：[Java + Spring Boot 3 + MyBatis-Plus + MySQL 8 / 或其它]
- 前端技术栈：[Vue 3 + Vite + TS + jurassic-ui 2.x / 或其它]
- 网关与版本：[<gateway-host>/api/v1/<resource> / 或其它]
- 鉴权方式：[Spring Security + JWT / 统一 SSO / OAuth 2.0]

# 必须读取（AI 必须先读这些再开工）
- .trae/rules/common/mind/self-harness.md
- 使用方本地项目规则：项目路由索引（项目自身 API 路径风格 / 命名约定）
- 使用方本地项目规则：该项目总览（错误码约定 / 分页约定 / 时间格式）

# 输出物

请产出**单一文件** `specs/domains/<domain>/<feature>/design-contract.md`，按下列结构填写（与 `specs/_template/design-contract.md` 对齐）：

- **0. 元信息**：上游需求 / UI Spec 版本（均须已签字）、契约版本、状态、主导
- **1. 接口列表**：按 tags 分组表格——路径 / 方法 / 用途 / 鉴权
- **2. 接口详情**：每个接口一节，按 OpenAPI 3 字段写
  - summary / tags / parameters（query / path / header）
  - requestBody（如有）→ 内嵌 yaml 片段（字段 / 类型 / 必填 / 说明 / 示例）
  - 响应（引用 schema）
  - 错误码：200 / 400 / 401 / 403 / 404 / 500 + 业务码
  - 需要机器可读时，本节片段须符合 OpenAPI 3.0.3（`openapi: 3.0.3` + `paths` + `components`）
- **3. 数据模型**：Entity（DB）/ DTO（Request / Response / ListItem），字段必填与示例
- **4. 通用约定**：响应包装 `Result<T>`、分页 `Page<T>`、时间格式、鉴权、版本策略
- **5. 错误码约定**：按业务域登记业务码命名空间（`<资源>.<错误>`，如 `order.not_found` / `user.forbidden`）
- **6. 待澄清问题（Q&A）**：至少 3 个（业务边界 / 权限边界 / 性能边界）
- **签字与版本**：留空，由人签

# 验收口径
## 契约层
- [ ] 每个接口字段都有类型/必填/说明/示例
- [ ] 错误码覆盖网络层（400/401/403/404/500）+ 业务码（按域分类）
- [ ] 数据模型字段名与下游实现可对齐（不冲突）
- [ ] 鉴权方式明确（即使公开接口也要标注）
- [ ] 路径命名与项目约定一致（kebab-case / camelCase）
- [ ] 分页/排序参数统一复用，不重复定义

## 文档层
- [ ] 接口清单完整、可勾选
- [ ] 待澄清问题列出至少 3 个（哪怕是"已确认"也要写）
- [ ] 元信息中上游版本号与签字状态已填

# 反例（不该做的事）
- 不要写实现代码（Java / SQL / Vue / TS）
- 不要写"灵活、可扩展"——直接给定义
- 不要与项目已有接口风格冲突（如项目用复数资源名 `/users`，不要写 `/user`）
- 不要遗漏鉴权标注（即使公开接口也要标注）
- 不要替 UI 决定组件名（那是阶段 2 UI Spec 的事）
- 不要另开 `interfaces/` 目录、不要把契约拆成 YAML + MD 两件套（单一文件即可）
```

---

## 怎么用

1. **复制上方整段** → 替换方括号内容 → 整段发给 AI
2. **AI 输出后** → 逐项对照"验收口径"打勾
3. **不通过项** → 让 AI 修订（针对不通过项加一句"针对第 X 节再写一版"）
4. **通过后** → 人签字 + 给版本号 `API 契约 v1` → 进入[阶段 4 后端开发](./04-dev-backend.md) + [阶段 5 前端开发](./05-dev-frontend.md)（可并行）

> **契约变更（升 v2）**：阶段 4/5 任意阶段发现契约歧义 / 字段遗漏 / 错误码调整 → **由接口架构师裁决**（禁止私下约定 / 硬编码兜底），改 `design-contract.md` §6.1 登记，**双方重读契约后再继续**。

---

## 常见追问（AI 输出后你需要追问的点）

| AI 输出 | 追问 |
|---|---|
| 错误码只列了 HTTP 码 | "补业务码：按业务域分类列出（如 `order.not_found` / `user.forbidden`）" |
| 数据模型没字段说明 | "每个字段加说明与示例值；外键加 relation" |
| 路径命名与项目不一致 | "查使用方本地项目规则（该项目总览）确认实际命名风格" |
| 待澄清问题章节为空 | "补至少 3 个问题：业务边界 / 权限边界 / 性能边界" |
| 鉴权方式含糊 | "明确 token 格式 / 刷新策略 / 过期时间" |

---

## 下游衔接

`design-contract.md`（API 契约 v1）签字后，前后端可同步进入开发：
- 后端走 [阶段 4 后端开发](./04-dev-backend.md)
- 前端走 [阶段 5 前端开发](./05-dev-frontend.md)

两者**可并行**——契约就是同步条款，不需要等对方。
