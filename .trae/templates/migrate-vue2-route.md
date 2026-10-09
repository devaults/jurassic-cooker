# 黄金路径：Vue2 → Vue3 按路由迁移

> 用法：把下面「提示词」整段复制到对话，替换 `<...>` 内容。**一次只迁一条路由**。

## 提示词

```text
把 <项目名（仓库名，如 oio-master-web）> 的 <路由 path / 模块名> 从 Vue2 迁到 Vue3。

约束：
1. 先完整读 skills/vue3-jurassic-migration/SKILL.md，按它的流程逐项走。
2. **禁止**把旧文件整段粘贴后只改语法；禁止顺手迁移其它路由或做无关重构。
3. 规则冲突时以迁移技能的「强制」项为准。
4. 迁移完成后，查使用方项目注册表确认该项目实际命令并运行。
5. 能用端到端用例覆盖的，跑该项目 E2E 用例（见使用方本地用例清单，
   约定见 skills/frontend/playwright-e2e/SKILL.md）。
6. 交卷按下面「交卷要求」回答。
```

## 交卷要求

- 迁移了哪些文件（逐个列出）
- 哪些 API / 行为语义发生了变化（props、事件、`visible` → `open`、插槽、`filters` 等）
- 实际跑了什么命令、结果如何
- **哪些行为无法验证**（缺环境、缺数据、缺权限码）——必须显式写出来
- 回滚方式（本次改动如何整体撤销）

## 相关

- 技能：`skills/vue3-jurassic-migration`（含 `pitfalls.md`）、`skills/jurassic-ui`
- 规则：`.trae/rules/frontend/lang/vue.md`（第一、二章）
- 命令：使用方项目注册表 ｜ 回归：该项目 E2E 用例清单（约定见 `skills/frontend/playwright-e2e`）
