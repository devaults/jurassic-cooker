# 路线 2：只做后端

> **场景**：你已接到产品需求 + 已签字的 `API 契约 v1`（通常由架构师产出），只负责后端实现。

## 适用判定

✅ 你拿到了：
- 已签字的 `API 契约 v1`（`design-contract.md`）
- PRD v1（业务背景）

❌ 不适用：需要重新设计接口 → 走 [`both-ends.md`](./both-ends.md) 或 [`full-pipeline.md`](./full-pipeline.md)

## 提示词顺序

| 顺序 | 阶段 | 提示词 | 备注 |
|---|---|---|---|
| 1 | 接口契约（核对） | [`../stages/03-contract.md`](../stages/03-contract.md) | **不必重新产出**，而是核对"我手上的契约 v1 与 PRD 一致" |
| 2 | 后端开发 | [`../stages/04-dev-backend.md`](../stages/04-dev-backend.md) | 主战场 |
| 3 | QA | [`../stages/06-qa.md`](../stages/06-qa.md) | 跑接口测试 + 集成测试 |

## 关键纪律

- **不超契约**：你只能实现 `API 契约 v1` 中已定义的接口；不能擅自加字段、改错误码、改路径
- **接口变更**：业务侧提出新需求 → 退回阶段 3 升 v2 → 不要在后端悄悄加接口
- **接口实现对齐 OpenAPI**：Controller 注解（Swagger / springdoc-openapi）要与契约一致；定期跑 `mvn verify` 检查同步
- **测试覆盖**：service 层 >80%，controller 层每个契约接口至少 1 个 happy + 2 个异常