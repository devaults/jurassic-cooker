---
name: vue3-jurassic-migration
description: >-
  Vue 2 to Vue 3 migration rules for Jura apps using jurassic-ui@2 (Ant Design
  Vue 4): jura- prefix, v-model:open, Table #bodyCell, field-names, Pinia,
  vue-i18n, script setup, and per-route upgrades. Use when upgrading Vue2 to
  Vue3, migrating old-web pages, rewriting ElementUI/j-/ant- components to
  jura-, fixing antd4 Modal/Table/TreeSelect, or changing src/views in
  oio-template-web / cloud-data-master-web style projects.
version: 1.0.0
status: stable
owner: "@jurassic-cooker-team"
updated: 2026-10-07
deprecated: false
---

# Vue2 → Vue3 + jurassic-ui@2 迁移规则

本技能指导**把 Vue2 页面迁到已就绪的 Vue3 工程**，并强制使用 `jura-` 组件约定。新页面从零开发请优先读 [`../jurassic-ui/SKILL.md`](../jurassic-ui/SKILL.md)；主题 / 语言包细节见同目录 `theme.md`、`i18n.md`。

## 何时使用

- 用户提到：Vue2 升 Vue3、迁移、`old-web`、ElementUI、`j-` 前缀、antd1、`visible.sync`、scopedSlots。
- 任务改动 `src/views/**`、表单 / 表格 / 弹窗 / 树、API、Pinia、路由菜单。
- 迁移过程中出现 `#bodyCell`、TreeSelect 显示 `--`、Select 只显示 value 等症状（见 [pitfalls.md](pitfalls.md)）。

## 强制原则

1. **按路由逐个升级**：一次只改一个路由（含子页），验证通过再开下一个；禁止批量改多页。
2. **落地只写 `src/`**：参考 `old-web/` 的业务逻辑，禁止整段粘贴 Vue2 模板 / Options 旧语法。
3. **组件前缀只有 `jura-`**：`el-` / `j-` / `ant-` / `a-` 一律替换（除非项目明确要求保留 antd 原生标签）。
4. **图标**（三选一，勿混用旧 Vue2 写法）：
   - Ant Design：`@ant-design/icons-vue`（如 `<DownloadOutlined />`），按钮内放插槽。
   - 公司 iconfont：`<jura-icon :type="font_class" :is-iconfont="true" />`，入口须 `import 'jurassic-ui/es/fontIcons/iconfont.css'`。
   - 内置 SVG：`<jura-svg-icon icon-class="jurassic" />`。
   - 禁止无 `is-iconfont` 的裸 `type` 字符串当图标（Vue2 旧 `jura-icon` 写法）。
5. **样式**：入口须 `import 'jurassic-ui/dist/style.css'`（2.0.5+，含 ColorPicker 等自研组件样式）。
6. **优先 `<script setup lang="ts">` + Composition API**；存量 Options API 页面可渐进改写，但新增逻辑不要再加 `this.$xxx` 体系。
7. **表格优先 `JuraTable`，大数据量用 `jura-vxe-table`**；禁止用 `div` 手写表格（除非有明确例外并说明理由）。

典型项目背景（路径可按仓库调整）：`oio-template-web`（`cloud-data-master-web`），oio3.0 微前端子应用；旧码在 `old-web/`。

---

## 推荐迁移工作流（每个路由）

1. 在路由表确认目标 path / name / `meta.title`，对照 `old-web` 同名页面行为。
2. 列出该页用到的组件：Form / Table / Modal / Tree / Upload / 自定义子组件。
3. 新建或改写 `src/views/<biz>/<page>/index.vue`（及 `detail.vue` 等），按下方对照表改 API。
4. API 落到 `src/api/...`，状态用 Pinia，文案复用 `common.*`（见 §4）。
5. 跑通：打开 / 关闭弹窗、列表查询分页、表单提交校验、树选择回显。
6. `npm run type-check` + 本 skill §7 清单 + [`../quality-review/SKILL.md`](../quality-review/SKILL.md) 全过后再开下一路由。

---

## 1. 组件库与组件 API

### 1.1 前缀

