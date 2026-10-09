# <repo>

> AI 编程协作框架：**多角色 × 六阶段**的 Spec 驱动开发规范，供 Trae IDE 使用。
> 本仓库为**通用模板**：不硬编码仓名 / 绝对路径；渲染脚本自动探测各根位置，**无需任何本地配置文件**。
>
> **快速上手**：[`docs/USAGE.md`](./docs/USAGE.md)（`config.local.yaml` 配置 / Workspace 开发模式 / 创建 Spec & Plan / 协作与签字）

## 为什么创建这个项目

AI 编程的瓶颈从来不是"AI 不会写代码"，而是**人和 AI 之间说不清楚、签不下来、追不到底**。

大多数团队遇到的问题是：
- AI 交付的东西跟产品想要的完全不是一回事，返工到第三次
- 接口定了三次，UI 改了五次，代码跟着滚，谁也说不清"当前最新版"是哪个
- 问 AI"这个功能做到哪了"，AI 给不出口径——没有交付物就没有进度

`jurassic-cooker` 用六阶段流水线把"人和 AI 的协作"变成**有输入、有签字、有输出、可追踪**的工程流程：每个阶段有产出物、每个产出物有角色负责、每个变更有版本记录。

这不是教 AI 怎么写代码——那是业务项目自己的事。这个框架解决的是**人和 AI 怎么配合、怎么签字、怎么追溯**。

## 为什么采用 Workspace 开发模式

`jurassic-cooker` 是个**跨仓编排器**。AI 在一次会话里要同时访问：

| 访问目标 | 举例 | AI 需要做什么 |
|---|---|---|
| 框架资产 | `.trae/skills/`、提示词、模板 | 读模板生成规范文件 |
| 业务代码仓 | `oio-master-web/src/api/foo.ts` | 读旧接口、读组件，写新代码 |
| 个人知识库仓 | `<知识库>/specs/...` | 读写个人通道的 spec / plan |

这三个目录可能分属**三个不同的 Git 仓库**（大多数团队的业务项目都不是 monorepo），Cursor 的 **Workspace** 正是为这种"一个会话穿透多个仓库"而设计的——三仓同时打开，AI 在上下文里自然就能跨仓读写。

Workspace 不是 monorepo 的替代，而是**让 AI 在非 monorepo 结构下也能顺畅工作**的最小配置。

## 为什么采用 Git 仓库管理

把**规范**、模板、提示词、签名都放进 Git 仓库（而不是放飞书 / Notion / 本地文件夹），是为了把 AI 编程流程**接入现成的工程协作基础设施**——具体收益如下：

### 1. 天然的需求流水线记录
每个 spec 是一组文件，**每次升版、签字、改 UI 都是一次 commit**：
- `git log specs/domains/oio/user-mgmt/` = 这个需求从立项到上线的**完整时间线**
- 谁在什么阶段卡了多久、谁签的字、什么时间返工——**改不出来就是查不出来**
- 出事故时一眼能看到"上线前最后改的那一版**规范**是哪个 commit"

### 2. 分支 / 评审 / 合并 = AI 产物的"工程闸口"
- **分支隔离**：探索性 plan 开 `feat/xxx` 分支，不污染主线
- **PR 评审**：**规范**升版要走 PR 流程，UI/契约/技术方案变更**强制有人 review**
- **Code Owner**：可让产品锁 `01-product.md`、架构师锁 `design-contract.md`，谁也绕不开
- **冲突解决**：多人同时改一个 spec，git merge 的成熟工具链直接复用

### 3. 可审计、可回滚、可对比
- 法规/客户审计："上线版本对应的设计稿是哪个 commit？"——`git tag` 一行解决
- UI Spec 改错了？`git revert` 回到上一版签字版
- `git diff v1.0.2 v1.0.3 design-ui.md` 直接看 UI 变更点
- **每份交付物都有"谁、什么时候、为什么改"的注解**（commit message）

### 4. 团队同步零成本
- 新人入职：`git clone` 拿到全部历史**规范**，不再靠"问老员工要飞书链接"
- 跨团队复用：`fork` 一份改自己的产品线，原仓继续升级你也能 `pull`

### 5. 与业务代码仓天然对齐
- 业务项目仓（`oio-master-web` 等）本身就在 Git，**规范**仓与代码仓**同源管理**
- **规范**的 `git tag` 可与代码的 `git tag` 互相对应："v3.1.0 这个版本的**规范**在哪"
- 自动化：CI 可校验"代码改动必须引用某个 spec commit"（未来可加）

### 6. 可移植、可分发的"规范包"
- 本仓库本身就是个**通用模板**——任何团队 `git clone` 即可复用
- 改一改 `config.yaml`、换一换 `skills/frontend/` 下的技能，就是另一套技术栈的框架
- 第三方贡献走标准 PR 流程，跟开源项目无异

### 一句话总结
> **规范**和代码一样是工程产物，应当享受工程级管理：版本控制 / 评审闸口 / 可审计 / 可回滚。
> Git 仓库让 AI 协作从"聊天记录"升级为"有完整血缘的工程资产"。

## 目录

