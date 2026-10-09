# RULE.md — 项目规则索引与维护

> **本文件不注入 AI 上下文**（只有 `.trae/rules/` 会被 Trae 读取），它是给人看的**规则侧维护信息**：
> 规则文件清单、约束归属、加载机制、维护原则。**变更历史见 [`CHANGELOG.md`](./CHANGELOG.md)**。
> 规则正文只放**约束**；参考资料一律不进 `rules/`（见第四节）。

## 一、规则文件清单

> **`rules/` 下只放约束正文**（每个 `.md` 自带 `description`，是否常驻见第三节）；索引/说明类内容一律留在本文件，不进 `rules/`。
>
> **目录结构（按端职责切分）**：
> - `common/` —— 与端无关的 AI 行为准则、工具/变更/验证/协作（任何项目下生效）
> - `frontend/` —— 前端语言规范 + 工程化 + 前端特定 AI 行为（前端项目下生效）
> - `backend/` —— 后端专属（**待补**，当前为空）
>
> 由 Trae 在对应项目目录下对话时读取（Trae 原生支持任意子目录 `.trae/rules/`）。

### `common/` 跨端通用规则（任何项目下生效）

> 与 `common/mind/` 严格区分：本目录管**资产/过程维护**（版本、废弃、目录约定），不是 AI 行为准则本身。

| 文件 | alwaysApply | 主题（唯一归属） |
|---|---|---|
| [skill-versioning.md](./rules/common/skill-versioning.md) | false | **Skill Versioning & Deprecation**：SKILL.md 必带 version/status/owner/updated/deprecated frontmatter；语义化版本（major/minor/patch）；弃用流程（标 deprecated → 留 1 版本周期 → 删） |

### `common/mind/` AI 行为准则与工作方法（跨端通用，任何项目下都生效）

> 组织原则：**一个主题一个文件**。`self-harness` 常驻（准则 + 红线索引）；其余 8 个各自独占一个主题，按需加载。

| 文件 | alwaysApply | 主题（唯一归属） |
|---|---|---|
| [self-harness.md](./rules/common/mind/self-harness.md) | ✅ true | **AI 准则 + 红线索引**：自省、计划先行、目标锚定、行为约束、精度纪律、优雅降级、事后反思；以及改代码红线指向哪个文件 |
| [tool-discipline.md](./rules/common/mind/tool-discipline.md) | false | **工具与文件操作**：先读后改、搜索工具选择、并行调用、失败处理、文件与命令 |
| [change-review.md](./rules/common/mind/change-review.md) | false | **变更全流程**：影响分析、第三方代码、最小改动例外、回滚、自检清单、**交卷口径** |
| [verification-recovery.md](./rules/common/mind/verification-recovery.md) | false | **验证与排错**：验证闭环、**完成前自证**、验证范围与前端手测、调试策略、错误恢复 |
| [context-collaboration.md](./rules/common/mind/context-collaboration.md) | false | **协作**：协作纪律、会话边界、跨轮次状态追踪、分歧处理、验收确认、输入建议 |
| [plan-mode.md](./rules/common/mind/plan-mode.md) | false | **Plan Mode 强化**：复杂任务的强制计划——触发条件、三段模板、等确认、执行偏离重 Plan |
| [parallel-agents.md](./rules/common/mind/parallel-agents.md) | false | **Subagent Dispatch**：2+ 独立任务用 subagent 并行；派发模板、收集汇总、反模式 |
| [context-hygiene.md](./rules/common/mind/context-hygiene.md) | false | **Context Window Hygiene**：加载阈值、决策持久化、阶段摘要存档、单轮工具调用卫生、跨会话承接与满载应对 |
| [tdd-ai.md](./rules/common/mind/tdd-ai.md) | false | **AI 版 TDD（验收驱动）**：先写验收口径 → 实现 → 跑验收（带证据）；可观察 + 可证伪 + 可自动化 |

### `frontend/` 前端专属（前端项目下自动生效）

> 包含前端语言规范、前端工程化、前端特定 AI 行为；后端内容**不收录**在这里。

#### `frontend/lang/` 编码语言规范（`description` 智能生效）

