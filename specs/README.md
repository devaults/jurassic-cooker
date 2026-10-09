# specs/ — 团队 Spec 工作区

> **本目录是团队正式 spec 的唯一落点**：`domains/<domain>/<feature>/`，走六阶段（**需求 → 界面 → 接口契约 → 后端开发 + 前端开发（并行） → QA**），阶段间靠版本号签字冻结。
> 小任务走 **Plan 通道**（轻量单文件计划），产物落与 `specs/` **平级**的 [`../plans/`](../plans/README.md)，免签字、不分阶段。
> **个人任务（个人 spec / 个人 plan）不走本仓**——落**外置个人根**（使用方在本机 `.trae/config.local.yaml` 的 `spec.personal.root` 指定），与团队产物物理隔离。
>
> 对齐 GitHub Spec Kit / Kiro / Forge Kit 的 SDD（Spec-Driven Development）；Plan 通道对齐业界 Plan Mode（轻量范式）。

## 路径与占位符

模板用 `${...}` 占位符引用跨层路径，**不硬编码本机位置，也不需要任何配置文件**——渲染脚本按输出文件位置自算相对路径，换机 / 换工作区 / 团队复用都无需改文档。

| 占位符 | 含义 |
|---|---|
| `${rel.cooker}` | 从当前文件到 cooker 仓根的**相对路径**（如 `../../../..`） |
| `${rel.knowledge}` | 到知识库根的**相对路径** |
| `${rel.project_registry}` | 到项目注册表（`<知识库根>/tooling/project-registry.md`）的**相对路径** |

> 三者都是「相对当前文件」的可点击路径，**不落本机绝对路径**。
> 同一 feature 内的互引直接用相对路径（`./`、`../`、`../../`），不需要占位符。
> 因为按**输出位置**现算，团队 spec（落本仓）与个人 spec（落外置个人根）渲染出的相对路径各自正确，跨仓也不会断链。

生成功能目录（在 `specs/` 下执行）：

```bash
# 团队正式 spec：落本仓 specs/domains/<domain>/<feature>/，团队共享 + 签字冻结
node ../.trae/scripts/render-templates.mjs domains/<domain>/<feature>
# 个人 spec：落外置个人根下的 specs/<YYYY-MM>/<slug>/，不共享、免签字
node ../.trae/scripts/render-templates.mjs specs/<YYYY-MM>/<slug> --out-root <个人根绝对路径>
```

> **团队 spec 路径必须以 `domains/` 开头**（不落 `specs/` 根下，避免与 `README.md` / `_template/` / `domains/` 混杂）；**个人 spec 必须带 `--out-root`**——未指定时个人通道不可用（脚本报错）。
> **零配置**：知识库命名不符约定（`jurassic-knowledge` / `knowledge`）时加 `--knowledge <abs>` 指一次；项目注册表不在约定位置时加 `--registry <abs>`。无需写任何配置文件。

## 六阶段流水线（团队）

| 阶段 | 文件 | 主导 | 签收产物 |
|---|---|---|---|
| 一 · 需求分析 | `requirements.md` | 产品 | PRD（v0.1+） |
| 二 · 界面设计 | `design-ui.md`（如拆） | UI | UI Spec（v0.1+） |
| 三 · 接口契约 | `design-contract.md` | 接口架构师 | API 契约 v1 |
| 四 · 后端开发 | `tasks/backend/T-NN-*.md` | 后端架构师 | 后端代码 + PR |
| 五 · 前端开发 | `tasks/frontend/T-NN-*.md` | 前端架构师 | 前端代码 + PR |
| 六 · 验证验收 | `qa/`（README + checklist） | QA | QA 结论 |

```
specs/domains/<domain>/<feature>/
├── requirements.md   PRD                              ─┐ 阶段一（签字冻结）
├── design-ui.md      UI Spec（视觉）                  ─┤ 阶段二（签字冻结）
├── design-contract.md  API 契约（含内嵌 OpenAPI 片段）   ─┤ 阶段三（⭐同步闸口）
├── tasks/                                            ─┤ 阶段四/五（可并行）
│   ├── backend/T-NN-*.md     后端单任务卡片
│   └── frontend/T-NN-*.md    前端单任务卡片
└── qa/                                                ─┘ 阶段六
    ├── README.md        结论 + 签字
    └── checklist.md     验收对照
```

