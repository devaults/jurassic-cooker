# Vue2 → Vue3 迁移踩坑速查

配合 [SKILL.md](SKILL.md) 使用。出现下表症状时先查这里。

## TreeSelect / Tree：`field-names` 只认三项

底层 ant-design-vue 4：

```ts
interface FieldNames {
  value?: string
  label?: string
  children?: string
}
```

`title`、`key` 写入会被忽略，label 显示为 `--`。

```vue
<!-- ❌ -->
<jura-tree-select
  :field-names="{ children: 'children', title: 'name', key: 'id', value: 'name' }"
/>
<!-- ✅ -->
<jura-tree-select
  :field-names="{ children: 'children', label: 'name', value: 'id' }"
/>
```

| 症状 | 修复 |
| --- | --- |
| 选项 / 回显为 `--` | 删掉 `title`/`key`，用 `label` 指真实名称字段 |
| 能选中但回显 ID | 校正 `value`（`id` 或 `name`） |

## luckysheet

必须在 `main.ts` **最顶部**挂 jQuery + mousewheel：

```ts
import $ from 'jquery'
import 'jquery-mousewheel'
window.$ = window.jQuery = $
```

必须用**动态** `import()` 加载 luckysheet；静态 import 会被提升到 mousewheel 之前，报 `mousewheel is not a function`：

```js
let luckysheet = null
const loader = Promise.all([
  import('luckysheet'),
  import('luckysheet/dist/plugins/css/pluginsCss.css'),
  import('luckysheet/dist/plugins/plugins.css'),
  import('luckysheet/dist/css/luckysheet.css'),
  import('luckysheet/dist/assets/iconfont/iconfont.css'),
]).then(([m]) => {
  luckysheet = m.default || m
})
// 使用前 await loader
```

## 自定义 Table 表头空白

`@/mixin/dragtable.js` 依赖 `vue-draggable-resizable@next`。未安装时 `h('VueDraggableResizable', …)` 失败，表头 th 空白。

- 方案一：去掉表格 `:components="componentsMin"`。
- 方案二：`npm i vue-draggable-resizable@next` 并在 `main.ts` 全局注册。

JSX / `h`：项目若未配 vue-jsx，禁止在 `data()` 写 JSX。渲染函数参数形如 `(props, { slots }) => h('th', props, () => [...])`，事件驼峰 `onDragging`，组件名 PascalCase。

## 症状 → 根因 → 修复

| 症状 | 根因 | 修复 |
| --- | --- | --- |
| `Cannot read properties of null (reading 'map')` | 后端 `list` 为 null | `Array.isArray` 守卫 |
| `children is not iterable` | `#bodyCell` 缺 `v-else` | 加 `<template v-else>{{ text }}</template>` |
| `mousewheel is not a function` | luckysheet 静态 import 早于插件 | 动态 import；`main.ts` 顶部挂 `window.$` |
| `Failed to resolve import "xxx"` | 依赖缺失 | `npm install xxx --save` |
| 表头 th 全部空白 | 拖拽表头组件未注册 | 去掉 `:components` 或全局注册 |
| Select 显示 ID 而非 label | 用了 `<jura-option>` | 改 `<jura-select-option>` |
| 菜单仍显示 hidden 路由 | 未过滤 `hidden` | `menuItems` 过滤 `!r.hidden` |
| `require is not defined` | Vite 下用了 `require` | 顶部 `import` |
| 弹窗里 Select 回显 ID | 字段赋值早于选项加载 | `await` 选项 → `$nextTick` → 赋值 |
| Modal validate deprecated | callback 写法 | `await validate()` / `.then().catch()` |
| Modal 关不掉 / 状态乱 | 仍用 `visible` 或双状态 | 统一 `v-model:open`，父级可用 `v-if` |
| emit 无效 | 仍发 `update:visible` | 改为 `update:open` |

## change 事件参数速查

| 组件 | 参数 |
| --- | --- |
| Input / InputTextArea | `e.target.value` |
| InputNumber / InputPassword | 以实测为准（可能直接是 value） |
| Select 单选 | `(value, option)` |
| TreeSelect 单选 | `(value, node)` |
| TreeSelect 多选 | `value` 数组 |
| RadioGroup | `e.target.value` |
| DatePicker | dayjs 对象 |

不确定时：`(...args) => console.log(args)`。
