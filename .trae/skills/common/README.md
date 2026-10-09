# skills/common/ — 跨端通用技能

> 跨项目、跨语言、跨角色通用的流程型技能。
> 仅当某个流程**跨端通用**且**正文较长**（不适合放 rules）时才放到这里；其余放 frontend/backend 或 common/rules/。

## 当前技能

| 技能 | 主题 | 触发条件 | 路由表位置 |
|---|---|---|---|
| [`git-commit-style`](./git-commit-style/SKILL.md) | Git 提交信息规范 | 任何 commit / `git log` 梳理 / commit hook | P0 日常开发 |
| [`pr-description`](./pr-description/SKILL.md) | PR 描述模板 | 任何 PR 创建 / 评审 | P0 日常开发 |
| [`incident-postmortem`](./incident-postmortem/SKILL.md) | 故障复盘文档结构 | 任何线上/准线上事故 | P1 专项 |

- **技能数**：3
- **状态**：基础三件套（提交/PR/复盘）已覆盖；待补：markdown-style（建议放 rules 而非技能）

## 分类判定标准

放 `common/skills` 而非 `frontend/skills` 或 `backend/skills` 当且仅当:

1. **内容跨多语言/多技术栈** —— 例如"如何写 PR 描述"对 Java/TS/Go 都适用
2. **触发信号不明显依赖项目类型** —— 不会被 "vue / Jura / Spring" 这类 token 触发
3. **正文长度 > 50 行** —— 短流程优先考虑放 rules 或 templates

## 不收录的内容

- 任何带技术栈描述（Vue/React/Node/Spring）的技能 → `frontend/` 或 `backend/`
- 单文件 ≤ 50 行的短流程 → 放到 `../templates/` 或 `../rules/common/mind/` 即可

## 补齐流程

1. 在本目录下新建 `skills/<kebab-case-name>/SKILL.md`
2. SKILL.md 必须含 `name` + `description` frontmatter（Trae 识别机制）
3. 在 [`../../SKILL.md`](../../SKILL.md) 的路由表 P0/P1 区域登记
4. 在 [`../../CHANGELOG.md`](../../CHANGELOG.md) 追加一条
5. `git diff` 复核