# 组件 API（Jurassic Biz 2.x）

本文件包含所有组件的完整 Props、Events、Slots、Methods、边界处理与示例代码。组件识别决策树见 [SKILL.md](SKILL.md)。

---

## §1 JuraBoSelect — BO 业务对象选择器

**标签**：`<jura-bo-select>`

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `bot` | String | `''` | 否 | BO 类型过滤条件 |
| `boId` | String \| Array | — | 否 | v-model:boId 绑定值；单选 String，多选 Array |
| `multiple` | Boolean | `false` | 否 | 是否多选 |
| `multiCharOverflow` | Number | `5` | 否 | 多选标签溢出字符数 |
| `pageSize` | Number | `500` | 否 | 远程查询每页条数 |

### Events

| 名称 | 参数 | 说明 |
|---|---|---|
| `update:boId` | `value` | v-model 同步 |
| `getBoSelect` | `{ value, rows }` | 选择变化，rows 为完整行数据 |

### 边界处理
- 远程查询用 try/catch，异常仅 console.log 不抛出
- 仅 `res.code === 0` 时更新选项列表
- 多选时自动去重，rows 与 value 严格对齐

### 示例
```html
<!-- 单选 -->
<jura-bo-select :bot="bot" v-model:boId="boId" @getBoSelect="getBoSelect" />
<!-- 多选 -->
<jura-bo-select :bot="bot" v-model:boId="boIdList" @getBoSelect="getBoListSelect" multiple />
```

---

## §2 JuraPtSelect — 数据集选择器

**标签**：`<jura-pt-select>`

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `ptList` | Array | `[]` | 否 | v-model:ptList 已选列表 |
| `pageSize` | Number | `100` | 否 | 每页条数 |
| `multiple` | Boolean | `false` | 否 | 多选 |
| `moduleType` | String | `''` | 否 | 模块类型（4=结构化,1=文档,2=图件,3=体数据,11=音视频,20=图片） |
| `fileFormats` | Array | `[]` | 否 | 文件格式 id 列表 |

### Events

| 名称 | 参数 | 说明 |
|---|---|---|
| `update:ptList` | `Array` | v-model 同步 |
| `getSelectValue` | `Array` | 确认选择时回传选中行数组 |

### Slots
| 名称 | 说明 |
|---|---|
| `dataType` | 表格列作用域插槽，`{ row }` |

### 边界处理
- 空选校验：未选时 ElMessage.warning 并 return
- 多选用 Map 按 ptCode 去重
- 取消时重置表单并还原表格选中状态
- moduleType 传入后禁用对应筛选项

### 示例
```html
<jura-pt-select multiple :ptList.sync="ptList" @getSelectValue="getSelectValue" />
<jura-pt-select moduleType="4" :ptList.sync="ptList1" @getSelectValue="getSelectValue" />
<jura-pt-select :fileFormats="['LasType','docx','xlsx']" :ptList.sync="ptList1" @getSelectValue="getSelectValue" />
```

---

## §3 JuraBigDataSelect — 大数据下拉选择器

**标签**：`<jura-big-data-select>`

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `modelValue` | String \| Number \| Object | `''` | 否 | v-model 绑定值 |
| `selectOptions` | Object | `{}` | 否 | 透传 jura-vxe-select 配置（含 onChange 会被提取） |
| `options` | Array | `[]` | 否 | 选项数据，优先级高于 selectOptions.options |
| `loading` | Boolean | `false` | 否 | 加载状态，优先级高于 selectOptions.loading |

### Events
| 名称 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `value` | v-model 同步 |
| `change` | `value` | 选择变化 |

### 边界处理
- selectOptions 中的 onChange 会被提取单独处理，不与 change 事件冲突
- options/loading 有三级回退：props > selectOptions > 默认值
- 默认配置 `clearable: true, filterable: true`

### 示例
```html
<jura-big-data-select v-model="selectedValue" :select-options="selectOptions" :options="options" />
```

---

## §4 JuraBigDataList — 大数据虚拟列表

**标签**：`<jura-big-data-list>`

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `items` | Array | `[]` | 否 | 列表数据 |
| `columns` | Array | `[]` | 否 | 列配置（无 default 插槽时用 prop 渲染） |
| `itemSize` | Number \| Function | `40` | 否 | 项高度 |
| `keyField` | String | `'id'` | 否 | 唯一标识字段 |
| `bigDataConfig` | Object | `{ pageSize:100, infiniteLoad:true }` | 否 | 大数据加载配置 |
| `loading` | Boolean | `false` | 否 | 外部加载状态，控制空状态与无限加载防抖 |

### Events
| 名称 | 参数 | 说明 |
|---|---|---|
| `rowClick` | `{ item, index }` | 列表项点击 |
| `loadMore` | `{ currentPage, pageSize }` | 无限加载 |
| `end` | — | 滚动到底部 |
| `scroll`/`change`/`resize`/`visible`/`start` | — | RecycleScroller 事件透传 |

### Slots
| 名称 | 参数 | 说明 |
|---|---|---|
| `default` | `{ item, index }` | 自定义项渲染 |
| `empty` | — | 空状态 |
| `append` | — | 加载更多指示器 |

### 边界处理
- `items.length === 0 && !loading` 才显示 empty
- 无限加载双重判断：`infiniteLoad && !loading`
- items 变化时重置 currentPage=1

### 示例
```html
<jura-big-data-list :items="items" :item-size="80" @row-click="handleRowClick">
  <template #default="{ item, index }">
    <div>{{ index }} - {{ item.name }}</div>
  </template>
</jura-big-data-list>
```

