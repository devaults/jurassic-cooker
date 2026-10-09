# 路线 0：Plan 通道（轻量，小任务优先判定）

> **场景**：小任务 / 日常迭代——改 bug、单接口迭代、单模块小功能、存量项目小改造。
> **不产六阶段 spec**，只产**一份单文件 `plan.md`**（落 `plans/`，与 `specs/` 平级），免签字、不分阶段、不拆任务卡。
> **个人任务例外**：个人 plan 不落本仓，落**外置个人根**（本机 `.trae/config.local.yaml` 的 `spec.personal.root`）。

## 适用判定

**任一命中 → 升 Spec 通道**（`specs/domains/`），走 [`both-ends.md`](./both-ends.md) 或 [`full-pipeline.md`](./full-pipeline.md)：

- 跨 2+ 项目仓 / 多角色协作
- 要改 `design-contract.md`（接口契约 = 前后端同步闸口）
- 需要独立 QA 验收 或 签字留档 / 上线评审
- 拆出 > 5 张任务卡，或预计改动 > 10 个文件

> 与 `.trae/config.yaml` 的 `plan.upgrade_when` 字段保持一致：以上 5 条**任一**触发即升级。
> 即便"看起来是小任务"，只要命中以上任一，都必须走 Spec 通道。

## 提示词顺序

| 顺序 | 环节 | 做法 |
|---|---|---|
| 1 | 调查 | 读相关代码与对应技能（按域读 `.trae/skills/`），确认现状与影响面 |
| 2 | 出计划 | 复制 [`../../templates/plan.md`](../../templates/plan.md) → `plans/<YYYY-MM>/<slug>.md`（个人任务 → 落外置个人根 `spec.personal.root` 下的 `plans/<YYYY-MM>/`），填 §0~§5 |
| 3 | **等确认** | 停下，等用户"OK"或修改意见（见 [`../../rules/common/mind/plan-mode.md`](../../rules/common/mind/plan-mode.md)） |
| 4 | 执行 | 按步骤做，每步过验证检查点 |
| 5 | 交卷 | 回填 `plan.md` §6 交卷结论（改动文件 / 命令与结果 / 未做项 / 回滚） |

## 关键纪律

- **计划先写、等确认再动手**：不因为"任务小"就跳过计划环节
- **范围必须写"不做什么"**：防 AI 顺手改公共代码
- **不产出 spec 产物**：本通道无 `requirements.md` / `design-contract.md` / `tasks/` / `qa/`；如果发现需要它们，说明选错了通道
- **升级要显式**：执行中命中升级条件 → **停手**，说明原因，转 Spec 通道；不要默默做下去
- **交卷口径同标准**：没跑的命令不许写成跑过（见 [`../../rules/common/mind/change-review.md`](../../rules/common/mind/change-review.md) §三）
