# steering/ — 常驻上下文

> 角色设定与思维准则。**不注入** AI 上下文，按需阅读；阶段提示词与角色卡都从这里派生。
> 总览（六角色 × 六阶段）见本文件；角色卡正文见各自文件。

## 六角色

| 角色 | 主导阶段 | 核心职责 | 角色卡 |
|---|---|---|---|
| **产品设计** | 1 需求分析 | 业务目标、用户场景、PRD 拆解、验收口径 | [`product-role.md`](./product-role.md) |
| **UI 设计** | 2 界面设计 | 信息架构、交互流程、视觉规范、走查 | [`ui-role.md`](./ui-role.md) |
| **接口架构师** | 3 接口契约 | API 路径、数据模型、错误码、OpenAPI 维护 | [`architect-role.md`](./architect-role.md) |
| **后端架构师** | 4 后端开发 | 服务端实现、事务、安全、性能、测试 | [`backend-role.md`](./backend-role.md) |
| **前端架构师** | 5 前端开发 | UI 落地、状态管理、错误处理、契约消费 | [`frontend-role.md`](./frontend-role.md) |
| **QA 工程师** | 6 QA 验收 | 端到端验收、契约实测、最终结论 | **[`qa-role.md`](./qa-role.md)（新增）** |

> 六个角色是**思考分工**，不是组织分工。一人可担多角，但阶段产物的**签收方**必须是该阶段主导角色（**个人 spec 例外**：落外置个人根、不共享，免签收）。

## 六阶段瀑布（含前后端同步闸口）

```
需求分析 (产品)  ──►  界面设计 (UI)  ──►  接口契约 (架构师)  ──►  后端 + 前端（可并行） ──►  QA 验收
   │                  │                  │                          │                            │
   ▼                  ▼                  ▼                          ▼                            ▼
PRD v1            UI Spec v1        API 契约 v1                后端代码 + 前端代码          QA 结论
                                                                 （同步闸口已过）
```

- **阶段内**可多轮迭代（AI 反复出版本）
- **阶段间**必须「冻结签字」：上游产物未确认，下游不能开干
- **同步闸口**：阶段 3 接口契约 v1 签字后，**前后端可同步进入开发**，不需要等对方
- 各阶段产物落到 [`specs/domains/<domain>/<feature>/`](../../specs/README.md)（**单库全收口**）：需求 / 设计 / 接口契约 / tasks / QA 全在同一功能目录

## 文件索引

| 文件 | 主题 |
|---|---|
| [`mindset.md`](./mindset.md) | **核心交付**：6 节思维准则（为什么用 AI / 怎么用 AI） |
| [`product-role.md`](./product-role.md) | 产品设计角色卡 |
| [`ui-role.md`](./ui-role.md) | UI 设计角色卡 |
| [`architect-role.md`](./architect-role.md) | 接口架构师角色卡 |
| [`backend-role.md`](./backend-role.md) | 后端架构师角色卡 |
| [`frontend-role.md`](./frontend-role.md) | 前端架构师角色卡（从 oio 拆分） |
| [`qa-role.md`](./qa-role.md) | QA 工程师角色卡（**新增**） |

## 在这套框架里的位置

| 层 | 目录 | 作用 |
|---|---|---|
| 常驻上下文 | `.trae/steering/`（本目录） | 以什么角色、什么思维做事 |
| 约束 | [`.trae/rules/`](../rules/) | 什么不能做（会被注入） |
| 能力 | [`.trae/skills/`](../skills/) | 具体怎么做（按需加载） |
| 工作流 | [`.trae/prompts/`](../prompts/) | 各阶段怎么把 AI 用对；**可选路线** [`prompts/routes/`](../prompts/routes/) |
| 模板 | [`.trae/templates/`](../templates/) | 黄金路径 / 空白模板 |
| 交付 | [`specs/`](../../specs/README.md) | 功能级交付（**单库全收口**）：需求 / 设计 / 接口契约 / 任务 / QA |

> `mindset.md` 是整套框架的「母版」。任何角色卡或阶段提示词与它冲突，**以 `mindset.md` 为准**。

## 配套约定

- 涉及的前端/后端项目：由使用方在本机的项目注册表中定义（工作区内的各项目目录）
- 规则源：`.trae/rules/` ｜ 技能源：`.trae/skills/`（按 `description` 智能触发）
- 调用 AI 时必须把项目名（仓库名）与本地规则位置告诉它，否则 AI 用错上下文（见 `mindset.md` §5）