---
name: git-commit-style
description: >-
  Git commit message style guide for any project. Use when writing commit
  messages, reviewing commit history, squashing WIP, or setting up commit
  hooks. Covers Conventional Commits header, type/scope rules, body/footer
  conventions, Chinese/English choice, multi-line wrapping, and how to write
  a good subject line. Not for: branch naming (use git-pr skill) or PR
  description (use pr-description skill).
version: 1.0.0
status: stable
owner: "@jurassic-cooker-team"
updated: 2026-10-07
deprecated: false
---

# Git 提交信息规范

> 跨项目、跨语言、跨角色统一。Conventional Commits 风格 + 中文/英文可选。
> 任何角色（开发/QA/架构师/产品）提交代码时都应遵守。

---

## 0. 为什么要有规范

- **可读**：人扫一眼 `git log` 就知道改了什么
- **可检索**：`feat(api):` 一类关键字便于 grep / 工具解析
- **可生成**：自动生成 CHANGELOG / release notes
- **可回滚**：原子粒度的提交便于 `git revert` / `git bisect`

---

## 1. 格式总览

```
<type>(<scope>): <subject>          ← 主题行（必填，≤ 72 字符）

<body>                              ← 正文（可选，wrap 72 字符）

<footer>                            ← 脚注（可选）
```

### 1.1 三段分别是什么

| 段 | 必填 | 字符数 | 说明 |
|---|---|---|---|
| **主题（Subject）** | ✓ | ≤ 72 | 改了什么、为什么改的**总结** |
| **正文（Body）** | ✗ | wrap 72 | 改动的**动机与对比**（不是"做了什么"的代码叙述） |
| **脚注（Footer）** | ✗ | wrap 72 | 引用 Issue / 破坏性变更 / 协同信号 |

> **主题 ≤ 72 字符**是 GitHub / GitLab UI 单行不截断的红线。

---

## 2. Type 类型（9 种）

| Type | 含义 | 例子 |
|---|---|---|
| `feat` | 新功能 | `feat(login): 接入 SSO 单点登录` |
| `fix` | 修 Bug | `fix(table): 修复空数据时表头错位` |
| `docs` | 仅文档 | `docs(readme): 补安装步骤` |
| `style` | 格式（不改语义） | `style(eslint): 统一分号` |
| `refactor` | 重构（不改功能） | `refactor(api): 抽公共 request 拦截器` |
| `perf` | 性能 | `perf(list): 列表虚拟化 > 1000 行启用` |
| `test` | 测试 | `test(user): 补 service 单测` |
| `build` | 构建/依赖 | `build(deps): 升 vue 3.5` |
| `chore` | 杂项 | `chore: 清 .DS_Store` |
| **`revert`** | 回滚 | `revert: feat(login): 接入 SSO` |
| **`ci`** | CI 配置 | `ci(github): 加 Sonar 扫描` |

### 2.1 选错 type 怎么办

- 加新字段又改 UI 又改文档 → `feat`（按主要意图）
- 修 bug 同时改测试 → `fix`（bug 主导）
- 仅格式（prettier）→ `style`
- 改实现但功能不变 → `refactor`

---

## 3. Scope 范围（可选）

`<scope>` 标明**改动的子系统**，便于检索。

**推荐**（按项目实际调整）：

| 类别 | Scope 候选 |
|---|---|
| 前端 | `api` / `store` / `router` / `view` / `component` / `i18n` / `style` |
| 后端 | `controller` / `service` / `mapper` / `entity` / `config` / `dto` |
| 通用 | `deps` / `config` / `readme` / `ci` / `script` / `rule` / `skill` / `template` / `steering` |

> 一个提交**可以有多个 scope**（用 `,` 分隔）：
> `feat(api,store): 用户管理接入 JWT`

---

## 4. Subject 主题写法

### 4.1 7 条规则

1. **动词开头**（"添加 / 修改 / 修复 / 重构 / 移除"）或 imperative 英文（"add / change / fix"）
2. **首字母不大写**（中文不适用；英文 subject 首字母小写）
3. **不加句号**
4. **不超过 72 字符**（中文约 30-40 字）
5. **说明"做了什么"**——不要写"修改了某个文件"
6. **避免"具体但无信息"的词**（如"修复了一些问题"）
7. **避免冗余**（`feat: feat login` 是错的；type 已经是 feat）

### 4.2 对比好/坏

