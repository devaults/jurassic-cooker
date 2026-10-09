---
name: jura-skills-collection
description: >-
  Jura agent skills collection across frontend / common / backend.
  Routing for Vue 3 + Vite + TypeScript mid-admin apps, CRUD, API, routes/permissions,
  conventions, quality/PR, SonarQube, i18n, Pinia, micro-frontend, upload/export,
  error feedback, Vue 2 to Vue 3 migration, Playwright E2E, plus cross-cutting
  skills (git-commit-style, pr-description, incident-postmortem).
status: stable
version: 1.0.0
owner: "@jurassic-cooker-team"
updated: 2026-10-09
deprecated: false
---

# Jura 技能集合

> ⚠️ **本文件不是 Trae 技能，不会被自动加载**（Trae 只识别 `skills/<name>/SKILL.md`）。
> 它是**给人看的总览 + 选用顺序**；AI 侧由 `skills/<name>/` 下各技能的 `description` 参与匹配。
> 保留它的价值在于「选用顺序」这类**跨技能流程**——单个技能不该独占。

请根据任务选择最匹配的子技能，并遵循对应文件的流程和输出约定。

> **技能生命周期与版本约定**见 [`rules/common/skill-versioning.md`](./rules/common/skill-versioning.md)。
> 所有变更统一登记在 [`CHANGELOG.md`](./CHANGELOG.md)。

---

## 1. 技能目录（按"端"分组 + 按"状态"分类）

### 1.1 稳定技能 ✅

#### `skills/frontend/`（17 个，stable）

| 技能 | 任务信号 | 路由 |
|---|---|---|
| `project-conventions/SKILL.md` | 规范、目录、命名、script setup、Pinia 入门、别名、TS 约定 | P0 |
| `crud-page/SKILL.md` | 列表、筛选、分页、新建编辑弹窗、详情、CRUD 页 | P0 |
| `api-request/SKILL.md` | 接口、联调、request.ts、axios、401、DTO | P0 |
| `swagger-api/SKILL.md` | Swagger/OpenAPI、generate-swagger-types、`src/swagger`、`api.admin` | P0 |
| `auth-router/SKILL.md` | 路由、菜单、权限、hidden、按钮权限、登录跳转 | P0 |
| `quality-review/SKILL.md` | 做完、自测、PR、review、type-check | P0 |
| `sonar/SKILL.md` | Sonar、异味、code smell、SQ、质量门禁、静态扫描修复 | P0 |
| `jurassic-ui/SKILL.md` | 设计稿、Figma、MasterGo MCP、截图、Jura 组件、主题、地图组件 API | P0 |
| `vue3-jurassic-migration/SKILL.md` | Vue2 升 Vue3、old-web、ElementUI、`j-`、visible.sync | P0 |
| `micro-frontend/SKILL.md` | 微前端、qiankun、wujie、`/jc/`、JuraMicroContainer、主子应用 | P1 |
| `jurassic-biz/SKILL.md` | 业务组件、地质成图、GIS 圈选、文件预览上传下载、百科、帆软报表、OnlyOffice、vxe/univer 表格 | P1 |
| `i18n-workflow/SKILL.md` | 国际化、i18n、`$t`、中英文、硬编码中文、加文案 | P1 |
| `state-pinia/SKILL.md` | Pinia store、跨页状态、页面 vs store 边界 | P1 |
| `git-pr/SKILL.md` | 提交、分支、PR 描述、勿提交 .env | P1 |
| `error-feedback/SKILL.md` | Message、Notification、空状态、Result、报错提示 | P1 |
| `upload-export/SKILL.md` | 上传、导出、blob、Excel、luckysheet | P1 |
| `playwright-e2e/SKILL.md` | Playwright、E2E、端到端、跑测试用例、截图产物、.screenshots | P1 |

#### `skills/common/`（3 个，stable，跨端通用）

| 技能 | 任务信号 | 路由 |
|---|---|---|
| `git-commit-style/SKILL.md` | 提交信息、git log、Conventional Commits、`feat:` `fix:` | P0 |
| `pr-description/SKILL.md` | PR 描述、PR 模板、评审 | P0 |
| `incident-postmortem/SKILL.md` | 事故复盘、postmortem、根因、5 Whys、blameless | P1 |

### 1.2 试用技能 🧪

> ⚠️ 当前无 `status: beta` 技能。

### 1.3 已弃用技能 ⚠️

> ⚠️ 当前无 `status: deprecated` 技能。
> 弃用流程：见 [`rules/common/skill-versioning.md`](./rules/common/skill-versioning.md) §5。

### 1.4 占位（待补）

| 目录 | 状态 | 说明 |
|---|---|---|
| `skills/backend/` | ⚠️ 占位 | 计划收录后端专属技能（Java/Spring/MyBatis），见 [`README.md`](./skills/backend/README.md) |

---

## 2. Routing（按任务信号选技能）

### 2.1 P0 日常开发

