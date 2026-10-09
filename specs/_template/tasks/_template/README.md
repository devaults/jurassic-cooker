# tasks/ · 任务清单模板入口

> 本目录是**任务清单模板的入口指针**。
> 阶段 4（后端）与阶段 5（前端）已拆为独立子目录，可并行执行。

## 按层级选模板

| 层级 | 模板目录 | tier | 主导角色 |
|---|---|---|---|
| 阶段 4 后端 | [`backend/_template/`](../backend/_template/) | `backend` | 后端架构师 |
| 阶段 5 前端 | [`frontend/_template/`](../frontend/_template/) | `frontend` | 前端架构师 |

## 同步闸口

两个 tier 都需要引用上游 `design-contract.md` v1（**接口契约**）—— 同步闸口未过，任何 tier 不得开工。