---

## §5 JuraBigDataTree — 大数据虚拟树

**标签**：`<jura-big-data-tree>`

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `treeOptions` | Object | `{}` | 否 | 透传 jura-vxe-tree 全部配置 |

内部默认：`{ transform: true, height: 400, virtualYConfig: { enabled: true, gt: 0 }, data: [] }`

### Methods（通过 ref）
| 名称 | 参数 | 说明 |
|---|---|---|
| `getTreeRef` | — | 返回底层 jura-vxe-tree 实例 |
| `scrollToNodeId` | `nodeId` | 滚动到指定节点 |

### 边界处理
- 默认开启 Y 轴虚拟滚动（gt=0 任何节点数都启用）
- scrollToNodeId 内部判断 treeRef 存在才调用

### 示例
```html
<jura-big-data-tree ref="treeRef" :tree-options="{ data: treeData, showCheckbox: true, titleField: 'name' }" />
```
```js
treeRef.value.scrollToNodeId('527');
treeRef.value.getTreeRef().setAllExpandNode(true);
```

---

## §6 JuraFileUpload — 文件上传

**标签**：`<JuraFileUpload>`（入口）、`<JuraUploadArea>`（上传区）、`<JuraFileListArea>`（文件列表）

### JuraFileUpload Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `maxThresholdSize` | Number | `50MB` | 否 | 分片阈值（大于此值走分片） |
| `maxSize` | Number | `10GB` | 否 | 单文件最大尺寸 |
| `partSize` | Number | `10MB` | 否 | 分片大小 |
| `multiple` | Boolean | `false` | 否 | 多文件 |
| `allowedFormats` | String | `''` | 否 | 允许格式（透传 input accept） |
| `maxFileCount` | Number | `0` | 否 | 最大文件数（0=不限） |
| `blockedExtensions` | String | `''` | 否 | 屏蔽扩展名 |
| `category` | String | `''` | 否 | 上传桶名 |
| `storageUrl` | String | `''` | 否 | 上传目录 |

### Events
| 名称 | 参数 | 说明 |
|---|---|---|
| `uploadSuccess` | `data` | 上传成功 |
| `uploadError` | `data` | 上传失败 |
| `removeFile` | `{ id }` | 文件移除 |

### Slots
| 名称 | 说明 |
|---|---|
| `title` | 顶部标题 |

### Methods（ref）
| 名称 | 说明 |
|---|---|
| `clearAllCache()` | 清空上传缓存 |

### 边界处理
- 文件列表懒显示：IndexedDB 初始化完成后才渲染
- 最大并发数 3，超过的 pending/paused 置为 waiting
- 文件去重：优先 fileMd5:size，其次 id，最后 name:size
- 状态机：pending→uploading→completed/error/paused/waiting/cancel/calculating
- **注意**：JuraUploadArea 的 maxSize 默认 5GB，与父组件 10GB 不一致，需父组件透传覆盖

### 示例
```html
<JuraFileUpload @uploadSuccess="uploadSuccess" @uploadError="uploadError" />
<!-- 批量 -->
<jura-drawer :visible="visible">
  <JuraFileListArea :uploadFileList="uploadFileList" multiple @uploadSuccess="uploadSuccess" @removeFile="removeFile" />
</jura-drawer>
```

---

## §7 JuraFileDownload — 文件下载

**标签**：`<JuraFileDownload>`

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `fileId` | String | `''` | 是 | 文件 ID |
| `partSize` | Number | `10MB` | 否 | 分片大小 |

### Events
| 名称 | 说明 |
|---|---|
| `downloadSuccess` | 下载完成 |
| `downloadError` | 下载失败 |

### 边界处理
- 状态机：not_started→downloading→paused/completed/error
- 错误时 JuraMessage.warn + cancelDownload + 显示重试按钮
- onBeforeUnmount 清理 timer 并 cancelDownload
- **注意**：fileId 的 `require: true` 拼写错误（应为 required），实际未生效

### 示例
```html
<JuraFileDownload :key="fileId" :fileId="fileId" @downloadSuccess="downloadSuccess" @downloadError="downloadError" />
```

---

## §8 JuraFilePriview — 文件预览

**标签**：`<jura-file-priview>`

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `fileId` | String | `''` | 否 | 文件 ID |
| `fileName` | String | `''` | 否 | 文件名 |
| `fileType` | String | `''` | 否 | 扩展名（决定预览组件） |
| `dataId` | String | `''` | 否 | 资源数据 ID |
| `fileSource` | String | `''` | 否 | 文件来源（'abnormal' 切换 URL） |
| `useFileViewer` | Boolean | `false` | 否 | 启用 file-viewer 纯前端预览 |
| `showFileViewerSwitch` | Boolean | `false` | 否 | 显示 file-viewer 开关 |
| `showDownload` | Boolean | `true` | 否 | 显示下载按钮 |
| `showFileName` | Boolean | `true` | 否 | 显示文件名 |
| `customConfig` | Object | `{}` | 否 | 透传子组件配置 |
| `expandComponentStrategy` | Object | `{}` | 否 | 扩展策略（覆盖默认） |
| `needThumbnail` | Boolean | `false` | 否 | 需要缩略图 |
| `bo` | String | `''` | 否 | 业务对象标识 |
| `isMobile` | Boolean | `false` | 否 | 移动端 |

### Events
| 名称 | 参数 | 说明 |
|---|---|---|
| `postData` | `{ type, data }` | 提交数据 |
| `zoom` | `data` | 缩放 |
| `previewFileFunc` | `fileInfo` | 预览文件回调 |