| 任务信号 | 子技能 |
| --- | --- |
| 规范、目录、命名、script setup、Pinia 入门、别名、TS 约定 | `skills/frontend/project-conventions/SKILL.md` |
| 列表、筛选、分页、新建编辑弹窗、详情、CRUD 页 | `skills/frontend/crud-page/SKILL.md` |
| 接口、联调、request.ts、axios、401、DTO | `skills/frontend/api-request/SKILL.md` |
| Swagger/OpenAPI、generate-swagger-types、`src/swagger`、`api.admin` | `skills/frontend/swagger-api/SKILL.md` |
| 路由、菜单、权限、hidden、按钮权限、登录跳转 | `skills/frontend/auth-router/SKILL.md` |
| 做完、自测、PR、review、type-check | `skills/frontend/quality-review/SKILL.md` |
| 提交信息、git log、Conventional Commits、`feat:` `fix:` | `skills/common/git-commit-style/SKILL.md` |
| PR 描述、PR 模板、评审 | `skills/common/pr-description/SKILL.md` |
| Sonar、异味、code smell、SQ、质量门禁、静态扫描修复 | `skills/frontend/sonar/SKILL.md` |
| 设计稿、Figma、MasterGo MCP、截图、Jura 组件、主题、地图组件 API | `skills/frontend/jurassic-ui/SKILL.md` |
| Vue2 升 Vue3、old-web、ElementUI、`j-`、visible.sync | `skills/frontend/vue3-jurassic-migration/SKILL.md` |

### 2.2 P1 专项

| 任务信号 | 子技能 |
| --- | --- |
| 微前端、qiankun、wujie、`/jc/`、JuraMicroContainer、主子应用 | `skills/frontend/micro-frontend/SKILL.md` |
| 业务组件、地质成图、GIS 圈选、文件预览上传下载、百科、帆软报表、OnlyOffice、vxe/univer 表格 | `skills/frontend/jurassic-biz/SKILL.md`（组件 API 见同目录 `components.md`） |
| 国际化、i18n、`$t`、中英文、硬编码中文、加文案 | `skills/frontend/i18n-workflow/SKILL.md` |
| Pinia store、跨页状态、页面 vs store 边界 | `skills/frontend/state-pinia/SKILL.md` |
| 提交、分支、PR 描述、勿提交 .env | `skills/frontend/git-pr/SKILL.md` |
| Message、Notification、空状态、Result、报错提示 | `skills/frontend/error-feedback/SKILL.md` |
| 上传、导出、blob、Excel、luckysheet | `skills/frontend/upload-export/SKILL.md` |
| Playwright、E2E、端到端、跑测试用例、截图产物、`.screenshots` | `skills/frontend/playwright-e2e/SKILL.md` |
| 事故复盘、postmortem、根因、5 Whys、blameless | `skills/common/incident-postmortem/SKILL.md` |

### 2.3 选用顺序

- **新页面 / 设计稿**：`project-conventions` → `crud-page` → `jurassic-ui`；有接口 → 有 `src/swagger` 则 `swagger-api`，否则 `api-request`；有菜单权限 → `auth-router`；文案双语 → `i18n-workflow`；收尾 `quality-review`（+ 可选 `git-pr`）。
- **微前端相关**：`micro-frontend`（组件细节仍可读 jurassic-ui `extras.md`）。
- **上传导出**：`upload-export`。
- **E2E / 验收走查**：`playwright-e2e`（用例工程 + 产物统一落 cooker `.screenshots`）；收尾仍 `quality-review`。
- **Vue2 → Vue3**：`vue3-jurassic-migration`；冲突时以迁移「强制」为准。
- **Sonar 异味 / 门禁**：`sonar`（MCP 接入以使用方本地配置为准）；修完仍 `quality-review`。
- **业务可视化 / 成图 / 文件类组件**：`jurassic-biz`（先读它的 `SKILL.md` 决策树，再查 `components.md` 对应 §）。
- **声称做完 / PR**：`quality-review` + `git-pr`（有 SQ 要求时加 `sonar`）。

跨领域默认顺序：**约定 → 页面范式 → 组件库 → 接口/权限 → 专项（i18n/微前端/上传）→ 质量 / Git**。

> **新增技能**时保持本路由表稳定，并同步登记到 [CHANGELOG.md](./CHANGELOG.md) + 本索引表。

---

## 3. 使用规则

- 执行前完整阅读选中的子技能；主题与多语言不要凭 Ant Design Vue 1.x / Less 经验硬套。
- 迁移任务必须按路由逐个改，禁止从 `old-web` 整段粘贴 Vue2 语法。
- 遵循项目现有约定，控制修改范围；目录与权限实现以当前仓库为准。
- 说明假设、验证结果和外部阻塞点。
- 子技能均为 Markdown 契约；新增 `skills/<kebab-case-name>/SKILL.md` 时：
  1. **必带 frontmatter**（name / version / status / owner / updated）—— 见 [`skill-versioning.md`](./rules/common/skill-versioning.md) §2
  2. **同步登记**到本文件 §1 + CHANGELOG
  3. **破环性变更**必升 major
  4. **弃用**走"deprecated → 留 1 版本周期 → 删"硬流程