| 旧（Vue2） | 新（Vue3） |
| --- | --- |
| `<el-xxx>` ElementUI | `<jura-xxx>` |
| `<j-xxx>` jurassic-ui@0.x | `<jura-xxx>` |
| `<ant-xxx>` / 部分 `a-xxx` antd1 | `<jura-xxx>` |

`j-` 在 Vue3 + antd4 下无法解析。

### 1.2 Modal / Drawer：`visible` → `open`

```vue
<!-- ❌ -->
<jura-modal :visible="vis" @update:visible="vis = $event" />
<!-- ✅ -->
<jura-modal v-model:open="vis" />
<jura-drawer v-model:open="vis" />
```

`.sync` / `:visible.sync` 一律改为 `v-model:open`。向父组件同步时 emit **`update:open`**，不要再 emit `update:visible`。

### 1.3 Table：统一 `#bodyCell`

```vue
<!-- ❌ scopedSlots + 具名 slot -->
columns: [{ dataIndex: 'x', scopedSlots: { customRender: 'x' } }]
<template #x="{ text, record }">...</template>

<!-- ✅ -->
<template #bodyCell="{ column, text, record }">
  <template v-if="column.dataIndex === 'x'">...</template>
  <template v-else-if="column.key === 'action'">...</template>
  <template v-else>{{ text }}</template>
</template>
```

必须有 `v-else`，否则 antd4 报 `children is not iterable`。

### 1.4 具名 slot

```vue
<!-- ❌ --><ExclamationCircleOutlined slot="icon" />
<!-- ✅ --><template #icon><ExclamationCircleOutlined /></template>
```

禁止 `slot="x"` / `slot-scope`。

### 1.5 Tree / TreeSelect：`replaceFields` → `field-names`

```vue
<!-- ❌ -->
<jura-tree :tree-data="data" :replaceFields="{ children: 'list', title: 'name', key: 'id' }" />
<!-- ✅ Tree / TreeSelect 的 field-names 只认 value | label | children -->
<jura-tree :tree-data="data" :field-names="{ children: 'list', label: 'name', value: 'id' }" />
<jura-tree-select :field-names="{ children: 'children', label: 'name', value: 'id' }" />
```

写入 `title` / `key` 会被**静默忽略**，选项显示为 `--`。详见 [pitfalls.md](pitfalls.md)。

### 1.6 命名与其它强制点

| 旧 | 新 |
| --- | --- |
| `<jura-textarea />` | `<jura-input-text-area />` |
| `<jura-option>` | `<jura-select-option>`（错用会只显示 value） |
| 按钮 `icon="download"` | 插槽内放 `<DownloadOutlined />` 或 `<jura-icon type="download-outlined" :is-iconfont="true" />`（需 iconfont.css） |
| `v-model` 裸写 | 表单控件统一 `v-model:value` |
| `form.validate(cb)` | `await formRef.value.validate()`（Promise） |
| `() => import('./x.vue')` 作 components | `defineAsyncComponent(() => import('./x.vue'))`，路径带 `.vue` |

- `jura-form` 已合并原 `jura-form-model`；`label-col` / `wrapper-col` **写在 `jura-form-item` 上**，不能只指望 Form 透传。
- RadioGroup：`v-model` 值类型须与每个 `Radio` 的 `:value` 一致。
- Upload：`action` 用完整 URL；`:headers` 带 token；成功看 `info.file.status === 'done'` 与 `info.file.response`。
- 项目未配 vue-jsx：禁止在 `data()` 里写 JSX；`h` 从 `vue` 导入。表头拖拽等见 [pitfalls.md](pitfalls.md)。

---

## 2. Composition API 与数据绑定

### 2.1 推荐骨架

```vue
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { DownloadOutlined } from '@ant-design/icons-vue'
import { JuraMessage } from 'jurassic-ui'

const { t } = useI18n()
const open = ref(false)
const formRef = ref()
const form = reactive({ name: '', status: 1 })

const loadOptions = async () => { /* 下拉/树/字典 */ }
const submit = async () => {
  await formRef.value.validate()
  JuraMessage.success(t('common.success.message'))
}

onMounted(async () => {
  await loadOptions()
  // 选项就绪后再给表单字段赋值，避免回显成 ID
})
</script>
```