### 组件策略映射
- img/png/jpg/jpeg/gif → imgview
- json → structable
- txt/html → textview
- doc/docx/xls/xlsx/ppt/pptx/pdf/md → jkfileview（或 fileViewer）
- baike → baikeView
- h5 → h5View
- multiplefile → multipleFileList
- 未知 → notSupported

### 宿主环境变量
组件从 `window.globalConfig` 读取以下变量，宿主需在 `index.html` 中声明（用到才配）：

| 变量 | 用途 |
|---|---|
| `VUE_APP_MAP_BASE_URL` | 基础服务地址，jkfileview 预览时拼文件下载 URL 前缀 |
| `VUE_APP_JKFILEVIEW_URL` | kkFileView 文件预览服务地址（office/pdf 在线预览） |
| `VUE_APP_FILE_VIEWER_ASSETS_URL` | file-viewer 纯前端预览静态资源地址（可选，默认同源 `/file-viewer/`） |

### 边界处理
- structable 组件时强制隐藏下载按钮和文件名
- useFileViewer 开启时 office/pdf 走 fileViewer（纯前端）
- 图片缩略图用 getOriginImg，其它用 getThumbnailFile
- PNG 魔数检测：读前 8 字节比对 `89 50 4E 47`
- DEV 环境 baseUrl 加 /prefix 前缀

### PPTX 预览限制
- file-viewer 的 PPTX 预览大小限制硬编码为 **200 MiB**（原版 160 MiB，本项目已 patch），超限文件无法用 file-viewer 预览，需降级走后端转换（jkfileview）
- file viewer 工具栏下载按钮默认隐藏（与外层下载按钮重复）

### 示例
```html
<!-- minio 文件 -->
<jura-file-priview :fileId="fileId" :fileName="fileName" :fileType="fileType" />
<!-- file-viewer -->
<jura-file-priview :fileId="fileId" :fileName="fileName" :fileType="fileType"
  :useFileViewer="true" :showFileViewerSwitch="true" />
<!-- 数仓 -->
<jura-file-priview :dataId="dataId" :key="dataId" @previewFileFunc="previewFileFunc" />
```

---

## §9 JuraImagePreView — 图片预览

**标签**：`<jura-image-preView>`

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `fileId` | String | `''` | 是 | 文件 ID |
| `useTempUrl` | Boolean | `false` | 否 | 使用临时 URL |
| `circle` | Boolean | `false` | 否 | 圆形展示 |
| `diameter` | Number \| String | `100` | 否 | 圆形直径 |
| `previewable` | Boolean | `false` | 否 | 可点击放大预览 |
| `width` | String | `'100%'` | 否 | 矩形宽度 |
| `height` | String | `'100%'` | 否 | 矩形高度 |
| `fit` | String | `''` | 否 | object-fit |

### Events
| 名称 | 参数 | 说明 |
|---|---|---|
| `error` | `error` | 加载失败 |

### 边界处理
- IntersectionObserver 懒加载（rootMargin 50px）
- 不支持 IntersectionObserver 时 console.warn 并 return
- 加载失败显示 PictureOutlined 占位
- previewable && !loadFailed 才可预览
- 多实例 ref 通过 uid 管理

### 示例
```html
<jura-image-preView fileId="xxx" circle :diameter="100" />
<jura-image-preView fileId="xxx" width="40%" height="300px" previewable />
```

---

## §10 JuraBEcharts — ECharts 图表

**标签**：`<JuraBEcharts>`

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `compId` | String | `''` | **是** | 组件 ID |
| `searchParams` | Object | `{}` | 否 | 查询参数（含 bo、paramList、ptDescriptorMap、replaceTmp） |
| `fileId` | String | `''` | 否 | 文件 ID（存在时走 getChartContent） |
| `width` | String | `'100%'` | 否 | 容器宽度 |
| `height` | String | `'100%'` | 否 | 容器高度 |
| `isShowtool` | Boolean | `false` | 否 | 显示自定义工具栏 |
| `priviewShow` | Boolean | `false` | 否 | 预览模式 |
| `data` | Object \| Array | `null` | 否 | 外部数据更新 |
| `fileDownloadUrl` | String | `'/file/api/v2/download/'` | 否 | 下载 URL |

### Events
| 名称 | 参数 | 说明 |
|---|---|---|
| `loading-change` | `boolean` | 加载状态变化 |
| `comp-metric` | `{ componentId, requestId }` | 渲染完成上报 |

### Methods（ref）
| 名称 | 参数 | 说明 |
|---|---|---|
| `getChartInstance` | — | 返回 ECharts 实例 |
| `getChartOption` | — | 返回当前 option |
| `saveGraphic` | — | 返回 base64 PNG |
| `updateData` | `data` | 外部数据更新 |

### 边界处理
- **bo 空值拦截**：searchParams.bo 不存在时仅展示模板数据，不请求成图数据
- fileId 优先于 compId
- 预览模式走 getPriviewTempData/getPriviewCompV3Data
- 模板脚本判定：正则 `/var field[\s\S]*/g` 决定 evilFun 还是 JSON.parse
- comp-metric 在 ECharts finished 事件后触发

### 示例
```html
<JuraBEcharts :compId="compId" :searchParams="{ bo: 'AD-08', paramList: [{ code:'bo', value:'AD-08' }] }" height="300px" :isShowtool="true" />
```

---

## §11 JuraH5View — H5 单井图