```
<repo>/
├── .trae/         # 全部 AI 编程资产（Trae 配置根目录）
├── docs/          # 面向使用方的人读文档（快速上手 / 总览）
├── plans/         # 单文件计划通道（轻量探索，未触发升仓闸口）
└── specs/         # Spec 驱动开发工作区（单库：六阶段产物全收口）
```

## `.trae/` — AI 编程资产

> Trae 只自动读取 `.trae/rules/`（注入）与 `.trae/skills/`（按需加载），其余为按需阅读。

| 路径 | 作用 | 入口 |
|---|---|---|
| `RULE.md` | 全局约束索引（指向各子规则） | [`RULE.md`](./.trae/RULE.md) |
| `SKILL.md` | 能力索引（指向各子技能） | [`SKILL.md`](./.trae/SKILL.md) |
| `README.md` | `.trae/` 总览 | [`.trae/README.md`](./.trae/README.md) |
| `CHANGELOG.md` | 框架变更日志 | [`CHANGELOG.md`](./.trae/CHANGELOG.md) |
| `VERSION` | 当前框架版本号 | [`VERSION`](./.trae/VERSION) |
| `rules/common/` | 通用约束（**会注入**） | — |
| `rules/backend/` | 后端约束（**会注入**） | — |
| `rules/frontend/` | 前端约束（**会注入**，面向 Jurassic 生态） | — |
| `skills/common/` | 通用能力（按需） | — |
| `skills/backend/` | 后端能力（按需） | — |
| `skills/frontend/` | 前端能力（按需，面向 Jurassic 生态） | — |
| `steering/` | 常驻上下文：思维准则 + 6 个角色卡 | [`steering/README.md`](./.trae/steering/README.md) |
| `prompts/stages/` | 六阶段流水线提示词 | [`prompts/`](./.trae/prompts/stages/) |
| `prompts/routes/` | 跨阶段路由（完整流水线 / 升级闸口等） | [`prompts/routes/`](./.trae/prompts/routes/) |
| `templates/` | 黄金路径与空白模板 | [`templates/README.md`](./.trae/templates/README.md) |
| `config.yaml` | 流水线声明（六阶段 / 拆分口径，声明式） | [`config.yaml`](./.trae/config.yaml) |
| `scripts/` | 模板渲染（路径自算，零配置） | [`scripts/`](./.trae/scripts/) |

> 工具脚本、工具预研文档、项目注册表、工作区地图与项目业务/架构文档等**项目专属信息**，由使用方在其本地知识库中维护（均不在本仓库）。

总览见 [`.trae/README.md`](./.trae/README.md)。

## `specs/` — Spec 驱动开发工作区（单库）

每个业务域一个目录（`<domain>/`），每个功能一个子目录（`<domain>/<feature>/`），按六阶段产出（需求 → 界面 → 接口契约 → 后端 + 前端 → QA）并签字冻结。
**六阶段产物（含 tasks / qa）全部收口在本目录**；知识库只放重资产（QA 报告、E2E 工程、截图等）。

```
specs/
├── README.md                          # 工作区总览
├── domains/                           # 业务域
│   └── <domain>/
│       └── <feature>/
│           ├── requirements.md        # 阶段一：需求（产品）
│           ├── design-ui.md           # 阶段二：UI 规范（UI）
│           ├── design-contract.md     # 阶段三：API 契约（架构师，⭐ 同步闸口）
│           ├── tech-solution-backend.md  # 阶段四：后端技术方案
│           ├── tech-solution-frontend.md # 阶段五：前端技术方案
│           ├── STATUS.md              # 全局进度看板
│           ├── tasks/
│           │   ├── backend/           # 阶段四：后端任务卡
│           │   └── frontend/          # 阶段五：前端任务卡
│           └── qa/                    # 阶段六：QA 验收
│               ├── README.md
│               └── checklist.md
└── _template/                         # 各阶段产物骨架（唯一定义处，不在功能目录里复制定义）
    ├── requirements.md
    ├── design-ui.md
    ├── design-contract.md
    ├── tech-solution-backend.md
    ├── tech-solution-frontend.md
    ├── STATUS.md
    ├── tasks/
    └── qa/
```

任务清单由 [`specs/_template/tasks/`](./specs/_template/tasks/)（模板唯一定义处）复制产出，QA 结论落在同功能目录的 `qa/`。完整用法见 [`specs/README.md`](./specs/README.md)。

## `plans/` — 单文件计划通道

`plans/` 收**轻量、单文件**的计划（如"先调研 X 库"、"小改一下 Y 工具"），不触发"升级到 `specs/domains/`"的闸口。
触发任一条件（跨 2+ 项目仓 / 改接口契约 / 需独立 QA 或签字留档 / > 5 张任务卡 / > 10 个文件）就必须停手转成 spec。

```
plans/
└── README.md
```

## `docs/` — 面向使用方的人读文档

不是给 AI 看的资产，是给**第一次接入这个框架的同学**看的快速上手入口。

```
docs/
└── USAGE.md    # config.local.yaml 配置 / Workspace 开发模式 / 创建 Spec & Plan / 协作与签字
```