从 Options API 迁过来时：`data` → `ref`/`reactive`；`computed`/`watch`/`methods` 同名 API；`created`/`mounted` → `onBeforeMount`/`onMounted`；`beforeDestroy` → `onBeforeUnmount`；`this.$refs.x` → `xRef.value`；`this.$router` → `useRouter()`。

### 2.2 表单回显顺序（强制）

先 `await` 加载全部选项，再赋值表单字段。否则 Select/TreeSelect 显示 ID 或空白。

备选：手动 `:value` + `@change`（注意事件参数差异，见下表）。

### 2.3 Modal 显隐

- 推荐父级 `v-if="open"` 控制子组件挂载，每次打开重跑初始化。
- 不要同时维护内外两套 visible/open。

### 2.4 数组与事件参数

- 后端 `list` 可能为 null：先 `Array.isArray` 再 `.map`。
- change 参数：Input → `e.target.value`；Select → `(value, option)`；TreeSelect 单选 → `(value, node)`；RadioGroup → `e.target.value`；DatePicker → dayjs。不确定时先打日志。

---

## 3. 状态 / 路由（典型约定）

- **Pinia**（`src/stores/*`），禁止新增 Vuex。常见：`useUserStore`、`useAppStore`。
- 路由：`src/router/index.ts` 的 `asyncRoutes` 与布局里菜单（如 `BasicLayout.vue` 的 `menuItems`）**同步维护**。
- 菜单过滤：`!r.hidden`；`meta.title` 用 i18n key。
- 微前端含 `/jc/` 时 base / 展平 children 以项目 `vite.config` 与现有 `formatToRoot` 为准；token 优先 wujie/qiankun props，否则 Pinia。

具体目录以当前仓库为准；上列为 oio 模板常见布局。

---

## 4. 国际化

- 应用 locale 已合并 `jurassic-ui` 的 `zh_CN` / `en_US`（见 jurassic-ui 的 i18n 技能）。
- **公共词**复用：`common.button.*`、`common.form.*`、`common.oio.*` 等，禁止再硬编码「查询」「重置」。
- 业务 key：`src/locales/lang/zh-CN.ts` 与 `en-US.ts`，命名 `<page>.<context>.<field>`。
- 模板 `$t('key')` 或 `const { t } = useI18n()`。

---

## 5. 构建与依赖

- 静态资源：顶部 `import img from '@/assets/...'`，禁止 `require()`。
- Jurassic UI 2.0.5+：入口增加 `import 'jurassic-ui/dist/style.css'`（与 `reset.css` 并存）。
- 使用公司 iconfont 时：`import 'jurassic-ui/es/fontIcons/iconfont.css'`。
- `Failed to resolve import`：先确认引用再 `npm install`。
- 全局方法挂 `app.config.globalProperties`，并在 `shims-vue.d.ts` 声明。
- luckysheet / 表头拖拽等专项见 [pitfalls.md](pitfalls.md)。

---

## 6. 架构约定（典型）

- API：`src/api/{domain}/...`，`request({ url, method, params/data })`。
- 视图：`src/views/<business>/<page>/index.vue`；复用组件放 `src/views/components/`。
- HTTP：统一 `src/utils/request.ts`（token、CLIENT、401）。

---

## 7. 提交前自检清单

- [ ] 前缀全是 `jura-`，无 `j-` / `el-` / `ant-` 残留
- [ ] Modal/Drawer 为 `v-model:open`，无 `visible` / `.sync`
- [ ] Table 自定义列在 `#bodyCell` 且有 `v-else`
- [ ] 具名 slot 为 `#xxx`，无 `slot` / `slot-scope`
- [ ] Tree/TreeSelect 用 `field-names`，且无无效的 `title`/`key`
- [ ] 文案优先 `common.*`，无新增硬编码中文（业务 key 已双语）
- [ ] 表单：选项 await 完成后再赋值
- [ ] 无 `require()`；异步组件用 `defineAsyncComponent`
- [ ] 改动范围仅当前路由
- [ ] 反馈用 `JuraMessage` / `JuraNotification`
- [ ] `npm run type-check` 通过

---

## 相关文件

- 组件库约定：[../jurassic-ui/SKILL.md](../jurassic-ui/SKILL.md)
- 迁移踩坑速查：[pitfalls.md](pitfalls.md)