**标签**：`<juraH5View>`（自备模板+数据直接渲染见 §29 JuraH5Curve）

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `compId` | String | `''` | 否 | 组件 ID |
| `searchParams` | Object | `{}` | 否 | 查询参数（含 bo） |
| `showScale` | Boolean | `true` | 否 | 显示比例尺 |
| `width` | String | `'800px'` | 否 | 容器宽度 |
| `height` | String | `'100%'` | 否 | 容器高度（像素值自动减 40px） |
| `priviewShow` | Boolean | `false` | 否 | 预览模式 |

### Events
| 名称 | 参数 | 说明 |
|---|---|---|
| `loading-change` | `boolean` | 加载状态变化 |
| `comp-metric` | `{ componentId, requestId }` | 渲染后上报（setTimeout 500ms） |

### Methods（ref）
| 名称 | 说明 |
|---|---|
| `saveGraphic()` | 返回 base64 |
| `updateData(data)` | 更新成图数据 |

### 宿主配置
组件依赖 `window.jurcH5`，宿主需在 `index.html` body 末尾引入 `jurc-h5.js`（脚本文件位于 `skills/jurassic-biz/jurc-h5.js`，拷贝到宿主项目 public 目录后引用）：

```html
<script src="./jurc-h5.js"></script>
```

### 边界处理
- **bo 空值拦截**：无 bo 不请求成图数据
- compId 为空时 `getComTempById` 直接 return false
- 高度以 px 结尾自动减 40px 留给比例尺行
- 预览模式走专用接口

### 示例
```html
<juraH5View :comp-id="compId" :search-params="{ bo: 'AD-08' }" :show-scale="false" />
```

---

## §12 JuraGis — GIS 地图

**标签**：`<jura-gis>`（Options API）

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `height` | String | `'600px'` | 否 | 地图高度 |
| `mapList` | Array | `[]` | 否 | 底图列表 |
| `center` | Array | `[106.245, 30.255]` | 否 | 中心点 |
| `zoom` | Number | `6` | 否 | 缩放级别（0-20） |
| `iconScale` | Number | `0.15` | 否 | 图标缩放 |
| `svgBaseUrl` | String | `''` | 否 | SVG 底图 URL |

### Events
| 名称 | 参数 | 说明 |
|---|---|---|
| `getSvgId` | `svgId` | 右键 SVG 图层 |
| `getSvgLayerMap` | `svgLayersMap` | SVG 图层数据 |
| `getClickFeature` | `{ geometryType, coordinates, bo, bot, attrs, type }` | 点击/悬停要素 |
| `getDrawCoor` | `{ type, coor, points }` | 圈选完成 |

### Slots
| 名称 | 说明 |
|---|---|
| `searchBox` | 搜索框 |
| `selectBox` | 圈选工具 |
| `toolBox` | 工具框 |
| `clickPop` | 点击弹框 |
| `hoverPop` | 悬停弹框 |
| `contextMenu` | 右键菜单 |

### Methods（ref，主要）
`initMap`、`drawFun(type)`、`addPoint(points)`、`addLayersLines(lines)`、`addPoLayersLygons(lygons)`、`setPosition(coordinate)`、`toggleLayer(visible)`、`clearPoint`、`clearDraw`、`highLigntPoint(coordinate)`、`clearHighLigntPoint`、`initMapLayer(layers)`、`addMapLayerData(data)`、`getSelectedFeature(bot)`、`getNearFeature(center, radius, layerName)`、`loadSvgLayer(svgId, svgUrl, visible)`

### 宿主环境变量
组件从 `window.globalConfig.VUE_APP_MAP_BASE_URL` 读取 GIS 地图服务底图地址，宿主需在 `index.html` 中声明：

```js
window.globalConfig = { VUE_APP_MAP_BASE_URL: 'http://192.168.0.137:7000' }
```

### 边界处理
- bo 不存在时 displayFeatureInfo 直接 return
- 聚合点 >=2 不触发点击事件
- highLigntPoint 用 setInterval(200ms) 闪烁，需配套 clearHighLigntPoint

### 示例
```html
<jura-gis ref="juraGis" :mapList="mapList" @getDrawCoor="getDrawCoor" @getClickFeature="getClickFeature">
  <template #selectBox>
    <jura-button @click="juraGis.drawFun('Rect')">框选</jura-button>
  </template>
  <template #clickPop="{ feature }">{{ feature.bo }}</template>
</jura-gis>
```

---

## §13 JuraBaikeView — 百科

**标签**：`<jura-baike-view>`

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `compId` | String | `''` | **是** | 组件 ID |
| `searchParams` | Object | `{}` | **是** | 查询参数（必须含 bo） |
| `showToc` | Boolean | `true` | 否 | 显示右侧目录 |
| `priviewShow` | Boolean | `false` | 否 | 预览模式 |

### Events
| 名称 | 参数 | 说明 |
|---|---|---|
| `comp-metric` | `{ componentId, requestId }` | 渲染后上报 |

### 宿主环境变量
百科内嵌的 finereport 预览（frView）从 `window.globalConfig.VUE_APP_MAP_BASE_URL` 读取服务地址，宿主需在 `index.html` 中声明：

```js
window.globalConfig = { VUE_APP_MAP_BASE_URL: 'http://192.168.0.137:7000' }
```

### 边界处理
- **无 bo 禁止请求**：`if (!props.searchParams?.bo) return`（任何模式下），否则会导致报错
- 无 compId 也 return
- 预览模式走 getPriviewCompV3Data
- TOC 联动滚动：isScrolling 防止反向更新

### 示例
```html
<jura-baike-view :compId="compId" :searchParams="{ bo: 'AD-08' }" />
```

---

## §14 JuraBaguwen — 八股文富文本编辑器