| 文件 | 用途 |
|---|---|
| [typescript.md](./rules/frontend/lang/typescript.md) | JS 命名/语法/风格 + TS 类型原则 |
| [vue.md](./rules/frontend/lang/vue.md) | Vue **按仓库版本分流**（Vue2 存量 / Vue3 新代码）+ 冲突优先级 |
| [react.md](./rules/frontend/lang/react.md) | React 函数组件 + Hooks 规范 |
| [css.md](./rules/frontend/lang/css.md) | CSS/Less/SCSS 命名、属性顺序、z-index、`:deep()`、预处理器 |
| [html.md](./rules/frontend/lang/html.md) | HTML 模板缩进/引号/嵌套 |

#### `frontend/eng/` 工程化（`description` 智能生效）

| 文件 | 用途 |
|---|---|
| [config.md](./rules/frontend/eng/config.md) | ESLint/Prettier/Stylelint/Husky、**Git Commit Message 规范**、构建时校验 |
| [sonar.md](./rules/frontend/eng/sonar.md) | SonarQube 规则集与阈值 + **本机 MCP 现状** |
| [security.md](./rules/frontend/eng/security.md) | XSS、敏感信息、CSRF、依赖安全、路由权限 |

#### `frontend/mind/` 前端特定 AI 行为

| 文件 | 用途 |
|---|---|
| [api-cleanup.md](./rules/frontend/mind/api-cleanup.md) | **前端 API 与资源**：竞态/取消/Loading/错误提示/重试/数据防御/接口分层、资源成对清理（axios/Vue 卸载视角） |

### `backend/` 后端专属（待补）

> 当前为空；补齐时按"主题 = owner 文件"建 `lang/{java,sql}.md`、`eng/{config,security,sonar,api-design}.md`、`mind/{api-design,observability}.md`，并登记到下表。

**默认技术方向**（补齐时围绕它展开；改默认前先对齐并记 CHANGELOG）：

| 维度 | 默认 | 维度 | 默认 |
|---|---|---|---|
| 语言 | Java 17+（LTS） | 持久层 | MyBatis-Plus 或 Spring Data JPA |
| 框架 | Spring Boot 3.x | 构建 | Maven |
| 数据库 | MySQL 8 | 接口风格 | REST + JSON |
| 鉴权 | Spring Security + JWT | 测试 | JUnit 5 + Mockito |

> 项目专属内容（项目路由、技术栈总览、业务模块映射）**不在规则里**——本框架只放与具体项目无关的约束；项目信息由使用方在本地 `.trae/rules/`（或知识库）中提供。

## 二、约束归属（同一主题一个文件、只声明一处）

> **两条原则一起用**：
> 1. **不重复**：每条约束只声明一次，其它文件写"见 xxx"指针。
> 2. **不分散**：**同一主题的所有内容必须收拢在同一个文件里**，不允许把"工具""变更""验证""协作"这类主题切碎摊到多个文件。
>
> **动手前的流程**：先定位主题 → 找到该主题的 owner 文件 → **只在该文件里改**；owner 文件内的小节见下表 `§`。
> 若表里找不到主题 ⇒ 这是新主题：先选定唯一 owner（新建或并入最接近的现成主题），登记到本表，再动笔。
>
> 判断"是不是同一主题"看**问题域**而不是颗粒度：例如"先读后改"属**工具使用**主题（→ `tool-discipline`），
> "影响分析"属**变更管理**主题（→ `change-review`），"验证闭环"属**验证**主题（→ `verification-recovery`）。
> **禁止**为了"常驻可见"把各主题的红线抽出来另建汇总文件——那正是分散（`work-discipline.md` 已因此撤销）。

### `common/` 跨端通用（资产/过程维护）

| 主题 | owner 文件 | 覆盖内容 |
|---|---|---|
| Skill Versioning & Deprecation | `common/skill-versioning` | **SKILL.md frontmatter 约定**（name/version/status/owner/updated/deprecated）§1、**语义化版本**（major/minor/patch）§2、**状态机**（stable/beta/deprecated/removed）§3、**弃用流程**（标 deprecated → 留 1 版本周期 → 删）§3.1、**加载与索引** §4、反模式与自检 §5 |

### `common/mind/` 九个主题与细分（跨端通用，**任何项目下生效**）

