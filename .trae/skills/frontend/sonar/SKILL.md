---
name: sonar
description: >-
  SonarQube code smell and issue remediation via Sonar MCP: detect MCP setup,
  bind projectKey, search OPEN issues, show_rule, fix in repo, verify with
  analyze_code_snippet. Use for Sonar, 异味, code smell, 质量门禁, SQ, 静态扫描修复.
version: 1.0.0
status: stable
owner: "@jurassic-cooker-team"
updated: 2026-10-07
deprecated: false
---

# SonarQube 异味分析与修复

通过 **Sonar MCP** 拉取 SonarQube 上的 OPEN 问题（优先 **Code Smell / 可维护性**），在业务仓库里做**最小正确修复**，并用 MCP 对改后文件做片段级再分析。组件与交卷清单仍遵循 [`../quality-review/SKILL.md`](../quality-review/SKILL.md)。

## 何时使用

- 用户要求消 Sonar 异味、修 SQ 问题、过质量门禁、扫静态问题。
- PR / 分支在 Sonar 上有新增 OPEN issue，需要逐条修或按文件批量修。
- 改完一批代码后，想用 Sonar 规则（而非仅 ESLint）做二次校验。

## 前置：Sonar MCP 是否可用

1. 调用动态工具目录：搜索 namespace / 工具名含 `sonar`（例如 `user-sonar-mcp` 或 Cursor 里配置的 `sonar-mcp`）。
2. **若工具不可用或 namespace 处于 `needsAuth` / `error`**：
   - 先对对应 namespace 调用 `mcp_auth`（若 MCP 支持），仍失败则走 **安装/配置**（下一步）。
   - **禁止**在对话、commit、skill 仓库里写入真实 `SONARQUBE_TOKEN`；只提示用户在本机 MCP 配置或环境变量中填写。

### 安装 / 配置 Sonar MCP（Cursor 示例）

在业务项目或用户级 Cursor MCP 配置中增加 HTTP MCP（路径常见为 `.cursor/mcp.json`）。

必填要点：

| 项 | 说明 |
| --- | --- |
| `url` | 局域网 Sonar MCP 端点，如 `http://192.168.0.129:8080/mcp`（以运维提供的为准） |
| `SONARQUBE_TOKEN` | SonarQube 用户 Token（`User > My Account > Security`），**仅放 headers，勿提交 Git** |
| `SONARQUBE_TOOLSETS` | 建议：`issues,quality-gates,code-smells,bugs,vulnerabilities,security-hotspots` |
| `SONARQUBE_READ_ONLY` | 需要 MCP 改 issue / hotspot 状态时设为 `false`；只读排查可 `true` |

配置后**重启 Cursor / 重载 MCP**，再次探测 namespace 直至工具列表可用。

Trae / 其它 IDE：同样使用 HTTP MCP + 上述 headers；具体文件名遵循该工具的 MCP 文档。

## 解析 Sonar `projectKey`

按优先级：

1. 业务仓库根目录 `sonar-project.properties` 的 `sonar.projectKey`。
2. `package.json` / CI 脚本中的 `sonar.projectKey` 或文档说明。
3. MCP：`search_my_sonarqube_projects`，用仓库名、文件夹名或用户给的 key 搜索。

拿不到 key 时**停止批量拉 issue**，向用户确认 key 或 Sonar 项目是否已创建并完成至少一次扫描。

## 工作流（必须按序）

### 1. 定范围

与用户或 git 变更对齐：

- **增量**：当前分支相对主干的变更文件列表（`git diff --name-only`）。
- **单文件 / 单模块**：用户指定路径。
- **全项目 OPEN 异味**：仅当用户明确要求（issue 可能很多，需分页）。

Sonar 侧文件过滤使用 issue 搜索工具的 `files`（组件 key，多为 `projectKey:相对路径` 形式；以 MCP 返回的 `component` 为准）。

### 2. 拉取问题

优先 MCP 工具 **`search_sonar_issues_in_projects`**，建议默认过滤：