**标签**：`<JuraBaguwen>`

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `modelValue` | String | `''` | 否 | v-model 内容 |
| `compId` | String | `''` | 否 | 组件 ID |
| `searchParams` | Object | `{}` | 否 | 查询参数（含 bo） |
| `toolbarShow` | Boolean | `true` | 否 | 显示工具栏 |
| `height` | String | `'100%'` | 否 | 编辑器高度 |
| `readOnly` | Boolean | `false` | 否 | 只读 |
| `priviewShow` | Boolean | `false` | 否 | 预览模式 |

### Events
| 名称 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `string` | v-model 同步 |
| `comp-metric` | `{ componentId, requestId }` | 渲染后上报 |

### 边界处理
- **bo 空值拦截**：无 bo 不请求成图数据（但仍展示模板）
- 无 compId 时 getTempById return false
- **注意**：baguwenView 用 `param` 而非 `paramList`，与其他组件命名不一致

### 示例
```html
<JuraBaguwen v-model="content" :compId="compId" :searchParams="{ bo: 'AD-08' }" />
<JuraBaguwen v-model="content" :readOnly="true" />
```

---

## §15 JuraBGms — GMS 地图

**标签**：`<JuraBGms>`

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `compId` | String | `''` | 否 | 组件 ID |
| `compType` | String | `''` | 否 | 地图类型：singlewell/geochem/planmap/multiwell |
| `searchParams` | Object | `{}` | 否 | 查询参数（含 bo、mapName） |
| `height` | String | `'100%'` | 否 | 高度 |
| `width` | String | `'100%'` | 否 | 宽度 |
| `geoData` | Object | `{}` | 否 | 外部地理数据 |
| `priviewShow` | Boolean | `false` | 否 | 预览模式 |

### Events
| 名称 | 参数 | 说明 |
|---|---|---|
| `loading-change` | `false` | initGeoMap 结束 |
| `comp-metric` | `{ componentId, requestId }` | 渲染后上报 |

### Methods（ref）
| 名称 | 说明 |
|---|---|
| `saveGraphic()` / `saveGeoMap()` | 返回 base64 |
| `updateData(data)` | 更新地理数据 |

### 边界处理
- **bo 空值拦截**：`if (!bo) { console.warn; return }`
- compId 和 bo 同时存在才进入绘制
- shouldSendRequest：URL 参数 isinit=true 且 paramList 无 projectInfo 时拦截
- compType 分发：singlewell/geochem→getGmpTempCompSvg；planmap→getGmpTempCompPlanmapSvg；multiwell→getGmpTempCompMultiWellSvg

### 示例
```html
<JuraBGms :compId="compId" compType="singlewell" :searchParams="{ bo: 'AD-08' }" height="400px" />
```

---

## §16 JuraDocView — 报告视图（OnlyOffice）

**标签**：`<jura-doc-view>`

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `searchParams` | Object | `{}` | 否 | 查询参数（必须含 bo） |
| `componentInfo` | Object | `{}` | 否 | 组件信息（ptName、ptId、template） |
| `height` | String | `'600px'` | 否 | 高度 |
| `fileType` | String | `'docx'` | 否 | 文件类型 |
| `mode` | String | `'edit'` | 否 | edit / view |
| `callbackUrl` | String | `'/component/draw/save/report_by_key'` | 否 | OnlyOffice 回调 URL |
| `openFileUrl` | String | `'/component/draw/get/report_by_key'` | 否 | 打开文件 URL |

### 宿主环境变量
组件通过 `window.DocsAPI` 使用 OnlyOffice，宿主需在 `index.html` 中声明 `VUE_APP_ONLYOFFICEURL` 并动态加载 api.js：

```html
<script>
  window.globalConfig = { VUE_APP_ONLYOFFICEURL: 'http://192.168.1.163:8088' }
  if (window.globalConfig.VUE_APP_ONLYOFFICEURL) {
    const s = document.createElement('script')
    s.type = 'text/javascript'
    s.src = `${window.globalConfig.VUE_APP_ONLYOFFICEURL}/web-apps/apps/api/documents/api.js`
    document.body.appendChild(s)
  }
</script>
```

### 边界处理
- **bo 空值拦截**：`if (!bo) { loading=false; return }`
- edit 模式 key=fileId；view 模式 key=时间戳（避免缓存）
- onOutdatedVersion 触发 location.reload(true)

### 示例
```html
<jura-doc-view :search-params="{ bo: 'AD-08' }" :component-info="{ ptId, template, ptName }" mode="view" height="500px" />
```

---

## §17 JuraReportView — 报表（帆软）

**标签**：`<jura-report-view>`

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `compId` | String | `''` | **是** | 组件 ID |
| `searchParams` | Object | `{}` | **是** | 查询参数（含 bo、paramList） |
| `height` | String | `'400px'` | 否 | iframe 高度 |
| `width` | String | `'100%'` | 否 | 宽度 |
| `lineHeight` | Number | `38` | 否 | 每行高度 |

### 边界处理
- **bo 空值拦截**：`if (val && val.bo) getUrlData()`
- 高度自适应：postMessage frHeight 或按数据条数计算
- urlParams.notTable==='1' 时高度固定 400
- urlParams.showLoadBtn==='1' 时显示 Excel 导出按钮

### 示例
```html
<jura-report-view :comp-id="compId" :search-params="{ bo: '12', paramList: [{ code:'startTime', value:'2026-06-01' }] }" />
```

---

## §18 JuraExternalView — 外部组件