| 主题 | owner 文件 | 覆盖内容 |
|---|---|---|
| AI 准则 | `common/mind/self-harness` | **§一** 内在准则：自省 §一.1、计划先行 §一.2、目标锚定 §一.3、行为约束 §一.4、精度纪律 §一.5、优雅降级 §一.6、事后反思 §一.7；**§二** 改代码红线索引；**§三** 不知道 > 编造（新增红线） |
| 工具与文件操作 | `common/mind/tool-discipline` | **先读后改** §1、搜索工具选择 §2、并行与串行 §3、**失败重试次数** §4、文件与命令（含 MCP）§5 |
| 变更管理 | `common/mind/change-review` | **影响分析**（含"公共东西"清单、删除前确认无引用）§一.1、第三方代码 §一.2、最小改动例外 §一.3、回滚意识 §一.4、先理解再修改 §一.5、新建文件判断 §一.6、变更后自检 §二、**交卷口径** §三 |
| 验证与排错 | `common/mind/verification-recovery` | **验证闭环**（含先查注册表）§1、**完成前自证** §1.2、验证范围与前端手测 §2、调试策略 §3、错误恢复 §4 |
| 协作与上下文 | `common/mind/context-collaboration` | **协作纪律**（阻塞告知/问题告知不擅改/给选项）§1、会话边界 §2、跨轮次状态追踪 §3、分歧处理 §4、验收确认 §5、输入建议 §6 |
| Plan Mode 强化 | `common/mind/plan-mode` | **触发判定**（8 类必 Plan）§1、**三段模板**（涉及文件/实施步骤/验证检查点）§2、**等用户确认** §3、执行偏离重 Plan §4 |
| Subagent Dispatch | `common/mind/parallel-agents` | **黄金判定**（独立+无依赖+可独立验证）§1、派发模板 §2、收集汇总 §3、与 Plan Mode 配合 §4、决策表速查 §7 |
| Context Window Hygiene | `common/mind/context-hygiene` | **上下文来源** §1、**加载阈值**（单文件≤200行 + 过载信号）§2、**决策持久化**（关键决策写文件）§3、**阶段摘要存档** §4、单轮工具调用卫生 §5、跨会话承接与满载应对 §6 |
| AI 版 TDD | `common/mind/tdd-ai` | **核心信条**（验收口径 = 测试）§1、**三步硬流程**（写口径→实现→跑验收）§2、**好/坏验收口径** §3、**何时不用** §5、与测试金字塔配合 §4 |

> `self-harness` §二 的「红线索引」只写"红线 → owner 文件 §小节"的跳转，**不含正文**——这样既保证常驻可见，又不构成第二处声明。
> 当 owner 文件跨端归属不同时（如"资源成对清理"在前端 → `frontend/mind/api-cleanup`、在后端 → `backend/mind/<某>`），红线索引同时登记多端。

### `frontend/lang/` 语言规范

| 约束 | owner |
|---|---|
| JS 命名、JS 语法、代码风格、数组与对象、`null`/`undefined` | `frontend/lang/typescript` §一–§五 |
| TS 类型（`any`/`unknown`、类型定义位置、`interface` vs `type`、泛型、类型守卫、枚举、`import type`、禁止行为、Vue/React 类型） | `frontend/lang/typescript` §六 |
| 注释（JSDoc） | `frontend/lang/typescript` §七 |
| Vue 通用：命名、模板语法、SFC 标签顺序、父子通信、元素特性顺序 | `frontend/lang/vue` §一 |
| Vue 3 新代码：`script setup` 结构顺序、`ref`/`reactive`、`props`/`emits`、composable、`watch`、响应式陷阱 | `frontend/lang/vue` §二 |
| Vue 2 存量：`data` 函数、`prop` 定义、选项顺序、Vuex、禁 Vue3 语法 | `frontend/lang/vue` §三 |
| React：文件命名、组件结构、Hooks、Props、Context、JSX、性能、禁止行为、React 类型 | `frontend/lang/react`（`any`/`unknown` 见 `frontend/lang/typescript` §六） |
| CSS 命名、语法、风格、选择器、声明顺序、动画、z-index 层级 | `frontend/lang/css` §一–§七 |
| CSS 变量与主题、`!important` 限制、`:deep()`、预处理器、Vue 中样式（含 `scoped` 默认） | `frontend/lang/css` §八–§十二 |
| 移动端适配、暗色主题（仅相关项目适用） | `frontend/lang/css` 附录 |
| **主题走 `juraTheme`、禁止覆盖 `.ant-*` 换品牌色** | `frontend/lang/css` 开头「分工」块 |
| HTML 语法、文档结构、推荐与参考 | `frontend/lang/html` |

