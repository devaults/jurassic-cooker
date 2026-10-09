# .trae/ — Trae 项目 AI 配置

> **只有 `rules/` 与 `skills/` 会被 Trae 读取**；本目录下的其它文件（含本文件、`RULE.md`、`SKILL.md`、
> `CHANGELOG.md`、`VERSION`）都是给人看的维护信息，不进入 AI 上下文。
> 规则正文只放**约束**；参考资料一律不进 `rules/`（见 [`RULE.md`](./RULE.md) 第四节）。

```
.trae/
├── README.md           # 本文件：目录总览与指路（不注入）
├── RULE.md             # 规则索引：清单 / 约束归属 / 加载机制 / 维护原则（不注入）
├── SKILL.md            # 技能集合总览与选用顺序（**不注入**：不在 skills/ 下，Trae 不识别为技能）
├── CHANGELOG.md        # 统一变更日志：规则 + 技能 + 配置 + 脚本（不注入）
├── VERSION             # 已安装版本号（与 CHANGELOG.md 对齐）
├── config.yaml         # 流水线声明（六阶段 + Plan 通道，不注入）
├── rules/              # 规则：什么不能做（会被注入 → 保持精简）
│   ├── common/         #   跨端通用：AI 行为准则、工具/变更/验证/协作（任何项目下都生效）
│   ├── frontend/       #   前端专属：lang/eng/mind（前端项目下自动生效）
│   └── backend/        #   后端专属：待补（暂无文件）
├── skills/             # 按"端职责"切分；每个技能平铺为 skills/<group>/<name>/SKILL.md
│   ├── frontend/       #   前端技能
│   ├── backend/        #   后端技能（占位，待补）
│   └── common/         #   跨端通用技能
├── steering/           # 常驻上下文：mindset + 多角色卡（不注入）
├── prompts/            # 阶段提示词：路线（含 Plan 通道）+ 六阶段（不注入）
├── templates/          # 黄金路径与空白模板（含 Plan 通道计划模板；不注入）
└── scripts/            # 模板渲染（路径自算，零配置；不注入）
```

`rules/`、`skills/` 与仓库其它文件同属**同一个 git 仓库**（仓库根 `.git`）；改动后建议 `git diff` 复核。
本框架整体由 **git 管理（非 npm 包）**：`rules/`、`skills/` 都是源文件，直接编辑即可，不存在"被下次安装覆盖"。

功能级交付物分**两处平级**落在仓库根：正式 spec 收口在 [`../specs/`](../specs/README.md)（`domains/<domain>/<feature>/`，六阶段、必须签字冻结），轻量计划收口在 [`../plans/`](../plans/README.md)（单文件、免签字、不分阶段）。**个人任务（个人 spec / 个人 plan）不走本仓**——落由使用方在本机 `.trae/config.local.yaml` 指定的**外置个人根**（`spec.personal.root`），与团队产物物理隔离。

## 各文件职责

| 想知道 | 去哪 |
|---|---|
| 规则清单、约束归属、加载机制、维护原则 | [`RULE.md`](./RULE.md) |
| 技能总览与选用顺序 | [`SKILL.md`](./SKILL.md) |
| 变更历史（规则 + 技能 + 配置 + 脚本 统一） | [`CHANGELOG.md`](./CHANGELOG.md) |
| 当前版本 | `VERSION`（与 `CHANGELOG.md` 对齐） |
| 流水线声明（六阶段 + Plan 通道 / 拆分口径） | [`config.yaml`](./config.yaml) |
| 常驻上下文（思维准则 + 角色卡） | [`steering/README.md`](./steering/README.md) |
| 阶段提示词（需求 / 界面 / 接口 / 后端 / 前端 / QA） | [`prompts/`](./prompts/) |
| 黄金路径 / 空白模板 | [`templates/README.md`](./templates/README.md) |
| 项目名（仓库名）/ 技术栈 / 命令 | 使用方本地的**项目注册表**（不在本框架内） |
| 工作区地图、项目路由 / 项目总览 | 使用方本地的**项目规则**（不在本框架内，通常放在知识库的 `.trae/rules/`） |
| 正式 spec（需求 / 设计 / 契约 / 任务 / QA，必签） | [`../specs/README.md`](../specs/README.md) |
| 轻量计划（Plan 通道，单文件、免签） | [`../plans/README.md`](../plans/README.md) |
| 个人产物落哪（个人 spec / 个人 plan） | 使用方本机 `.trae/config.local.yaml` 的 `spec.personal.root`（外置个人根，不在本仓） |
| 信息型内容（映射表 / 模板 / 命令 / 报告）放哪 | [`RULE.md`](./RULE.md) 第四节 |

> 本框架是**通用、可移植**的：路径不硬编码、渲染脚本自动探测自算，不引用本仓库之外的文件；`rules/common/`、`steering/`、`prompts/`、`templates/`、`specs/` 这些部分与具体项目无关。
> 但 `rules/frontend/` 与 `skills/frontend/` 面向 **Jurassic 生态**（Jura 组件库、qiankun 等）——其他团队复用时替换技能层即可。
> 项目注册表、业务模块映射表、E2E 用例清单、工作区地图等**项目专属信息**由使用方在工作区内的本地 `.trae/` 或知识库中提供（见 [`RULE.md`](./RULE.md) 第二节）。