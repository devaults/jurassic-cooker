---
name: quality-review
description: >-
  Definition of done and review checklist for Jura Vue 3 mid-admin work:
  functional edge cases, jura- conventions, i18n, types, security, performance,
  and PR notes. Use when finishing a task, 自测, code review, PR, type-check,
  or the user asks if the change is ready to merge.
version: 1.0.0
status: stable
owner: "@jurassic-cooker-team"
updated: 2026-10-07
deprecated: false
---

# 质量与交卷

任务「能点一下」不等于做完。实现阶段读对应领域 skill；**提交或声称完成前读本清单**。组件细节见 [`../jurassic-ui/SKILL.md`](../jurassic-ui/SKILL.md)。

## 何时使用

- 用户说做完了、帮看下、提 PR、review、自测。
- 任何改了 `src/views` / `api` / `router` 的任务收尾。

## 功能（按页面类型勾）

列表：

- [ ] 空列表、接口失败、loading 有反馈
- [ ] 筛选 + 重置 + 分页（改页码/页大小会请求）
- [ ] `row-key` 唯一；刷新后数据是新引用不是错乱行

弹窗 / 表单：

- [ ] 打开 / 关闭 / 再次打开：无残留校验与旧值
- [ ] 校验失败不关闭、不误提交；提交中防重复
- [ ] 编辑：选项加载后再回显，Select/TreeSelect 不是 ID/`--`

其它：

- [ ] 删除有确认；成功失败有 Message
- [ ] 若项目用 `src/swagger`：后端接口变更后已执行 `npm run generate-swagger-types`（或 PR 说明类型已同步）
- [ ] 无权限按钮不出现（若本需求含权限）
- [ ] 路由能进、菜单（非 hidden）能看见；详情 hidden 不在侧栏

## 规范

- [ ] 标签 `jura-*`，无新增 `el-` / `j-` / `a-button`
- [ ] Modal/Drawer：`v-model:open`；Table：`#bodyCell` + `v-else`
- [ ] `<script setup lang="ts">`（新文件）；无新 Vuex；无 `require()`
- [ ] 请求走 `api` + `request.ts`，URL 不写在模板里
- [ ] 公共文案 `common.*`；新业务 key 中英都有
- [ ] 无无关 `console.log`；无把 token 打到日志

## 类型与命令

- [ ] 项目若有 `npm run type-check` / `vue-tsc`：**必须跑过**（0 新增错误；旧错误不在本次文件上扩大）
- [ ] 有 lint 则跟项目脚本走，不引入新的 any 消错
- [ ] 若需求含 Sonar / 质量门禁：已按 [`../sonar/SKILL.md`](../sonar/SKILL.md) 处理相关 OPEN issue（或说明需全量扫描才关闭）

## 安全与边界

- [ ] 无新增 `v-html` 渲染接口字符串（必须时说明已消毒）
- [ ] 上传 `action` 带鉴权头；不要把密钥写进前端
- [ ] 改动范围仅限需求；不顺手重构无关目录

## 性能（中后台够用即可）

- [ ] 列表有分页或明确的小数据量
- [ ] 无在 `watch` 里改同一依赖造成死循环
- [ ] 无在模板里对大数组每次 render 都 `deep clone`

## 迁移任务额外

走 [`../vue3-jurassic-migration/SKILL.md`](../vue3-jurassic-migration/SKILL.md) 的提交清单；一次一路由。

## 回复用户时

简要写清：

1. 改了哪些文件 / 路由  
2. 怎么自测（空列表、二次打开弹窗、分页）  
3. 未做项（接口未就绪、权限码未知、设计稿未给暗色）  
4. 阻塞（缺环境、缺权限码、后端字段不明）

不要只说「已完成」不写验证步骤。