### `frontend/eng/` 工程化

| 约束 | owner |
|---|---|
| 工具职责、lint-staged/husky 约定、各项目配置以实际为准 | `frontend/eng/config` |
| **Git Commit Message** type 表、`scene: git_message` | `frontend/eng/config` |
| 构建时校验（`check-deps`）、路径别名 | `frontend/eng/config` |
| Sonar 规则集与阈值、嵌套三目、`sonar-project.properties`、本机 MCP 现状 | `frontend/eng/sonar` |
| 安全：XSS、敏感信息、CSRF、依赖、数据校验、路由权限 | `frontend/eng/security` |

### `frontend/mind/` 前端特定 AI 行为

| 约束 | owner |
|---|---|
| 请求竞态、卸载取消、Loading、错误提示、重试、数据防御、接口分层 | `frontend/mind/api-cleanup` §一–§七 |
| 资源成对清理（含 Vue/React 清理模板） | `frontend/mind/api-cleanup` §八 |

### `backend/` 后端（待补）

### 不在 `rules/` 的信息

| 内容 | 去哪 |
|---|---|
| 工作区地图（仓库关系、索引去哪查、冲突优先级） | 使用方本地项目规则（工作区内的 `.trae/rules/`） |
| 项目名（仓库名）、技术栈、命令、能力标签、同名副本 | 使用方本地的**项目注册表**（不在本框架内） |
| 项目路由、项目总览、业务模块 ↔ 文件位置映射表 | 使用方本地项目规则 + 项目文档 |
| 文档模板、黄金路径提示词 | [`templates/`](./templates/README.md) |
| E2E 用例清单与运行方式 | 使用方本地的用例清单 |
| 规则索引、加载机制、约束归属、维护原则 | 本文件（`.trae/RULE.md`） |
| 变更历史（规则 + 技能 + 配置 + 脚本 统一） | [`CHANGELOG.md`](./CHANGELOG.md) |
| 技能总览与选用顺序 | [`SKILL.md`](./SKILL.md) |

### ⚠️ 历史高发问题（改动前重点核对）

**A. 同一件事写了两遍**

| 约束 | 唯一 owner | 曾经同时出现在 |
|---|---|---|
| 跨 3+ 文件先出计划 | `common/mind/self-harness` §一.2 | `common/mind/context-collaboration`、原工作区地图、原 `work-discipline` |
| 工具失败重试次数 | `common/mind/tool-discipline` §4 | `common/mind/self-harness`、`common/mind/verification-recovery`、原 `work-discipline` |
| 删除代码/文件前确认无引用 | `common/mind/change-review` §一.1 | `common/mind/tool-discipline`、`common/mind/self-harness`、原 `work-discipline` |
| 不越界改动 / 不碰凭据 / 不加未要求内容 | `common/mind/self-harness` §一.4 | `common/mind/tool-discipline`、`common/mind/change-review`、原工作区地图 |
| 交卷口径 | `common/mind/change-review` §三 | `common/mind/verification-recovery`、原 `work-discipline` |
| 命令以注册表为准 | `common/mind/verification-recovery` §1 | 原项目总览、原工作区地图、原 `work-discipline` |
| `v-for` key / `v-if`+`v-for` | `frontend/lang/vue` §一 | `common/mind/change-review` 自检 |
| `!important` 禁止与例外 | `frontend/lang/css` §九 | `common/mind/change-review` |
| 主题 `juraTheme` / 禁覆盖 `.ant-*` | `frontend/lang/css` 分工块 | `frontend/lang/vue` |
| 资源成对清理 | `frontend/mind/api-cleanup` §八 | `common/mind/change-review`、`frontend/lang/react` |
| 冲突优先级 | 使用方本地工作区地图 §3 | `frontend/lang/vue` |

**B. 同一主题被拆散**（已被"不分散"原则纠正）

| 主题 | 曾经散落在 | 现状 |
|---|---|---|
| 工具使用 | `tool-discipline` + `work-discipline` §1（先读后改） | 全归 `common/mind/tool-discipline` §1 |
| 变更管理 | `change-review` + `work-discipline` §2（影响分析） | 全归 `common/mind/change-review` §一.1 |
| 验证 | `verification-recovery` + `work-discipline` §3 | 全归 `common/mind/verification-recovery` §1 |
| 交卷/报告 | `work-discipline` §4 + `verification-recovery` §4 | 全归 `common/mind/change-review` §三 |
| 协作与沟通 | `self-harness`（当时的第 6 节「主动沟通」）+ `context-collaboration` | 全归 `common/mind/context-collaboration` §1 |
| **跨主题红线汇总** | `work-discipline.md` 把四个主题的红线抽出来单独放 | **该文件已撤销**；红线回各主题，索引留在 `common/mind/self-harness` §二 |

