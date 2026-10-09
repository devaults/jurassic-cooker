---
alwaysApply: false
description: 工程化工具链约定、Git Commit Message 规范、构建时校验——改 lint/构建配置或写提交信息时使用
---

### 前端工程化规范

> **具体配置值以各项目实际配置文件为准**（`.eslintrc*` / `.prettierrc*` / `.stylelintrc*` / `package.json`）。
> 本文件只写约定与规范，**不复制会腐烂的配置快照**。

#### 工具职责

eslint 代码规则校验 ｜ prettier 风格格式化 ｜ stylelint 样式校验 ｜ lint-staged 在暂存文件上跑 linter ｜
husky Git Hook（pre-commit / commit-msg）｜ commitlint 校验提交信息格式

#### 通用约定

- ESLint 使用 `vue-eslint-parser`；风格类规则交给 prettier（`plugin:prettier/recommended`），避免两处规则冲突
- 生产环境 `no-debugger`、`eqeqeq` 报错；Vue 指令用简写（`v-bind` / `v-on`）
- lint-staged：`*.vue`、`*.js` → prettier + eslint --fix；`*.{css,scss,less}` → stylelint --fix
- husky：pre-commit 跑 `lint-staged`；commit-msg 跑 `commitlint --edit`
- ⚠️ 引号、分号、缩进等**各项目不一致**（有的要双引号），一律以该项目的 lint 配置为准，不要照搬其它项目

#### Git Commit Message 规范（强制）

格式 **`<type>(<scope>): <subject>`**——**scope 可选**。

依据：本仓多数项目用 `@commitlint/config-conventional`（`commitlint.config.js` / `.commitlintrc.js`），
下表 11 个 type 与该 preset 完全一致；header 上限 100 字符。

```text
feat(user): 用户列表筛选与分页
fix(form): 编辑弹窗二次打开清除校验
refactor(skills): 拍平技能目录，修正路径引用
chore: 添加前端开发规则与技能集合          ← 不写 scope 也可以
```

type 取以下之一：

| type | 说明 | type | 说明 |
|---|---|---|---|
| `feat` | 新功能 | `test` | 测试相关 |
| `fix` | 修复 bug | `build` | 构建系统 |
| `docs` | 文档更新 | `ci` | 持续集成流程 |
| `style` | 格式调整（不影响逻辑） | `chore` | 构建过程或辅助工具变动 |
| `refactor` | 重构（无新功能、无修复） | `revert` | 回滚更早的提交 |
| `perf` | 性能、体验优化 | | |

> 本规范是提交信息的**唯一出处**；技能 `git-pr` 只给示例、不另行定义格式。
> 写入 `scene: git_message` 字段的规则文件会被专门用于生成提交信息（可写在任意规则文件里）。

#### 构建时校验（参考）

部分项目通过 `check-deps` 脚本在 `serve` / `build` 前自动执行：强制依赖检查（如 jurassic-ui）、
禁止使用特定组件库、禁止未替换的中文（vue-i18n）、未使用的 Vue 文件检查。

#### 路径别名

`@` → `src/`；部分项目另有 `views` → `src/views`、`components` → `src/components`。
以该项目 `vue.config.js` / `vite.config.ts` / `tsconfig.json` 为准。