| 文件 | 对应阶段 | 主导 | 签收产物 | 填写位置 |
|---|---|---|---|---|
| [`requirements.md`](./_template/requirements.md) | 阶段一 | 产品 | PRD | `domains/<domain>/<feature>/` |
| [`design-ui.md`](./_template/design-ui.md) | 阶段二 | UI | UI Spec | `domains/<domain>/<feature>/` |
| [`design-contract.md`](./_template/design-contract.md) | 阶段三 | 接口架构师 | API 契约 | `domains/<domain>/<feature>/` |
| [`tasks/_template/`](./_template/tasks/_template/) | 阶段四/五 | 后端 + 前端架构师 | 任务清单（卡片级签字） | `domains/<domain>/<feature>/tasks/{backend,frontend}/` |
| [`qa/_template/`](./_template/qa/_template/) | 阶段六 | QA | QA 结论 + checklist | `domains/<domain>/<feature>/qa/` |

## 为什么要有 specs/

`.trae/` 里的规则、技能、提示词解决的是「**AI 怎么干活**」；
`specs/` 解决的是「**这个功能要干成什么样 / 拆成哪些活 / 做完没做完 / 验没验过**」——把每个功能的决策落成可评审、可签字、可追溯的文件，
不留在对话上下文里。

| 层 | 目录 | 回答的问题 | 生命周期 |
|---|---|---|---|
| 常驻约束 | `.trae/rules/` | 什么不能做 | 长期 |
| 常驻上下文 | `.trae/steering/` | 以什么角色/思维做 | 长期 |
| 阶段提示词 | `.trae/prompts/stages/` | 怎么把 AI 用对 | 长期 |
| 流水线声明 | `.trae/config.yaml` | 六阶段 / 拆分口径 / 签字规则（声明式，脚本不读） | 长期 |
| **功能设计（团队）** | **`specs/domains/<domain>/<feature>/`** | **做什么 / 怎么做 / 拆成哪些活 / 做完没做完 / 验没验过** | 随功能走 |

## tasks 拆分子文件（why）

单文件 `tasks.md` 在大型功能里会膨胀到数千行（实测本地最大 4179 行），AI 上下文塞爆、签字版本控制难做、跨人协作冲突。

**新结构**（已上线）：

```
tasks/
├── backend/
│   ├── README.md             # 后端总览：元信息 / 任务索引 / 执行顺序 / 全局自检 / 整体签字
│   └── T-NN-<slug>.md        # 后端单任务卡片
└── frontend/
    ├── README.md             # 前端总览（同上）
    └── T-NN-<slug>.md        # 前端单任务卡片
```

收益：
- AI 按卡片增量读，不必一次吞下整份
- 单卡片可独立签字、独立回滚
- 单卡片 < 200 行，AI 处理稳定
- 跨人协作冲突粒度小

## 目录约定

本仓：

```
specs/
├── README.md                    # 本文件
├── _template/                   # 空白模板（勿直接改，复制出去用）
│   ├── requirements.md          # 阶段一
│   ├── design-ui.md             # 阶段二：UI 规范（视觉与交互）
│   ├── design-contract.md       # 阶段三：API 契约（⭐ 同步闸口）
│   ├── tech-solution-backend.md # 阶段四：后端技术方案
│   ├── tech-solution-frontend.md# 阶段五：前端技术方案
│   ├── tasks/
│   │   ├── _template/           # tasks 入口指针
│   │   │   └── README.md
│   │   ├── backend/_template/   # 阶段四：后端任务
│   │   │   ├── README.md
│   │   │   └── T-NN-example.md
│   │   └── frontend/_template/  # 阶段五：前端任务
│   │       ├── README.md
│   │       └── T-NN-example.md
│   └── qa/
│       └── _template/
│           ├── README.md        # QA 结论模板
│           └── checklist.md     # 验收对照模板（运行前置 + 前端/后端两条线分别勾选）
└── domains/                     # 业务域分类（团队正式 spec 存放处）
    └── <domain>/               # 业务域（如：asset-management / data-governance）
        └── <feature>/          # 具体功能（六阶段目录）
```

与 `specs/` **平级**（团队轻量计划，见 [`../plans/README.md`](../plans/README.md)）：

