---
alwaysApply: false
description: Skill Versioning & Deprecation——SKILL.md 必备 frontmatter（version/status/owner/updated/deprecated）、语义化版本、状态机、弃用流程、统一变更日志。本文件管 .trae/skills/ 资产生命周期，与 common/mind/* 的 AI 行为准则严格区分
---

# Skill Versioning & Deprecation：技能生命周期管理

> **本文件管 `.trae/skills/` 资产的版本、变更日志、废弃机制**；AI 行为准则（计划/验证/子代理派发）见 `common/mind/*`，本文件不涉及。
> 没有版本，技能生态会烂掉：改了入口没人知道、被替代的仍被触发、迁移无依据。

---

## 1. SKILL.md frontmatter 约定（强制）

每个 `SKILL.md` **必须**含以下字段（缺一即不合规）：

```yaml
---
name: crud-page            # 技能名（小写连字符，全仓唯一）
version: 2.1.0             # 语义化版本（见 §2）
status: stable             # stable | beta | deprecated | removed
description: "..."         # 触发描述（Trae 按此智能加载）
owner: "@frontend-team"    # 维护方 / 责任人
updated: 2026-10-07        # 最后更新日期
deprecated: false          # 弃用标记
# deprecated_since / deprecated_reason / replaced_by：仅在已弃用时填
---
```

> 缺 `version` 或 `status` → 视为"未治理技能"，索引时标 ⚠️。

---

## 2. 语义化版本规则

| 级别 | 含义 | 例子 |
|---|---|---|
| **major** | 不向后兼容：改入口 / 改核心模式 / 删章节 | 1.x → 2.x：组件结构变了 |
| **minor** | 向后兼容的新增：加章节 / 加反例 / 加选项 | 2.0 → 2.1：加"导出"章节 |
| **patch** | 修文：错别字 / 过期链接 / 表述不清 | 2.1.0 → 2.1.1：修错误示例 |

**必须升 major**：删原有章节（已上线 prompt 引用会断）｜改 frontmatter 字段名｜改"输入/输出契约"｜改入口名或位置（无重定向）。**不确定时按 major**。

**不写 changelog 段**——统一放 [`CHANGELOG.md`](../../CHANGELOG.md)；`updated` 合并 PR 时手动同步。

---

## 3. 状态机（status）

| 状态 | 含义 | 触发方式 |
|---|---|---|
| **stable** | 正式可用 | 默认 |
| **beta** | 试用、API 可能在 minor 改 | 标 `status: beta` + 写明试用范围 |
| **deprecated** | 已弃用、不再维护，但仍可加载 | 标 `deprecated: true` + 原因 + 替代 |
| **removed** | 已删除 | 删 `SKILL.md` + CHANGELOG 留"已删除"行 |

### 3.1 弃用流程（强制）

1. frontmatter 置 `deprecated: true` + `deprecated_since` + `deprecated_reason` + `replaced_by`
2. `SKILL.md` 顶部加醒目横幅（见 §4.1）
3. `CHANGELOG.md` 记一条 deprecation 公告
4. **保留至少 1 个 minor 版本周期**（让已上线 prompt 有时间迁移）
5. 期满 → 升 `status: removed` → 删 `SKILL.md` 与整个 `skills/<name>/`（**不留 .deprecated 文件**）

```yaml
status: deprecated
deprecated: true
deprecated_since: 2026-10-07
deprecated_reason: "已被 <replacement> 替代，老模式不再推荐"
replaced_by: <replacement>
```

---

## 4. 加载与索引行为

| status | AI 行为 |
|---|---|
| stable | 正常用 |
| beta | 用 + 提示"试用版，API 可能变" |
| deprecated | 优先用 `replaced_by`；坚持用旧技能需在 prompt 显式确认 |
| removed | 答"已删除，请用 X" |

### 4.1 SKILL.md 弃用横幅模板

```markdown
> ⚠️ **本技能已弃用**（since <日期>）
> **原因**：被 `<replacement>` 替代
> **仍能用**，但**新代码请用 `<replacement>`**；完整公告见 CHANGELOG 对应版本段
```

### 4.2 `.trae/SKILL.md` 索引必做

按状态分类列技能（稳定 / 试用 / 已弃用），每行 `- [name](真实路径) v<version> — 一句话`；引用必须**真实可达**，不用举例占位。

---

## 5. 反模式与自检

维护 / CI 时核对：frontmatter 完整｜`version` 符合 `^\d+\.\d+\.\d+`｜deprecated 自洽（有 since/reason）｜`replaced_by` 指向存在的技能｜`.trae/SKILL.md` 无漏列/多列｜`status: removed` 但文件还在。（脚本 `lint-skills.mjs` 待实现，现阶段人工。）

```diff
- 技能随意改、CHANGELOG 漏写；deprecated 标了但没填 since/replaced_by
- 删了技能但 prompt 还在引用；改入口不升 major；owner 写 "@TODO"
+ 任何变更 → CHANGELOG 留底；破坏性 → major + 迁移说明
+ 弃用 → 至少 1 个版本周期 + 指向替代；删除 → 留"已删除"行
```

---

## 6. 一句话总结

> **每个 SKILL.md 必带 version + status + owner + updated。**
> **破坏性 → major；新增 → minor；修文 → patch。**
> **弃用走"标 deprecated → 留 1 版本周期 → 删"；变更统一进 `.trae/CHANGELOG.md`。**
