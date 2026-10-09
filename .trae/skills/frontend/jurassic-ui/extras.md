# 扩展组件：JuraColorPicker / 图标 / JuraMap / JuraMicroContainer

以下组件为 Jurassic UI 自研封装，**没有** Ant Design Vue 对照实现。API 以本文件和类型声明为准。

## 图标（JuraIcon / JuraSvgIcon）

Ant Design Vue 4 已移除旧版 `Icon` 组件。业务侧按来源选用：

| 场景 | 组件 | 额外依赖 |
| --- | --- | --- |
| 通用 UI（下载、搜索、关闭等） | `@ant-design/icons-vue` 组件 | `npm install @ant-design/icons-vue` |
| 公司 iconfont 库 | `JuraIcon` | `import 'jurassic-ui/es/fontIcons/iconfont.css'` |
| 内置品牌/业务 SVG | `JuraSvgIcon` | 无（首次挂载自动注入 sprite） |

### JuraIcon（iconfont）

`type` 对应 `iconfont.json` 里的 `font_class`；必须设 **`is-iconfont`** 为 true。

```vue
<script setup lang="ts">
// main.ts 或入口需已引入 iconfont.css
</script>

<template>
  <jura-icon
    type="search-outlined"
    :is-iconfont="true"
    style="font-size: 24px; color: #0a459a"
  />
</template>
```

| 属性 | 说明 | 类型 | 默认 |
| --- | --- | --- | --- |
| `type` | iconfont 的 font_class | string | - |
| `isIconfont` | 是否渲染 iconfont | boolean | false |

默认 slot 可放自定义内容（`isIconfont` 为 false 时）。

### JuraSvgIcon

`icon-class` 为内置 SVG 文件名（不含后缀）；也可传 `http(s)://`、`mailto:`、`tel:` 外链，按 **mask** 渲染（颜色继承 `currentColor`）。

```vue
<script setup lang="ts">
import { juraSvgIconNames } from 'jurassic-ui'
// juraSvgIconNames：内置名称数组，可用于文档/选择器
</script>

<template>
  <jura-svg-icon
    icon-class="jurassic"
    style="width: 48px; height: 48px; color: #0a459a"
  />
</template>
```

| 属性 | 说明 | 类型 | 默认 |
| --- | --- | --- | --- |
| `iconClass` | 内置 SVG 名或外链 URL | string | - |
| `className` | 追加类名后缀 `j-svg-icon-{className}` | string | `''` |

## JuraColorPicker

颜色拾取器（**2.0.4+**）。支持主题色、标准色面板、原生 `<input type="color">`（「更多颜色…」），输出 **hex** 或 **rgb/rgba**。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const color = ref('#9aba60')
const rgbaColor = ref('rgba(78, 129, 187, .5)')
</script>

<template>
  <jura-color-picker v-model="color" />
  <jura-color-picker v-model="rgbaColor" format="rgb" allow-alpha />
</template>
```

| 属性 | 说明 | 类型 | 默认 |
| --- | --- | --- | --- |
| `v-model` | 绑定颜色字符串 | string | - |
| `defaultColor` | 点击「默认颜色」回填值 | string | `#000` |
| `format` | `hex` 或 `rgb` | string | `hex` |
| `allowAlpha` | 透明度滑块 | boolean | false |
| `btnStyle` | 触发按钮样式 | object \| string | - |

事件：`change(value: string)`。弹窗/抽屉内使用时会自动定位面板，避免被裁剪。

---

## JuraMap

OpenLayers 地图（**2.0.3+**，`export { JuraMap }`）。默认投影 `EPSG:4326`，默认中心 `[106.245, 30.255]`，默认高 `600px`。公开类型里可能暂时没有 `JuraMapExposed`，用 `ref` 调方法即可。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { JuraMap } from 'jurassic-ui'

const mapRef = ref<{ addMarkers: (points: [number, number][], options?: { color?: string; radius?: number }) => void }>()

const onReady = () => {
  mapRef.value?.addMarkers([[106.245, 30.255]], { color: '#0A459A', radius: 8 })
}
</script>

<template>
  <jura-map
    ref="mapRef"
    height="480px"
    :center="[106.245, 30.255]"
    :zoom="8"
    :base-layers="[
      { id: 'osm', type: 'OSM', title: 'OpenStreetMap', visible: true, zIndex: 0 },
    ]"
    @ready="onReady"
  />
</template>
```

底图 `baseLayers[]`：`id`、`type`（`OSM` | `XYZ` | `Tile`）、`title?`、`url?`（XYZ/Tile 必填）、`visible?`、`zIndex?`、`opacity?`。天地图/高德用 `XYZ` + 对应瓦片 URL。

其它 props：`minZoom` / `maxZoom`，`projection`，`showZoom`（默认 true），`showFullScreen`（默认 true），`showScaleLine`，`showAttribution`，`overviewMap`，`overviewMapLayerUrl`，`mapOptions`，`viewOptions`。

事件：`ready`、`click`、`dblclick`、`pointermove`、`pointerdrag`、`moveend`、`draw-end`、`measure-end`。

通过 ref 调用（节选）：`getMap`、`setView`、`fitToExtent`、`setBaseLayerVisible`、`addMarkers` / `clearMarkers`、`startDrawLine` / `stopDrawLine` / `clearLines`、`startDrawArea` / `stopDrawArea` / `clearAreas`、`addClusteredPoints` / `clearClusteredPoints`、`addHeatmap` / `clearHeatmap` / `setHeatmapBlur`、`addTextLabels` / `clearTextLabels`、`addPopup` / `clearPopups`、`startMeasure('distance'|'area')` / `stopMeasure` / `clearMeasure`、`addSuperMapSQLQuery` / `clearSuperMapQuery`、`toggleLayer`、`addTileLayer`。

`addClusteredPoints(count)` / `addHeatmap(count)` 在库内生成随机点，演示用；业务数据请用 `addMarkers` 或 `getMap()` 自行加图层。

## JuraMicroContainer

基于 qiankun，`singular: false`，可同时挂多个子应用。插槽里放挂载点 DOM，`list[].container` 写成对应选择器。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { JuraMicroContainer } from 'jurassic-ui'

const list = ref([
  {
    name: 'sub-app',
    entry: 'https://your-micro-app.example/',
    container: '#micro-root',
    route: '/home',
    props: { userInfo: { username: 'demo' } },
  },
])
</script>

<template>
  <jura-micro-container :list="list" :props="{ from: 'main' }">
    <div id="micro-root" />
  </jura-micro-container>
</template>
```

| 属性 | 说明 |
| --- | --- |
| `list` | `{ name, entry, container, route?, props? }[]` |
| `props` | 传给**所有**子应用的公共对象，与单项 `list[].props` 合并；加载时还会带 `mode: 'abstract'`、`initialRoute: item.route` |

组件卸载时会 `unmount` 已加载微应用。`name` 必须与子应用注册名一致；`container` 必须能在插槽 DOM 里查到。