```
plans/
└── <YYYY-MM>/                   # 月目录（如 2026-10/）
    └── <slug>.md                # Plan 通道单文件计划（免签字，git 跟踪）
```

**外置个人根**（不进本仓，路径由使用方指定；按 `<YYYY-MM>/` 月目录组织）：

```
<spec.personal.root>/
├── specs/<YYYY-MM>/<slug>/      # 个人 spec（11 文件，同 domains/ 全流程，免签字）
└── plans/<YYYY-MM>/<slug>.md    # 个人 plan（单文件，免签字）
```

> 团队功能目录**只落 `domains/<domain>/<feature>/`**，不直接放在 `specs/` 根下——避免与 `README.md` / `_template/` / `domains/` 混杂。
> `plans/` 下按 `<YYYY-MM>/` 月目录组织，每月一个目录，任务计划为 `<slug>.md` 单文件，不再往下建层级。

> **推荐结构**：`domains/<domain>/<feature>/`（有业务域归属）。

新建功能（**推荐用脚本**）——目标路径即最终位置，渲染后无需手动移动：

```bash
# 1. 渲染模板
node ../.trae/scripts/render-templates.mjs domains/<domain>/<feature>   # 团队正式 spec

# 2. 填写 requirements.md → design-ui.md → design-contract.md → tasks/{backend,frontend}/T-NN-*.md → qa/checklist.md
```

> `_template/` 是本框架**可移植**的部分；`domains/` 下的功能目录是团队交付物（进本仓、团队可见）。

## 个人 spec（外置，不共享）

> 个人 spec **不进本仓**，落**外置个人根**——由使用方在本机 `.trae/config.local.yaml` 指定 `spec.personal.root`（个人 spec 落其下 `spec.personal.spec_dir`，默认 `specs/`）。框架**不设默认值**，未配置时报错、个人通道不可用。

个人 spec 用于**个人任务开发**：走与团队正式 spec **完全相同**的六阶段、产出**相同**的文件集，只是不共享给团队。

**与团队正式 spec 的唯一差别**：

| 维度 | 团队正式 spec | 个人 spec |
|---|---|---|
| 落点 | 本仓 `specs/domains/<domain>/<feature>/` | 外置个人根 `<root>/specs/<YYYY-MM>/<slug>/` |
| 共享 | 与本仓同步，团队可见 | 不进本仓，仅在本机个人库 |
| 业务域归属 | 必须归入某个业务域 | 不需要 |
| 签字冻结 | 必须 | **不需要**（个人自检即可，不阻塞自己下游） |
| **产物 / 流程** | 12 文件、六阶段 | **完全相同**（同 12 文件，含 STATUS.md） |

**命名约定**：`<YYYY-MM>/<动作>-<对象>`，如 `2026-09/fix-oio-login-redirect`、`2026-10/refactor-cooker-render-script`（月份进目录，文件名不含月份前缀）。

**工作流**（在 `specs/` 下执行，与团队 spec 同）：

```bash
node ../.trae/scripts/render-templates.mjs specs/<YYYY-MM>/<slug> --out-root <个人根绝对路径>
```

1. 按阶段填写 `requirements.md` → `design-ui.md` / `design-contract.md` → `tasks/{backend,frontend}/T-NN-*.md` → `qa/README.md`（顺序同团队 spec）。
2. **免签字**：文件末尾「签字与版本」区块可留空。
3. 完成后可归档可删除，无需登记。

**何时改落本仓 `domains/`**：需要团队共享 / 评审签字 / 有业务域归属 → 上 `domains/<domain>/<feature>/`（即使一人在做，有业务域归属也归入 `domains/`）。

## Plan 通道（`plans/`，小任务轻量流程）

> **面向**：小任务 / 日常迭代（改 bug、单接口迭代、单模块小功能、存量小改造）。
> **产物**：**一份单文件计划** `plans/<YYYY-MM>/<slug>.md`（与 `specs/` 平级；模板 [`.trae/templates/plan.md`](../.trae/templates/plan.md)）。**不产** `requirements.md` / `design-ui.md` / `design-contract.md` / `tasks/` / `qa/`。
> **路线提示词**：[`.trae/prompts/routes/plan-only.md`](../.trae/prompts/routes/plan-only.md)；行为规则仍受 [`plan-mode.md`](../.trae/rules/common/mind/plan-mode.md)（计划先写、等确认再动手）约束。
> **个人 plan**：不落本仓，落外置个人根下的 `plans/`（同免签、同粒度）。

