# <功能名> · 全局进度看板

> **轻量索引**：跨后端 / 前端 / QA 三方进度，**只引用** `tasks/{backend,frontend}/README.md` 与 `qa/README.md`，不重复内容。
> 用途：产品 / 项目经理一眼看到"这功能现在到哪了"——不用打开 3 个 README 拼凑。
>
> **不在此维护状态**：进度以 `tasks/{backend,frontend}/README.md` 的勾选为准；本表只做**汇总视图**（变更时同步）。

---

## 0. 元信息

| 项 | 值 |
|---|---|
| 功能 slug | `<feature>` |
| 项目 | `<仓库名>` |
| 状态总览 | `<未启动 / 进行中 / QA 中 / 已上线>` |
| 最近更新 | `<YYYY-MM-DD by @name>` |

## 1. 阶段产物状态

| 阶段 | 产物 | 版本 / 签字 | 文件 |
|---|---|---|---|
| 1 需求 | PRD | `<v1 已签字 / v0.1 草稿>` | [`./requirements.md`](./requirements.md) |
| 2 界面 | UI Spec | `<v1 已签字 / 软闸口，详见模板>` | [`./design-ui.md`](./design-ui.md) |
| 3 接口契约 | API 契约 v1 | `<v1 已签字 / v2 由 @架构师 升，理由：…>` | [`./design-contract.md`](./design-contract.md) |
| 4 后端 | 后端技术方案 + PR | `<v1 已签字 / 进行中>` | [`./tech-solution-backend.md`](./tech-solution-backend.md) |
| 5 前端 | 前端技术方案 + PR | `<v1 已签字 / 进行中>` | [`./tech-solution-frontend.md`](./tech-solution-frontend.md) |
| 6 QA | QA 结论 | `<通过 / 有条件通过 / 不通过>` | [`./qa/README.md`](./qa/README.md) |

## 2. 执行进度

| 维度 | 总数 | 完成 | 进行中 | 未开始 | 详见 |
|---|---|---|---|---|---|
| 后端任务卡 | `<N>` | `<x>` | `<x>` | `<x>` | [`./tasks/backend/README.md`](./tasks/backend/README.md) |
| 前端任务卡 | `<N>` | `<x>` | `<x>` | `<x>` | [`./tasks/frontend/README.md`](./tasks/frontend/README.md) |
| QA 验收项 | `<N>` | `<x>` | `<x>` | `<x>` | [`./qa/checklist.md`](./qa/checklist.md) |

## 3. 当前阻塞 / 风险

- **阻塞项**：`<列出当前阻塞开发/QA 的问题>`
- **风险点**：`<列出已识别但未阻塞的风险>`
- **下次同步时间**：`<YYYY-MM-DD>`

## 4. 变更轨迹（最近 5 条）

| 日期 | 阶段 | 变更 | 操作人 |
|---|---|---|---|
| `<YYYY-MM-DD>` | `<阶段>` | `<如：契约升 v2 / 任务卡拆分 / 阻塞解除>` | `<@name>` |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
