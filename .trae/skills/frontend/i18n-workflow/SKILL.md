---
name: i18n-workflow
description: >-
  App i18n workflow for Jura Vue 3: vue-i18n keys, reuse jurassic-ui common.*,
  ConfigProvider locale sync, bilingual zh-CN/en-US, naming rules. Use when
  adding copy, 国际化, i18n, $t, locale, 中英文, or fixing hardcoded Chinese.
version: 1.0.0
status: stable
owner: "@jurassic-cooker-team"
updated: 2026-10-07
deprecated: false
---

# 应用多语言工作流

组件内置文案与 `common.*` 键表见 [`../jurassic-ui/i18n.md`](../jurassic-ui/i18n.md)。本技能管**业务项目**怎么加 key、怎么和 ConfigProvider 同步。

## 强制

- 能复用的用 `jurassic-ui` 已有键：`common.button.*`、`common.form.*`、`common.oio.*` 等，禁止再硬编码「查询」「重置」「操作成功」。
- 新业务文案必须同时写 **`src/locales/lang/zh-CN.ts` 与 `en-US.ts`**（路径以仓库为准）。
- Key 命名：`<page>.<context>.<field>`，例如 `userList.filter.keyword`、`menu.biz.users`。
- 模板：`{{ $t('key') }}` 或 `const { t } = useI18n()`；菜单 `meta.title` 存 key，不存中文。
- `JuraConfigProvider` 的 `:locale` 必须与当前语言一致：切到英文时用 `locale.en_US`（来自 `jurassic-ui`），不要只改 vue-i18n 而分页/日期仍中文。

## 加一条文案的步骤

1. 先搜 `common.*` / 现有页面 key，能复用则复用。
2. 不能复用：在 `zh-CN` 与 `en-US` 各加一条同名 key。
3. 页面用 `t('page.xxx')`；不要 `t('page.xxx', '中文兜底')` 当正式方案（登录页等历史兜底除外）。
4. 涉及 AntD 组件内置文案：确认 ConfigProvider 已喂合并包。

## 与 vue-i18n 的分工

| 内容 | 谁负责 |
| --- | --- |
| Pagination / DatePicker / Empty 等组件文案 | `JuraConfigProvider` + `locale.zh_CN` / `en_US` |
| 按钮「查询」、表格「操作」等公共词 | 优先 `t('common....')`（已合并进库或项目 locale） |
| 本页业务句 | 项目 `locales` 的 `<page>.*` |

不要只 `import zhCN from 'ant-design-vue/es/locale/zh_CN'`——缺业务键。

## 切换语言

```ts
// 伪代码：跟随项目现有 store / 设置页
locale.value = 'en-US'           // vue-i18n
antdLocale.value = juraLocale.en_US  // ConfigProvider
```

两处必须一起改。

## 不要做的事

- 只改中文文件，英文留空或复制中文。
- Key 用中文：`t('用户名称')`。
- 在组件库 `node_modules` 里改语言包。
- 同一句话多个不同 key（先搜再加）。