**标签**：`<jura-external-view>`

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `compId` | String | `''` | **是** | 组件 ID |
| `searchParams` | Object | `{}` | **是** | 查询参数（含 bo） |
| `height` | String | `''` | 否 | iframe 高度（空则 16:9 自适应） |
| `isFrScreenshot` | Boolean | `false` | 否 | 截图模式 |
| `screenshotDomains` | Array | `[]` | 否 | 截图域名列表 |
| `priviewShow` | Boolean | `false` | 否 | 预览模式 |

### Events
| 名称 | 参数 | 说明 |
|---|---|---|
| `comp-metric` | `{ componentId, requestId }` | 渲染后上报 |

### 边界处理
- **bo 空值拦截**：`if (val && val.bo) getUrlData()`
- 截图模式：screenshotDomains 匹配且 isFrScreenshot 为 true 时返回 base64 图片
- 预览模式走 getPriviewCompV3Data

### 示例
```html
<jura-external-view :search-params="{ bo: '12' }" comp-id="xxx" height="300px" />
<jura-external-view :search-params="{ bo: '12' }" comp-id="xxx" :is-fr-screenshot="true" :screenshot-domains="['cnooc']" />
```

---

## §19 JuraDrawTools — 绘图工具统一入口

**标签**：`<jura-draw-tools>`

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `regId` | String | `''` | **是** | 组件注册 ID |
| `height` | String | `'100%'` | 否 | 容器高度 |
| `showSearch` | Boolean | `true` | 否 | 显示查询条件 |
| `showSave` | Boolean | `true` | 否 | 显示保存按钮 |
| `urlParams` | Object | `{}` | 否 | URL 参数 |
| `projectInfo` | Object | `null` | 否 | 项目信息 |
| `footer` | Boolean \| Object | `false` | 否 | 表格 footer |
| `preview` | Boolean | `false` | 否 | **配置预览**：仅隐藏表格，数据走正常接口，不调日志 |
| `showTable` | Boolean | `true` | 否 | **商店预览**：false 时隐藏表格+走预览接口+调日志 |

### Events
| 名称 | 参数 | 说明 |
|---|---|---|
| `loading-change` | `boolean` | 加载状态 |
| `comp-metric` | `payload` | 渲染完成上报 |

### preview vs showTable 模式对照

| 模式 | 表格 | 数据接口 | 日志上报 | priviewShow 传值 |
|---|---|---|---|---|
| 正常 | 显示 | 正常 | 不调 | false |
| `preview=true` | 隐藏 | 正常 | 不调 | false |
| `showTable=false` | 隐藏 | 预览专用 | 调 | true |

### compType → 子组件映射
echarts→JuraBEcharts、h5singlewell→JuraH5View、singlewell/planmap/multiwell/geochem/GeoMap→JuraBGms、baguwen→JuraBaguwen、baike→JuraBaikeView、finereport/activereportsjs→JuraReportView、reportblend/reportblend_word→JuraDocView、outer→JuraExternalView

### 示例
```html
<!-- 正常 -->
<jura-draw-tools :reg-id="regId" :key="regId" height="500px" :footer="footer" />
<!-- 配置预览 -->
<jura-draw-tools :reg-id="regId" :key="regId" :preview="true" :show-save="false" />
<!-- 商店预览 -->
<jura-draw-tools :reg-id="regId" :key="regId" :show-table="false" :show-save="false" @comp-metric="handleCompMetric" />
```

---

## §20 JuraH5Design — H5 模板设计器

**标签**：`<jura-h5-design>`

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `templateData` | Object | `null` | 否 | 模板数据（直接修改引用，实时同步） |
| `inline` | Boolean | `false` | 否 | 内嵌模式（宽度自适应） |

### Methods（ref）
| 名称 | 说明 |
|---|---|
| `getTempData()` | 获取当前模板数据 |

### 宿主配置
组件依赖 `window.jurcH5`，宿主需在 `index.html` body 末尾引入 `jurc-h5.js`（脚本文件位于 `skills/jurassic-biz/jurc-h5.js`，拷贝到宿主项目 public 目录后引用）：

```html
<script src="./jurc-h5.js"></script>
```

### 边界处理
- 模板为空显示 jura-empty
- 树拖拽仅允许同 pid 同层排序
- configRefesh 从 cacheTemplateData 深拷贝恢复

### 示例
```html
<jura-h5-design :templateData="template" :inline="true" />
```

---

## §21 JuraMultiLangCollectionTool — 多语言采集

**标签**：`<jura-multi-lang-collection-tool>`

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `dataId` | String | — | **是** | 数据 ID |
| `entityType` | String | — | **是** | 实体类型 |
| `fieldLocaleList` | Array | — | **是** | 字段配置 `[{ fieldCode, defaultLocaleValue }]` |
| `showModal` | Boolean | `false` | 否 | v-model:showModal |
| `getUrl` | String | `'/component/i18n/resources/listByDataIdAndEntityType'` | 否 | 获取接口 |
| `saveUrl` | String | `'/component/i18n/resources/saveOrUpdateBatch'` | 否 | 保存接口 |

### Events
| 名称 | 参数 | 说明 |
|---|---|---|
| `update:showModal` | `false` | 关闭弹框 |

### 边界处理
- 双重校验：未选语言 warning；翻译值空白 warning
- 行数始终与 fieldLocaleList 对齐
- 无数据时按 fieldLocaleList 生成空行

### 示例
```html
<jura-multi-lang-collection-tool :data-id="dataId" :entity-type="'techComp'"
  :field-locale-list="[{ fieldCode:'name', defaultLocaleValue:'测试' }]" v-model:show-modal="showModal" />
```

---