```diff
- feat: 改了一些东西
- fix: 修复 bug
- update code
- WIP
- fix: 在 src/components/UserTable.vue 第 32 行的 onMounted 里加了 console.log
+ feat(user): 用户列表支持按角色筛选
+ fix(table): 修复空数据时表头错位
+ refactor(api): 抽公共 request 拦截器
+ chore: 清 .DS_Store
```

---

## 5. Body 正文写法

### 5.1 何时写

- 改动**动机不显然**（why 比 what 更重要）
- 涉及**多种方案权衡**（说为什么选 A 不选 B）
- 修复了**非平凡 bug**（说根因，不说症状）
- **有 trade-off**（性能 vs 可读性 / 兼容性 vs 新接口）

### 5.2 写法

- **wrap 72 字符**（与 subject 一致）
- 用 `-` 列点（推荐）
- 说明"之前是什么样 / 现在是什么样 / 为什么改"
- **不要**复述 diff（diff 里都有）
- **不要**写"测试通过"之类的废话

```text
feat(login): 接入 SSO 单点登录

之前用账号密码登录，每次发布都要改密码通知全员。
改用 SSO 后用户用公司账号直接登录，省去通知流程。

- 登录页跳 SSO 入口
- 回调处理：校验 ticket + 写 JWT
- 兼容老用户：第一次 SSO 登录自动绑定老账号（按邮箱）
- 失败回退：仍可走账号密码登录
```

---

## 6. Footer 脚注写法

### 6.1 三种合法用法

1. **引用 Issue**：`Refs #123` / `Closes #456` / `Fixes #789`
2. **破坏性变更**：`BREAKING CHANGE: <说明>`
3. **协同信号**：`Co-authored-by: Name <email>` / `Reviewed-by: Name`

### 6.2 破坏性变更

```text
feat(api): 接口响应从 snake_case 改 camelCase

BREAKING CHANGE: 所有前端 api 函数需重新生成；
老接口保留 1 个月灰度。
Refs #456
```

---

## 7. 中文 vs 英文

| 场景 | 推荐 |
|---|---|
| 个人项目 / 内部工具 | 中文（降低表达成本） |
| 团队项目 / 跨地区 | **英文**（工具链兼容好） |
| 提交信息 / 代码注释 | **保持一致**（不混用） |

**本项目（jurassic-cooker）**：以中文为主，英文术语保留原文（type、scope 用英文；subject 可中可英）。

---

## 8. 完整模板（复制即用）

### 8.1 简单改动

```text
feat(scope): 中文 subject

Refs #issue
```

### 8.2 带正文

```text
feat(scope): 中文 subject

之前是什么样的 / 为什么改 / 改后是什么样的

- 改动 1
- 改动 2

Refs #issue
Co-authored-by: Name <email>
```

### 8.3 破坏性变更

```text
refactor(scope)!: 简短的破坏性变更说明

之前是 A，改成 B 了。

BREAKING CHANGE: 详细说明影响范围 + 迁移步骤
Refs #issue
```

> **破坏性变更标记**有两种：`!`（在 type/scope 后）或 `BREAKING CHANGE:`（在 footer）。推荐后者（更易扫）。

---

## 9. 反例清单

```diff
- feat: 改了一堆东西
- fix: 修复 bug
- update
- WIP
- asdf
- feat: 修复登录页面的 bug #123          # ✗ type 与实际不符
- feat(login): 登录。                    # ✗ 加句号
- feat(login): add login feature        # ✗ 首字母大写
- feat(login): Add login feature with JWT token, refresh token, and remember me  # ✗ 太长
- Merge branch 'dev' into 'main'         # ✗ merge commit 不写自定义信息（除非有冲突）
```

---

## 10. 与其他工具的配合

| 工具 | 怎么用 |
|---|---|
| `commitlint` + `husky` | 提交时自动校验格式 |
| `standard-version` / `release-please` | 自动按 type 生成 CHANGELOG / 版本号 |
| IDE 插件 | VSCode `Conventional Commits` / JetBrains `Git Commit Template` |
| `git log --oneline --grep="^feat"` | 按 type 过滤提交历史 |

---

## 11. 与本仓库其他技能的关系

- **branch 命名 / PR 流程** → `skills/frontend/git-pr/SKILL.md`（前端）或 `skills/common/git-pr`（待补通用版）
- **PR 描述模板** → `skills/common/pr-description/SKILL.md`（兄弟技能）
- **故障复盘** → `skills/common/incident-postmortem/SKILL.md`（兄弟技能）
