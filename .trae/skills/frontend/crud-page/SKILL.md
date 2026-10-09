---
name: crud-page
description: >-
  Standard mid-admin CRUD page patterns for Vue 3 + jurassic-ui: filter + table
  + pagination, modal/drawer forms, detail views, empty/loading, debounce
  search, and permission-aware actions. Use when building list pages, 查询表单,
  分页表格, 新建编辑弹窗, 详情页, or implementing a design draft (Figma,
  screenshot, or MasterGo MCP structured data) as a typical 中后台 CRUD screen.
version: 1.0.0
status: stable
owner: "@jurassic-cooker-team"
updated: 2026-10-07
deprecated: false
---

# 中后台 CRUD 页面范式

列表 / 筛选 / 表格 / 分页 / 弹窗表单 / 详情。组件 API 以 [`../jurassic-ui/SKILL.md`](../jurassic-ui/SKILL.md) 为准；接口以 [`../api-request/SKILL.md`](../api-request/SKILL.md) 为准；按钮显隐见 [`../auth-router/SKILL.md`](../auth-router/SKILL.md)。

## 强制

- 组件 `jura-*`；表单控件 `v-model:value`；弹层 `v-model:open`（不要 `visible`）。
- **表格优先 `JuraTable`（`<jura-table>`）**；大数据量用 `jura-vxe-table`。**禁止用 `div` 手写表格**（含 flex/grid 模拟行列），除非有明确例外并说明理由。
- Table 自定义列只用 `#bodyCell`，且必须有 `v-else`。
- 弹窗表单：`:destroy-on-close="true"`（或父级 `v-if` 控制挂载），避免二次打开残留校验。
- 提交中按钮 `loading` / `:disabled`，防重复提交。
- 删除用 `JuraModalService.confirm` 或 `jura-popconfirm`，成功/失败用 `JuraMessage`。
- 文案优先 `$t('common.button.*')` / `common.form.*`；列表 `row-key` 必须唯一。
- 分页、筛选变化时重新请求；筛选「重置」回到默认查询。
- 先有加载态 / 空态，不要空白闪一下再出表。

## 推荐页面结构

```
src/views/<biz>/<page>/
  index.vue          列表（筛选 + 表 + 分页 + 打开弹窗）
  components/
    XxxFormModal.vue 新建/编辑弹窗（可选拆分）
  detail.vue         详情（可选）
```

单文件不超过「一屏逻辑 + 一屏模板」时可以不拆；筛选字段很多或弹窗有独立接口时再拆。

## 列表页骨架

```vue
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { JuraMessage, JuraModalService } from 'jurassic-ui'

const { t } = useI18n()
const loading = ref(false)
const dataSource = ref<Row[]>([])
const total = ref(0)
const query = reactive({ keyword: '', pageNo: 1, pageSize: 10 })

const columns = [
  { title: t('common.oio.name'), dataIndex: 'name', key: 'name' },
  { title: t('common.form.operation'), key: 'action', width: 180 },
]

const fetchList = async () => {
  loading.value = true
  try {
    const res = await fetchXxxList({ ...query })
    const list = res?.list
    dataSource.value = Array.isArray(list) ? list : []
    total.value = res?.total ?? 0
  } finally {
    loading.value = false
  }
}

const onSearch = () => {
  query.pageNo = 1
  fetchList()
}

const onPageChange = (page: number, pageSize: number) => {
  query.pageNo = page
  query.pageSize = pageSize
  fetchList()
}

onMounted(fetchList)
</script>

<template>
  <div class="page">
    <jura-form layout="inline" @submit.prevent="onSearch">
      <jura-form-item>
        <jura-input
          v-model:value="query.keyword"
          :placeholder="t('common.form.enter_keyword_search')"
          allow-clear
          @pressEnter="onSearch"
        />
      </jura-form-item>
      <jura-form-item>
        <jura-button type="primary" html-type="submit">{{ t('common.button.search') }}</jura-button>
        <jura-button @click="query.keyword = ''; onSearch()">{{ t('common.form.reset') }}</jura-button>
      </jura-form-item>
    </jura-form>

    <jura-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      row-key="id"
      :pagination="false"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.key === 'action'">
          <jura-space>
            <jura-button type="link" @click="openEdit(record)">{{ t('common.button.edit') }}</jura-button>
            <jura-button type="link" danger @click="onDelete(record)">{{ t('common.button.delete') }}</jura-button>
          </jura-space>
        </template>
        <template v-else>{{ text }}</template>
      </template>
    </jura-table>

    <jura-pagination
      :current="query.pageNo"
      :page-size="query.pageSize"
      :total="total"
      show-size-changer
      @change="onPageChange"
    />
  </div>
</template>
```

筛选输入可加 **300ms 防抖**（关键词）；下拉筛选可立即查。不要每次 `keyup` 打接口。

## 弹窗表单

```vue
<jura-modal
  v-model:open="open"
  :title="isEdit ? t('common.button.edit') : t('common.button.add')"
  :confirm-loading="submitting"
  destroy-on-close
  @ok="onOk"
>
  <jura-form ref="formRef" :model="form" :rules="rules" layout="vertical">
    <jura-form-item :label="t('common.oio.name')" name="name">
      <jura-input v-model:value="form.name" />
    </jura-form-item>
  </jura-form>
</jura-modal>
```

- `onOk`：`await formRef.validate()` → 调 API → `JuraMessage.success` → `open = false` → 刷新列表。
- **编辑回显**：先 `await` 下拉/树/字典，再赋 `form` 字段（见迁移 skill）。不要一打开就把 id 塞进 Select。
- `label-col` / `wrapper-col` 写在 **`jura-form-item`** 上。
- 抽屉同理：`jura-drawer` + `v-model:open`。

删除：

```ts
JuraModalService.confirm({
  title: t('common.form.tip'),
  content: t('common.button.delete'),
  onOk: async () => {
    await deleteXxx(record.id)
    JuraMessage.success(t('common.success.message'))
    fetchList()
  },
})
```

## 详情页

- 路由 `hidden: true`，从列表「查看」带 `id` query/params。
- 用 `jura-descriptions` 或只读表单；返回按钮 `router.back()` 或回列表路由。
- 无数据 / 加载失败用 `jura-result` 或 `jura-empty`，不要白屏。

## 权限按钮

没有权限码时不要画按钮（见 auth-router）。不要只 `disabled` 还暴露危险操作入口（删除仍建议直接不渲染）。

## 不要做的事

- 用 `#customRender` / `scopedSlots` 当列插槽。
- 用 `div` / flex / grid **手写表格**替代 `JuraTable` / `jura-vxe-table`（无书面例外理由时）。
- 表格不分页一次拉全量（除非接口与产品明确要求且数据量可控）。
- 弹窗用完不关 loading、校验失败仍关闭。
- 把整页状态塞进 Pinia（筛选、open、form 默认页面内）。
