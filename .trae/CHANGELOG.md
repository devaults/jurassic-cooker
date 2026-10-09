# CHANGELOG

> 整个 `.trae/`（规则 + 技能 + 配置 + 脚本）的**统一变更日志**。当前不分规则/技能子日志。
> 索引与维护原则见 [`RULE.md`](./RULE.md)（规则）和 [`SKILL.md`](./SKILL.md)（技能）。

---

## [1.0.0] - 2026-10-09

**首个正式版本：当前仓库现状作为 v1.0.0 冻结。**

### 框架本体

- `.trae/VERSION` → `1.0.0`
- `.trae/SKILL.md` 总览 frontmatter → `version: 1.0.0` / `updated: 2026-10-09`
- `.trae/skills/frontend/playwright-e2e/SKILL.md` → `version: 1.0.0`

### 包含的能力

- **六阶段流水线**（requirements → design-ui → design-contract → dev-backend / dev-frontend → qa），下游只能引用已签字的上游版本号
- **tasks / qa 拆分**：阶段四与阶段五拆成后端/前端两套任务卡，并行推进
- **签字冻结机制**：团队 spec 必签，扫 `草稿 / draft / TODO` 残留关键字；个人 spec 落外置个人根免签
- **Plan 通道**：单文件轻量计划，落 `plans/<YYYY-MM>/<slug>.md`，与 `specs/` 平级；命中任一升级条件（跨 ≥ 2 仓 / 动接口契约 / 需独立 QA / 任务卡 > 5 / 改文件 > 10）即停手转完整 spec
- **个人通道外置**：`config.local.yaml` 的 `spec.personal.root` 决定落点，框架不设默认
- **能力索引**：`.trae/SKILL.md` 总览 + `skills/{common,backend,frontend}/` 三类技能
- **角色卡**：`steering/` 6 个角色（产品 / UI / 架构师 / 后端 / 前端 / QA）+ 思维准则
- **Workspace 模式**：非 monorepo 多仓协作，README 三仓示例（cooker / knowledge / workspace）
- **模板渲染**：`scripts/render-templates.mjs` 路径自算（仓根、模板源、团队输出根、个人输出根），零配置；个人通道传 `--out-root <abs>`
- **黄金路径模板**：`templates/{new-crud-page,migrate-vue2-route,fix-sonar-issues,current-iteration,submit-review,plan,project-readme}.md`
- **17 个技能**（common 3 + frontend 14）：crud-page / auth-router / api-request / state-pinia / i18n-workflow / upload-export / error-feedback / jurassic-ui / jurassic-biz / project-conventions / quality-review / sonar / git-pr / vue3-jurassic-migration / playwright-e2e / git-commit-style / pr-description / incident-postmortem

### 文档

- `README.md`：项目定位 / Workspace 模式释义 / 目录结构（`.trae/` + `docs/` + `plans/` + `specs/`）
- `docs/USAGE.md`：config.local.yaml 配置 / Workspace 开发模式 / 创建 Spec & Plan / 协作与签字
- `specs/README.md`：单库六阶段产物收口；`specs/_template/` 唯一定义各阶段产物骨架
- `plans/README.md`：单文件轻量计划通道说明
