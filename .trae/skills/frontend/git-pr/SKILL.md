---
name: git-pr
description: >-
  Git and PR hygiene for Jura frontend work: branch naming, commit messages,
  what not to commit, PR description checklist. Use when committing, opening a
  PR, 提交, 分支, or before push.
version: 1.0.0
status: stable
owner: "@jurassic-cooker-team"
updated: 2026-10-07
deprecated: false
---

# Git / PR 约定

交卷功能清单见 [`../quality-review/SKILL.md`](../quality-review/SKILL.md)。本技能管版本库卫生。

## 强制

- 不要提交：`.env`、本地密钥、`*.pem`、含 token 的调试文件、业务项目的 `node_modules`。
- 不要把 skills 安装产生的工具目录（如误装到错误 cwd）无关文件塞进业务仓库；skills 一般已在 `.cursor/skills` 等路径，跟随项目 `.gitignore`。
- 一次 PR / 一次提交只围绕一个需求；禁止顺手大重构无关目录。
- `package-lock.json` / `pnpm-lock.yaml`：跟随仓库已有包管理器，不要混用两种 lock 一起提交。

## 分支（建议，项目有规范则跟随）

| 类型 | 示例 |
| --- | --- |
| 功能 | `feature/user-list` |
| 修复 | `fix/table-bodycell` |
| 迁移 | `migrate/access-page` |

从最新主干拉出；不要直接在 `main` / `master` 堆提交（除非项目允许）。

## Commit message（建议）

简明、说明动机：

```text
feat(user): 用户列表筛选与分页

fix(form): 编辑弹窗二次打开清除校验

migrate(access): 按路由升级访问管理页到 Vue3
```

避免只有 `update` / `fix` / `临时`。

## PR 描述最少写清

1. **改了什么**（路由 / 页面 / 接口）
2. **怎么验**（空列表、二次打开弹窗、分页、权限按钮）
3. **未做 / 风险**（接口未就绪、设计稿缺暗色）
4. **截图**（若有 UI）

合并前：自测 + `quality-review` + 项目若有 `type-check` 则跑过。

## 不要做的事

- `--no-verify` 跳过钩子（除非负责人明确要求）。
- Force push 到共享主干。
- 提交体积巨大的无关产物（`dist/`、本地 zip）。
