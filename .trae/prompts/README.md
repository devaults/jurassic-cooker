# prompts/ — 阶段提示词

> 本目录提供**两种使用方式**：
> 1. **按路线**（推荐）：先在 [`routes/`](./routes/) 选你的路线，整段复制使用
> 2. **按阶段**：直接在 [`stages/`](./stages/) 选单阶段提示词独立使用

按路线使用能保证"哪些阶段必走 / 哪些可跳 / 哪些可并行"，避免漏掉同步闸口（如接口契约）。

---

## 选路指南

| 你的情况 | 走这条 | 入口 |
|---|---|---|
| 小任务 / 日常迭代（改 bug、单接口迭代、单模块小改） | `plan-only` | [`routes/plan-only.md`](./routes/plan-only.md) |
| 接到后端给的 API 文档 / Swagger，只做前端 | `frontend-only` | [`routes/frontend-only.md`](./routes/frontend-only.md) |
| 接到产品需求 + 接口契约，只做后端 | `backend-only` | [`routes/backend-only.md`](./routes/backend-only.md) |
| 一个功能前后端都做（小功能、一人全包） | `both-ends` | [`routes/both-ends.md`](./routes/both-ends.md) |
| 完整从需求到上线（团队协作 / 大功能） | `full-pipeline` | [`routes/full-pipeline.md`](./routes/full-pipeline.md) |

> 路线 = 一组**有序**的阶段提示词（含哪些可并行、哪些必签字、哪些可跳）。

## 单阶段提示词（用于临时补某个阶段）

| 阶段 | 主导 | 产物 | 提示词 |
|---|---|---|---|
| 1 需求 | 产品 | `requirements.md` | [`stages/01-requirement.md`](./stages/01-requirement.md) |
| 2 界面 | UI 设计 | UI Spec（视觉部分） | [`stages/02-ui.md`](./stages/02-ui.md) |
| **3 接口契约** | **架构师** | **`design-contract.md`（API 契约 v1）** | **[`stages/03-contract.md`](./stages/03-contract.md)** |
| **4 后端开发** | **后端架构师** | 后端代码 + PR | [`stages/04-dev-backend.md`](./stages/04-dev-backend.md) |
| **5 前端开发** | **前端架构师** | 前端代码 + PR | [`stages/05-dev-frontend.md`](./stages/05-dev-frontend.md) |
| 6 QA | QA | `qa/README.md` + checklist | [`stages/06-qa.md`](./stages/06-qa.md) |

## 同步闸口（重要）

- **接口契约阶段**（3）是前后端的**强制同步点**：未签字的 `design-contract.md`（API 契约 v1），前后端均不得开工。
  - 仅前端路线可绕过（你拿到的是后端已定的 API 文档）。
  - 仅后端路线：必须有已签字的 `design-contract.md` 才能开工。
- **签字确认**：UI Spec、API 契约、PRD 都必须有人签字（哪怕 AI 在末尾给建议，签字方必须是人）。
- **个人 spec 例外**：个人 spec / 个人 plan 落**外置个人根**（本机 [`../config.yaml`](../config.yaml) 的 `spec.personal.root`，框架默认空值），不共享、**免签字**——上述同步闸口与签字确认对其不适用。
- **Plan 通道例外**：`plan-only`（小任务）走 [`plans/`](../../plans/) 单文件计划，免签字、不分阶段、不拆卡片，无上述闸口；**命中升级条件必须转完整路线**。

## 与角色卡的对应

| 阶段 | 角色卡 |
|---|---|
| 1 | [`../steering/product-role.md`](../steering/product-role.md) |
| 2 | [`../steering/ui-role.md`](../steering/ui-role.md) |
| 3 | [`../steering/architect-role.md`](../steering/architect-role.md) |
| 4 | [`../steering/backend-role.md`](../steering/backend-role.md) |
| 5 | [`../steering/frontend-role.md`](../steering/frontend-role.md) |
| 6 | [`../steering/qa-role.md`](../steering/qa-role.md) |