## §22 JuraVxeTable — 表格

**标签**：`<jura-vxe-table>` / `<jura-vxe-grid>` / `<jura-vxe-column>`

完全继承自 vxeTable，所有 vxeTable 组件加 `jura` 前缀。属性/事件/API 与 vxeTable 一致。默认支持行、列拖拽排序、列宽拖拽调整。

### 示例
```html
<jura-vxe-table :data="tableData" :rowConfig="{ drag: false }" :columnConfig="{ resizable: false }">
  <jura-vxe-column type="seq" width="80" />
  <jura-vxe-column field="name" title="名称" />
  <jura-vxe-column field="action" title="操作">
    <template #default="{ row }">
      <jura-button type="text" @click="edit(row)">编辑</jura-button>
    </template>
  </jura-vxe-column>
</jura-vxe-table>
```

```html
<jura-vxe-grid v-bind="gridOptions" @toolbar-button-click="onToolbarClick" />
```

---

## §23 JuraWordEditor — 文档编辑器

**标签**：`<jura-word-editor>`

> **注意**：此组件文档与示例存在于 examples 中，但 packages 源码尚未实现。使用前请确认组件已补齐。

### 宿主环境变量
组件从 `window.globalConfig` 读取以下变量，宿主需在 `index.html` 中声明：

```js
window.globalConfig = {
  VUE_APP_ONLYOFFICEURL: 'http://192.168.1.163:8088',  // OnlyOffice 服务，compType='OnlyOffice' 时需配置并动态加载 api.js
  WPS_APP_ID: 'SX20250527IXQUEE',                      // WPS 应用 id，compType='Wps' 时需配置
}
```

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `compType` | String | — | **是** | 'Wps' 或 'OnlyOffice' |
| `fileType` | String | — | **是** | 'xlsx'/'docx'/'ppt'/'pdf' |
| `fileId` | String | — | **是** | 文件 ID |
| `appId` | String | — | Wps 必填 | Wps 应用 ID |
| `fileTitle` | String | — | OnlyOffice 必填 | 文件标题 |
| `mode` | String | `'edit'` | 否 | edit / view |
| `user` | Object | — | OnlyOffice 必填 | `{ id, name }` |
| `height` | String | `'600px'` | 否 | 高度 |
| `isBackoutShow` | Boolean | `true` | 否 | 显示退出按钮 |

### Events
| 名称 | 说明 |
|---|---|
| `backOut` | 退出按钮回调 |

### 示例
```html
<jura-word-editor compType="OnlyOffice" fileType="docx" :fileId="fileId" :fileTitle="'测试.docx'" mode="edit" :user="{ id:'1', name:'zhangshan' }" @backOut="backOut" />
```

---

## §24 JuraUniverTable — 电子表格

**标签**：`<jura-univer-table>`

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `sheets` | Array | — | 否 | 二维数组数据 `[{ name, data: [[...]] }]` |
| `width` | String | `'100%'` | 否 | 宽度 |
| `height` | String | `'500px'` | 否 | 高度 |

### 示例
```html
<jura-univer-table :sheets="[{ name: 'Sheet1', data: [['Name','Age'],['John',28]] }]" height="500px" />
```

---

## §25 JuraTwoLayout — 双栏布局

**标签**：`<jura-two-layout>`

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `showSearch` | Boolean | `true` | 否 | 显示顶部工具栏 |
| `hideRight` | Boolean | `false` | 否 | 隐藏右侧（预览模式） |

### Slots
| 名称 | 说明 |
|---|---|
| `conditions` | 顶部条件区 |
| `leftContent` | 左侧内容（hideRight 时占满） |
| `rightContent` | 右侧内容（hideRight 时不渲染） |

### 边界处理
- hideRight=true 时不渲染拖拽线和右侧
- 拖拽最小宽度 200，最大 totalWidth-216
- 支持全屏（requestFullscreen）

---

## §26 JuraUnifiedCompEnter — 组件统一入口

**标签**：内部组件，通常由 JuraDrawTools 使用

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `compType` | String | — | **是** | 组件类型 |
| `regId` | String | `''` | 否 | 组件 ID（透传为 compId） |
| `searchParams` | Object | `{}` | 否 | 搜索参数 |
| `priviewShow` | Boolean | `false` | 否 | 预览模式 |
| `height` | String | `'600px'` | 否 | 高度 |
| `width` | String | `'100%'` | 否 | 宽度 |

### Methods（ref）
| 名称 | 说明 |
|---|---|
| `updateData(data)` | 更新数据 |
| `saveGraphic()` | 保存图形（返回 base64 或 null） |

---

## §27 JuraEcharts — 纯前端 ECharts 图表

**标签**：`<JuraEcharts>`

与 JuraBEcharts（§10，compId + 后端成图）不同，JuraEcharts 直接接收 ECharts option，纯前端渲染，不依赖后端接口。

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `chartOption` | Object | — | **是** | ECharts option 配置 |
| `width` | String | `'100%'` | 否 | 容器宽度 |
| `height` | String | `'600px'` | 否 | 容器高度 |

### Methods（ref）
| 名称 | 参数 | 说明 |
|---|---|---|
| `getChartInstance` | — | 返回 ECharts 实例 |
| `getChartOption` | — | 返回当前完整 option |
| `updateChartOption` | `option, notMerge` | 更新图表配置 |

### 边界处理
- chartOption deep watch，变化自动 `setOption(option, true)` 全量替换
- 容器 ResizeObserver + window resize 双监听，300ms 防抖后 resize
- onBeforeUnmount 自动 dispose 图表并断开 observer

