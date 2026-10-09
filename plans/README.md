# plans/ — Plan 通道（轻量计划，免签字）

> 小任务的**单文件计划**存放处：按 `<YYYY-MM>/` 月目录组织，一类任务一个 `<YYYY-MM>/<slug>.md`。
> 与 [`../specs/`](../specs/README.md)（正式 spec，六阶段 12 文件）**平级**：本目录是「轻量档」，`specs/` 是「完整档」。
> 模板：[`../.trae/templates/plan.md`](../.trae/templates/plan.md)；路线：[`../.trae/prompts/routes/plan-only.md`](../.trae/prompts/routes/plan-only.md)。

## 定位

| 档位 | 落点 | 产物 | 签字 | 适用 |
|---|---|---|---|---|
| **轻量（本目录）** | `plans/<YYYY-MM>/<slug>.md` | 单文件计划 | 免签 | 小任务 / 日常迭代 |
| 完整（团队） | `specs/domains/<domain>/<feature>/` | 六阶段 12 文件 | 必须 | 大功能 / 团队协作 |

> **个人任务不落本仓**：个人 spec / 个人 plan 落**外置个人根**（由使用方本机 `.trae/config.local.yaml` 的 `spec.personal.root` 指定，见 [`../specs/README.md`](../specs/README.md) 的「个人通道（外置）」一节）。本目录只放**本仓（团队）**的小任务计划。

## 何时用本目录

✅ 同时满足：只动 1 个项目仓 / 预计 ≤ 10 文件 / 不动接口契约 / 单人完成、无需独立 QA 与签字留档。

❌ 任一命中 → **转 `specs/domains/`**：跨 2+ 项目仓、多角色协作、改接口契约、需独立 QA 或签字留档、拆 > 5 张任务卡、预计改 > 10 个文件。

## 目录结构

```
plans/
└── <YYYY-MM>/               # 月目录，如 2026-10/
    ├── <slug>.md            # 任务计划（单文件）
    └── <slug>.md
```

## 命名约定

月目录 `<YYYY-MM>`（如 `2026-10/`）+ 计划文件 `<动作>-<对象>.md`（不含月份前缀），如 `2026-10/fix-login-redirect.md`、`2026-10/adjust-chart-axis.md`。

## 约定

- 一任务一文件；计划写进文件后用 `git` 留痕，**不写进对话上下文**。
- 完成后回填 §6「交卷结论」即可；可归档可删除，**无需登记**。
- 计划**只服务单次任务**：跨会话 / 跨人复用的内容请写进 `specs/` 或 `.trae/`，不要堆在这里。
- 本目录**不放代码、不放重资产**（截图 / 录屏 / trace 与 E2E 用例工程见使用方知识库，约定见 [`../specs/README.md`](../specs/README.md) 的「硬约束」）。
