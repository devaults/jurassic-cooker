# 路线 3：前后端都做（小功能，一人全包）

> **场景**：小功能 / 重构 / 改 bug，你一个人包揽前后端。

## 适用判定

✅ 你拿到了：
- PRD v1（产品已签字）
- 你可以自己产出 `API 契约 v1`（不需要走架构师）

❌ 不适用：大功能、跨人协作、架构师需要拍板接口 → 走 [`full-pipeline.md`](./full-pipeline.md)

## 提示词顺序

| 顺序 | 阶段 | 提示词 | 备注 |
|---|---|---|---|
| 1 | 接口契约 | [`../stages/03-contract.md`](../stages/03-contract.md) | **你自产出 + 自己签字**（前提：你也是架构师） |
| 2a | 后端开发 | [`../stages/04-dev-backend.md`](../stages/04-dev-backend.md) | **可与前端并行**（一人也可并行：先做后端 MVP，再做前端联调） |
| 2b | 前端开发 | [`../stages/05-dev-frontend.md`](../stages/05-dev-frontend.md) | **可与后端并行** |
| 3 | QA | [`../stages/06-qa.md`](../stages/06-qa.md) | 跑端到端 |

> **执行建议**：
> - 真正落地时通常是：先快速写后端 MVP（mock 数据也行）→ 再做前端 + 联调
> - 接口契约不必拆成两件套——直接落地为 `design-contract.md` 单一文件给前后端共用

## 关键纪律

- **接口契约必须产出**：哪怕小功能也必须有 `design-contract.md`（API 契约 v1），否则前后端字段对不齐
- **接口实现一致性**：跑 OpenAPI 验证脚本（springdoc / Knife4j）确保 Controller 注解与契约一致
- **避免一个人"想到哪写到哪"**：按契约顺序走，不要后端先写一半又去写前端