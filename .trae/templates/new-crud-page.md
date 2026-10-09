# 黄金路径：新增 CRUD 页面

> 用法：把下面「提示词」整段复制到对话，替换 `<...>` 内容。

## 提示词

```text
按 Jurassic 中后台规范，在 <项目名（仓库名，如 oio-master-web），见使用方项目注册表> 新增一个 CRUD 页面：<业务名>。

范围：
- 列表 + 筛选 + 分页 + 新建/编辑弹窗 + 详情（不需要的删掉）
- 接口：<有 src/swagger 生成类型 / 无，手写 api>
- 文案：<是否需要中英双语>
- 权限：<菜单权限与按钮权限码；不知道就写"未知，先留占位>

要求：
1. 先读项目现状（目录结构、既有同类页面、api 组织方式），跟随现有约定，不要另起一套目录。
2. 按技能路由：project-conventions → crud-page → jurassic-ui；有 src/swagger 走 swagger-api，否则 api-request；
   涉及菜单/按钮权限走 auth-router；需要双语走 i18n-workflow。
3. 组件用 jura-*，表格用 JuraTable（大数据量用 jura-vxe-table），Modal/Drawer 用 v-model:open。
4. 改完先查使用方项目注册表确认该项目**实际存在**的命令，再验证。
5. 交卷时按下面「交卷要求」逐条回答。
```

## 交卷要求

- 改了哪些文件 / 新增了哪些路由
- 实际执行的命令与结果（该项目没有 typecheck/lint 时如实说明）
- 自测步骤：空列表、二次打开弹窗、分页与筛选、删除确认
- 未做项（接口未就绪、权限码未知、设计稿缺失）
- 阻塞点

## 相关

- 技能：`skills/project-conventions`、`skills/crud-page`、`skills/jurassic-ui`、`skills/api-request` / `skills/swagger-api`、`skills/auth-router`、`skills/i18n-workflow`
- 收尾：`skills/quality-review`
- 命令：使用方项目注册表（仓库名与可用命令的权威来源）