## 三、加载机制与配置策略

| `alwaysApply` | 其他字段 | 生效方式 |
|---|---|---|
| `true` | — | 始终生效 |
| `false` | `globs: "**/Xxx/**"` | 指定文件生效（**只匹配当前工作区内的文件**） |
| `false` | `description: "适用场景"` | 智能生效（AI 判断相关性） |
| `false` | — | 手动触发（`#Rule` 提及） |

另外 Trae 还支持 `scene: git_message`（提交信息专用规则）与 `AGENTS.md` / `CLAUDE.md`（需在 设置 > 规则 打开开关）。

**配置策略**：仅 `mind/` 下 **1 个**文件 `alwaysApply: true` —— `self-harness.md`（准则 + 红线索引）；其余 8 个主题文件用 `description` 智能生效。

> 除此之外不再新增常驻文件：把各主题的红线抽出来另建常驻汇总 = 同一主题分散到两处（见第二节原则 2）。
> 需要常驻可见的红线，统一登记到 `self-harness.md` §二 的索引表（只放跳转，不放正文）。

> ⚠️ **注意加载成本**：Trae 官方技能文档写明「规则采用全量加载机制，一旦开启对话，所有规则都会被注入并持续占用上下文窗口」——这与规则文档里"四种生效方式"的表述存在张力。**稳妥做法是按"每行都常驻"对待**：规则只写约束，参考表/模板/命令清单一律移出。

> **为什么不用 globs**：本框架（规则与技能）与项目源码通常不在同一仓库，日常按**工作区模式**打开（工作区文件同时包含本框架与项目源码目录），此时规则与技能一起生效；若工作区缺少本框架目录则完全不生效。

## 四、信息文件放哪（重要）

Trae **没有** docs / knowledge 这类目录。信息文件只有三个去处，按成本从低到高：

| 去处 | 加载成本 | 适合 |
|---|---|---|
| **普通项目文件**（使用方本地知识库的文档与 `tooling/`） | Read 按需，**最便宜**，不依赖 Trae 特性 | 映射表、命令清单、模板、报告 |
| **`.trae/skills/<技能>/`** | 官方按需加载（先扫 description） | 需要**被触发**、但正文较大的流程/资料 |
| **`.trae/rules/` 子目录** | 可能常驻注入，**最贵** | 只放真正的约束 |

补充两个 Trae 特性：
- 任意**子目录**下的 `.trae/rules/` 会被读取，且**仅当涉及该目录文件时生效**——适合给单个模块放专属规则；
- `.agents/skills/` 也可放技能（需在设置里开启；与 `.trae/skills/` 重名时后者优先）。

## 五、命名与维护原则

- 各目录用主题英文单词命名，不带前缀
- 单文件 ≤ 200 行（适用于 `rules/`；`skills/` 按需加载可豁免——SKILL.md 本体建议 ≤ 200 行，参考型附属文件如组件速查表不限）；强制 / 推荐 / 参考 分级标注
- **规则只写约束与流程**；信息型内容（映射表、模板、命令注册表）不进 `rules/`
- **不重复**：同一件事只声明一次——先查第二节「约束归属」，只改 owner 文件，其它写"见 xxx"指针
- **不分散**：同一主题的内容必须收拢在同一个文件里。判断主题看**问题域**（工具 / 变更 / 验证 / 协作 / API / 语言 …），
  不要按颗粒度切碎；也不要为"常驻可见"另建汇总文件（红线索引除外，它只放跳转）
- 新增主题时：先在本目录 `rules/<分类>/` 建**一个**新文件承载该主题，登记到第二节，再动笔
- 与技能冲突时，在文件顶部写明优先级（全局优先级见使用方本地项目规则中的「工作区地图」§3）
- 新增/移动文件后同步本文件第一节「规则文件清单」与第二节「约束归属」，并在 [`CHANGELOG.md`](./CHANGELOG.md) 追加一条，最后 `git diff` 复核
