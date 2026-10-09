# <功能名> · UI 规范（阶段二）

> **阶段二产物**（仅视觉与交互）·
> 主导角色：[`ui-role.md`](${rel.cooker}/.trae/steering/ui-role.md) ·
> 对应提示词：[`02-ui.md`](${rel.cooker}/.trae/prompts/stages/02-ui.md)
>
> **本模板只写视觉与交互**。接口契约走 [`./design-contract.md`](./design-contract.md)；技术方案走 [`./tech-solution-backend.md`](./tech-solution-backend.md) 与 [`./tech-solution-frontend.md`](./tech-solution-frontend.md)。

## 0. 元信息

| 项 | 值 |
|---|---|
| 上游需求 | `requirements.md` v`<x>`（**必须已签字**） |
| 技术栈 | `<Vue 3 + Vite + TS + jurassic-ui 2.x / Vue 2 存量 / …>` |
| 响应式要求 | `<仅 PC / PC+Pad / …>` |
| 状态 | `草稿 / 已签字` |
| 版本 | `v0.1` |
| 上游变更记录 | `<前端开发中若升 v2，写"v2 由 @UI 于 YYYY-MM-DD 升，理由：…，已通知 @后端 @架构师确认是否动契约">`（不升级留空） |

---

## 1. 信息架构（IA 树）

```
<页面> / <模块> / <操作>
```

## 2. 关键页面 wireframe

> 每个核心路径至少一张，用文字描述（便于 AI 转代码）；每张标注 loading / empty / error 三种状态。

### 2.1 <页面名>

- 布局：
- loading：
- empty：
- error：

## 3. 交互流程

### 3.1 核心路径

1.

### 3.2 异常路径（至少 2 个）

| # | 场景 | 期望交互 |
|---|---|---|
| 1 |  |  |
| 2 |  |  |

## 4. 组件清单

> 必须明确到具体组件名（写 `JuraTable`，不写「表格组件」）；写前先读 `jurassic-ui` 源码确认存在。

| 区域 | 组件 | 说明 |
|---|---|---|
|  |  |  |

## 5. 视觉规范

> 一律用 juraTheme token，不写魔法值。

| 项 | token |
|---|---|
| 间距 | `spacing.xs/sm/md/lg/xl` |
| 字号 | `fontSize.sm/md/lg/xl` |
| 颜色 | `text.primary / text.secondary / brand.primary` |

## 6. 响应式断点

| 断点 | 范围 |
|---|---|
| 桌面 | ≥ 1200px |
| 平板 | 768–1199px |
| 手机 | < 768px（如需） |

## 7. 文案与 i18n key

| key | 中文 | 英文 |
|---|---|---|
|  |  |  |

## 8. 走查 checklist

- **视觉**：间距 / 字号 / 颜色一致性
- **交互**：hover / focus / disabled / loading 反馈
- **可访问性**：键盘可达 / 对比度 / aria-label
- **边界**：空 / 极值 / 错误 / 并发

## 9. 给接口架构师 / 前端的接口能力清单

> 不写 API 路径（那是 [`./design-contract.md`](./design-contract.md) 的事）。
> 用业务语言列出本 UI 需要哪些后端能力。

| 业务能力 | 用途 | UI 关键交互点 |
|---|---|---|
| `<如：按筛选条件分页查询资产>` |  |  |
| `<如：按选中字段批量导出 Excel>` |  |  |
| `<如：保存为模板>` |  |  |

---

## 签字与版本

```markdown
UI Spec v0.1 ✅ 已签字 @UI名 YYYY-MM-DD
- 范围：
- 不做：
- 风险：
```

---

## 下游衔接

- **若涉及后端**：把本 UI Spec + §9 接口能力清单 交给接口架构师走 [`./design-contract.md`](./design-contract.md)（阶段 3）
- **若仅前端**：本 UI Spec 直接进 [`./tech-solution-frontend.md`](./tech-solution-frontend.md)（阶段 5），前端从后端拿 API 文档后开工