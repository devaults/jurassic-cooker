---
name: error-feedback
description: >-
  User feedback patterns for Jura mid-admin: JuraMessage vs Notification vs
  Modal, empty/loading/Result pages, when not to double-toast. Use when adding
  报错提示, 空状态, Result, Message, Notification, or fixing noisy toasts.
version: 1.0.0
status: stable
owner: "@jurassic-cooker-team"
updated: 2026-10-07
deprecated: false
---

# 错误与反馈

接口错误码分工见 [`../api-request/SKILL.md`](../api-request/SKILL.md)；列表空态见 [`../crud-page/SKILL.md`](../crud-page/SKILL.md)。

## 强制

- 成功 / 轻量失败：用 `JuraMessage`（`success` / `error` / `warning`）。
- 需要用户停下来读的长说明或重要失败：`JuraNotification` 或 `JuraModalService`。
- 删除 / 不可逆操作：先 `confirm`，再请求，再 Message。
- 拦截器已统一 toast 的错误，**页面 catch 里不要再弹一次**（除非要展示字段级校验文案）。
- 列表无数据：`dataSource = []` + Table 空态，或 `jura-empty`；整页致命失败用 `jura-result`。
- 文案优先 `common.success.message` / `common.failure.message` / `common.error.*`。

## 怎么选

| 场景 | 组件 |
| --- | --- |
| 保存成功、删除成功 | `JuraMessage.success` |
| 校验失败、短错误 | `JuraMessage.error` / 表单项 `help` |
| 后台任务结果、可带详情 | `JuraNotification` |
| 删除确认 | `JuraModalService.confirm` / `jura-popconfirm` |
| 无权限整页 | `jura-result` status 403 或项目 403 页 |
| 接口 500 整页不可用 | `jura-result` + 重试按钮 |
| 表格查询无行 | Table 默认空 / `jura-empty`，不要用 Result 抢整页 |

需要主题与 locale 上下文的复杂页：外包 `jura-app`，用 `JuraApp.useApp()`；简单页可直接静态 `JuraMessage`。

## Loading

- 按钮 / 表格：局部 `loading`，不要动不动全屏 Spin。
- `try/finally` 必须关 loading，避免失败后按钮转不停。

## 不要做的事

- `alert()` / `console.error` 当作用户提示。
- 同一失败连环三条 Message。
- 用 Notification 刷屏刷每个表单校验字段。
- 空列表还显示上一页的旧错误 Result。