- `issueStatuses`: `OPEN`（必要时加 `CONFIRMED`）
- `impactSoftwareQualities`: `MAINTAINABILITY`（异味）；用户要修 bug/漏洞时改为 `RELIABILITY` / `SECURITY` 或去掉该过滤
- `severities`: 用户未指定时从 `BLOCKER`、`HIGH` 开始，再扩到 `MEDIUM`
- `projects`: `[projectKey]`
- `files`: 增量文件对应的 component keys（若 MCP 支持路径，按返回格式传）

分页：`ps` ≤ 500，`p` 递增直到无新 issue 或达到用户上限。

可选概览：

- `get_project_quality_gate_status`（`projectKey`）
- `get_component_measures`（如 `violations`, `code_smells`, `bugs`, `vulnerabilities`）

对 **Security Hotspot** 用 `search_security_hotspots` + `show_security_hotspot`，修复或评审流程单独处理，不与普通 smell 混为一谈。

### 3. 单条 issue 处理循环

对每条 OPEN issue（按严重级别、同文件聚合）：

1. **`show_rule`**：读取规则 key（如 `typescript:Sxxxx` / `javascript:Sxxxx`）的说明与修复建议。
2. **读本地文件**：定位 `textRange` 行号；只改与规则相关的最小范围，不顺手重构无关代码（见 [`../project-conventions/SKILL.md`](../project-conventions/SKILL.md)）。
3. **修复**：遵循 Jura 前端约定（`jura-*`、TS、i18n 等）；若规则与项目 intentional 设计冲突，先与用户确认是否 `change_sonar_issue_status` 为 `accept` / `falsepositive`，**不要静默忽略**。
4. **本地验证**：
   - 项目有 `npm run type-check` / lint 则跑相关范围。
   - MCP **`analyze_code_snippet`**：`projectKey` + **完整** `fileContent` + `language`: `ts`（Vue 单文件可传 `<script>` 段或整文件，与 Sonar 语言配置一致）+ 可选 `codeSnippet` 限定改动段。
5. 若 analyze 仍报同一 rule：继续改或记录为「需 Sonar 全量扫描才能关闭」的残留。

### 4. 状态与收尾

- 确认修复且全量扫描前 issue 仍可能显示 OPEN：在回复中说明需 CI / `sonar-scanner` 再扫一次才会变 FIXED。
- 误报或 Won't fix：经用户同意后 `change_sonar_issue_status`（`accept` / `falsepositive`），Hotspot 用 `change_security_hotspot_status`。
- 交卷前仍走 **`quality-review`**（功能未因修 smell 而回退）。

## MCP 工具速查

| 目的 | 工具 |
| --- | --- |
| 找项目 | `search_my_sonarqube_projects` |
| 列 OPEN 问题 | `search_sonar_issues_in_projects` |
| 规则说明 | `show_rule` |
| 改后快速分析 | `analyze_code_snippet` |
| 质量门禁 | `get_project_quality_gate_status` |
| 指标 | `get_component_measures` |
| 安全热点 | `search_security_hotspots`, `show_security_hotspot` |
| Issue 状态 | `change_sonar_issue_status` |
| Hotspot 评审 | `change_security_hotspot_status` |

调用前用 `GetDynamicTools` 读取当前环境的 **准确 namespace 与参数 schema**（不同 IDE 下 namespace 名可能不同）。

## 边界与禁止

- **勿**把 Token、完整 MCP headers 写入业务仓库、skill 仓库或 commit。
- **勿**为清 issue 删除业务逻辑、大面积 `eslint-disable` / `@ts-ignore` 代替根因修复（除非规则明确允许且用户同意）。
- **勿**假定 MCP 分析等于服务器扫描；最终以 SonarQube 项目内最新 analysis 为准。
- 一次对话内 issue 过多时：按文件或按严重级别分批，每批汇报「已修 / 待扫 / 需人工决策」。

## 回复用户时

1. `projectKey` 与范围（增量 / 全量 / 单文件）。  
2. 拉到的 issue 数量与优先处理的 severe 分布。  
3. 已改文件列表 + 对应规则 key。  
4. `analyze_code_snippet` 与 type-check/lint 结果。  
5. 需重新跑 Sonar 扫描或需用户在 SQ 上确认的项目。
