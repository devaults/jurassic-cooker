---
name: upload-export
description: >-
  Upload and export patterns for Jura Vue 3: jura-upload headers/token, blob
  download, Excel/luckysheet pitfalls. Use when 上传, 导出, Upload, download,
  excel, luckysheet, blob, or file import/export.
version: 1.0.0
status: stable
owner: "@jurassic-cooker-team"
updated: 2026-10-07
deprecated: false
---

# 上传与导出

组件标签见 [`../jurassic-ui/SKILL.md`](../jurassic-ui/SKILL.md)；luckysheet 深坑见 [`../vue3-jurassic-migration/pitfalls.md`](../vue3-jurassic-migration/pitfalls.md)。

## 上传（强制）

- 使用 `jura-upload` / `jura-upload-dragger`。
- `action` 用**完整可访问的上传地址**（含网关前缀），不要用丢 token 的裸相对路径硬猜。
- `:headers` 带鉴权（如 `Authorization`），与 `request.ts` 同一套 token 来源（含微前端 props）。
- 成功：`info.file.status === 'done'`；业务体在 `info.file.response`——不要假定一定有 `response.data`。
- 限制：`accept`、大小校验放在 `beforeUpload`；失败 `JuraMessage.error`。
- 列表回显：`fileList` 受控时注意 `v-model:file-list`（跟随 antd4 / 项目写法）。

```vue
<jura-upload
  :action="uploadUrl"
  :headers="uploadHeaders"
  :max-count="1"
  @change="onUploadChange"
>
  <jura-button>{{ t('common.button.upload') }}</jura-button>
</jura-upload>
```

## 导出 / 下载

- 优先走 `request` 拿 `blob`（`responseType: 'blob'`），再用项目已有 `$saveAsFile` / `utils` 存盘；没有则统一加到 `src/utils`，并在 `globalProperties` + 类型声明注册（见迁移 skill）。
- 文件名：优先响应头 `content-disposition`，否则业务约定名。
- 导出按钮加 `loading`，大文件给 Message「导出中」。
- 不要把文件内容拼成超长 data URL 塞进前端内存（大表用 blob）。

## Excel / luckysheet

- 依赖：`luckyexcel` / `exceljs` / `luckysheet` 等按需安装，跟随项目已有版本。
- luckysheet：`main.ts` 顶部挂 `jquery` + `jquery-mousewheel`；**动态 import** luckysheet，避免 `mousewheel is not a function`。
- 仅在真正需要在线表格编辑时引入；普通「下载 Excel」用后端导出或 exceljs 即可。

## 不要做的事

- 上传不带 headers 导致 401，再在页面兜底重登循环。
- 把服务端返回的临时秘钥写进仓库。
- 导出失败仍提示成功。
- 静态 `import('luckysheet')` 且未挂 mousewheel。