### 示例
```html
<JuraEcharts :chartOption="chartOption" height="300px" />
```

---

## §28 JuraEditor — 纯富文本编辑器

**标签**：`<JuraEditor>`

与 JuraBaguwen（§14，compId + 后端模板）不同，JuraEditor 是纯 wangEditor 封装，内容通过 prop 双向同步。

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `content` | String | `''` | 否 | HTML 内容（支持 v-model:content） |
| `toolbarShow` | Boolean | `false` | 否 | 显示工具栏 |
| `height` | String | `'100%'` | 否 | 编辑区高度 |
| `readOnly` | Boolean | `false` | 否 | 只读 |
| `mode` | String | `'simple'` | 否 | wangEditor 模式：simple / default |

### Events
| 名称 | 参数 | 说明 |
|---|---|---|
| `update:content` | `string` | 内容变化同步（v-model:content） |

### 边界处理
- 工具栏默认排除：insertImage、insertVideo、codeBlock、uploadImage、insertTable、deleteTable、editImage、viewImageLink
- 图片仅支持 base64 插入（限 2MB），已关闭服务器上传与链接图片
- readOnly 时创建后自动 `disable()`
- 编辑器实例 Object.seal 处理；onBeforeUnmount 自动 destroy

### 示例
```html
<JuraEditor v-model:content="html" :toolbarShow="true" height="300px" />
<JuraEditor :content="html" readOnly />
```

---

## §29 JuraH5Curve — H5 曲线渲染（自备数据）

**标签**：`<JuraH5Curve>` / `<jura-h5-curve>`

与 JuraH5View（§11，compId + 后端接口）不同，JuraH5Curve 直接接收模板和成图数据渲染单井曲线。

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `templateData` | Object | — | **是** | 曲线图模板 |
| `mappingData` | Object | — | **是** | 成图数据 |
| `pageStyle` | Object | `{width:'800px',height:'700px'}` | 否 | 画布尺寸（width/height 为 px 字符串） |
| `scaleValue` | String | `'1:5000'` | 否 | 比例尺 |
| `showAllBody` | Boolean | `true` | 否 | 是否展示整个曲线 |
| `bo` | String | `''` | 否 | 对象名，替换图头 `{bo}` 占位 |

### Methods（ref）
| 名称 | 说明 |
|---|---|
| `getBase64()` | 导出 jpg base64 |
| `getPage()` / `setPage()` / `removePage()` | 全局 page 实例缓存管理 |
| `getWell(pager)` | 返回 pager.main（曲线主体） |
| `countWidth()` / `updateWdith()` | 计算/更新图件宽度 |
| `drawCurve()` | 手动重绘 |

### 宿主配置
组件依赖 `window.jurcH5`，宿主需在 `index.html` body 末尾引入 `jurc-h5.js`（脚本文件位于 `skills/jurassic-biz/jurc-h5.js`，拷贝到宿主项目 public 目录后引用）：

```html
<script src="./jurc-h5.js"></script>
```

### 边界处理
- **依赖 window.jurcH5**：宿主需先引入 jurcH5 SDK，否则无法渲染
- templateData/mappingData deep watch + 500ms 防抖重绘
- pageStyle 宽度最小 260px
- 模板 `wellName.option.text` 中的 `{bo}` 占位符由 bo prop 替换
- onUnmounted 自动 removePage 释放缓存

### 示例
```html
<JuraH5Curve :templateData="template" :mappingData="mapping" :pageStyle="{ width: '800px', height: '700px' }" bo="AD-08" />
```

---

## §30 JuraGeoMap — GMS SVG 图件渲染（自备数据）

**标签**：`<JuraGeoMap>`

与 JuraBGms（§15，compId + 后端模板）不同，JuraGeoMap 直接接收 svgUrl 渲染 GMS 图件，并提供图层管理。

### Props

| 名称 | 类型 | 默认 | 必填 | 说明 |
|---|---|---|---|---|
| `geoMapBase64Info` | Object | `{svgUrl:'',bo:''}` | 否 | svg 图件信息 |
| `height` | String | `''` | 否 | 容器高度 |
| `showGmsEdit` | Boolean | `true` | 否 | 显示图层管理按钮 |

### 边界处理
- geoMapBase64Info deep watch，svgUrl 存在才加载图件
- 依赖 svgDH 库的 window.Getlayerinfo / SWvisablelayer 全局方法
- 图层树在 svg 加载成功后从 Getlayerinfo() 动态获取，支持逐层显示/隐藏
- 容器 ResizeObserver + 300ms 防抖 resizesvg

### 示例
```html
<JuraGeoMap :geoMapBase64Info="{ svgUrl: 'http://xxx/file/xxx.svg', bo: 'AD-08' }" height="600px" />
```

---

## §31 v-loading — 全局加载指令

**用法**：`v-loading="loading"`，`Vue.use(JurassicBizCom)` 时自动注册。

### 指令语法
| 语法 | 说明 |
|---|---|
| `v-loading="flag"` | flag 为 true 显示遮罩、false 隐藏 |
| `v-loading:自定义文案="flag"` | arg 指定文案（默认「加载中...」） |
| modifiers | 透传给内部 JuraLoading 组件 |

### 边界处理
- 指令会给宿主元素强制设置 `position: relative` + `overflow: hidden`
- 遮罩层白色半透明（rgba(255,255,255,0.8)）、z-index 9999、覆盖宿主元素
- 隐藏时恢复元素原始样式；组件卸载自动清理

### 示例
```html
<div v-loading="loading">内容区域</div>
<div v-loading:数据加载中="loading">内容区域</div>
```