两条通道怎么选：

| 通道 | 产物 | 落点 | 签字 | 流程 | 适用 |
|---|---|---|---|---|---|
| `plans/` | 单文件 `plan.md` | 本仓 `plans/` | 免签 | 调查 → 计划 → 确认 → 执行 → 交卷 | 小任务 / 日常迭代 |
| `domains/` | 六阶段 11 文件 | 本仓 `specs/domains/` | 必须 | 全流程 + 签字冻结 | 大功能 / 团队协作 |

> 个人 spec / 个人 plan 不落本仓，落**外置个人根**；不共享、免签字，下列闸口对其不适用。

**升级闸口（硬约束）**——出现任一，**必须停手转 `domains/`**，不得在 `plans/` 里继续：

- 跨 **2+ 项目仓** 或涉及多角色协作
- 要改 **接口契约**（`design-contract.md` = 前后端同步闸口）
- 需要 **独立 QA 验收** 或 **签字留档 / 上线评审**
- 拆出 **> 5 张任务卡**，或预计改动 **> 10 个文件**

> Plan 通道的计划**只服务单次任务**：跨会话 / 跨人复用的内容要沉淀到 `domains/` 或 `.trae/`，不要留在 `plans/`。

## 用法

1. **起草**：带上对应阶段提示词（[`../.trae/prompts/stages/`](../.trae/prompts/stages/)），让 AI 按 `_template/` 结构产出，落到 `specs/domains/<domain>/<feature>/requirements.md`。
2. **签字冻结**（**仅团队正式 spec**）：人对照验收口径逐条打勾，在文件末尾「签字与版本」区块记录版本号与日期。个人 spec 落外置个人根，免签字。
3. **向下传递**：下一个阶段只引用**已签字**的上游版本号（`requirements.md` → `design-ui.md` + `design-contract.md` → `tasks/` → `qa/`），禁止引用草稿。
4. **执行**：`tasks/{backend,frontend}/README.md` 的勾选状态即开发进度，单卡片内的勾选即单任务进度；与代码改动同步更新。

## 硬约束

- **前阶段未签字，后阶段不开工**（**仅团队正式 spec `domains/`**）：`design-ui.md` / `design-contract.md` 引用未签字的 `requirements.md` = 违规；`tasks/` 引用未签字的 `design-contract.md` = 违规；`qa/` 引用未签字的 `tasks/{backend,frontend}/README.md` 整体结论 = 违规。个人 spec 落外置个人根、免签字，不受此约束、也不阻塞自身下游。
- **UI Spec 是软闸口（重要）**：阶段 5 前端开发期间若发现 UI Spec 需变更（漏状态 / 缺交互），**必须升 UI Spec v2**，并主动同步给阶段 4 后端与接口架构师确认是否连带影响 `design-contract.md`；禁止"小修一下继续走"。`design-ui.md` 模板§0 元信息已预留"上游变更记录"行。
- **Plan 通道不越界**：`plans/` 只放单文件计划；命中升级闸口（跨 2+ 项目仓 / 改接口契约 / 需独立 QA 或签字留档 / > 5 张任务卡 / > 10 个文件）必须停手转 `domains/`。
- **个人产物不落本仓**：个人 spec / 个人 plan 落外置个人根（`spec.personal.root`）；本仓只放团队产物。
- **模板只读**：改结构改 `_template/`，不要在功能目录里各改各的。
- **一功能一目录**：跨功能共用内容放 `.trae/steering/` 或 `.trae/rules/`，不要塞进 specs。
- **不写业务代码**：本目录只放**规范**，业务代码落在使用方的项目仓库（如 `<业务项目仓库>`）。
- **重资产不进 specs**：E2E 用例工程、扫描产物、回归清单放知识库的 `work/qa/`；E2E **运行产物**（截图 / 录屏 / trace）默认落 cooker `.screenshots`（git 忽略，可用 `.trae/config.local.yaml` 覆盖，见 `skills/frontend/playwright-e2e/SKILL.md`）。本目录只留文本与轻量 checklist。
- **不硬编码本机路径**：跨层引用用 `../` 相对路径或 `${rel.*}` 占位符，不写绝对路径。
