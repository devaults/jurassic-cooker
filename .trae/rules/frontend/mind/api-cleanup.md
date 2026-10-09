---
alwaysApply: false
description: 前端API调用、请求竞态、AbortController取消、Loading管理、错误提示、重试策略、组件卸载资源清理、内存泄漏防范
---

# API & Cleanup：API 调用与资源清理

> **强制**：前端与后端交互和资源管理密切相关，不规范的调用会导致竞态、内存泄漏。

## 一、请求竞态处理

- **AbortController（推荐）**：发新请求前 `controller?.abort()`，卸载时也 abort
- **请求序号**：`++requestSeq`，只处理 `currentSeq === requestSeq` 的响应
- 快速切换 Tab/筛选/搜索框连续输入场景**必须**做竞态保护

## 二、组件卸载时取消请求

- 卸载时**必须**取消所有未完成请求
- catch 时判断取消错误，取消的错误不要弹 toast：
  - axios：`if (axios.isCancel(err)) return`
  - fetch：`if (err.name === 'AbortError') return`

## 三、Loading 状态管理

- 不要每个接口单独定义 `loading1`、`loading2`
- 页面级 loading 统一管理，按钮级 loading 独立管理
- loading 必须在 finally 中关闭
- 按钮 Loading 防重复提交：`if (submitting.value) return` → `submitting.value = true` → finally `false`

## 四、错误提示

**必须提示**：用户操作触发的失败（提交/保存/删除）、页面核心数据加载失败、登录/权限错误
**静默处理**：后台轮询失败、预加载失败、被取消的请求、埋点上报失败

提示方式：表单失败→Toast+字段标红；页面加载失败→错误占位页+重试；删除/操作→Toast；网络断开→全局提示条

错误信息提炼：优先后端 message → HTTP 状态码友好提示（401→"登录已过期"、403→"没有权限"、5xx→"服务器开小差了"）→ 禁止展示技术错误信息

## 五、请求重试

**可重试（1次）**：GET 请求、网络错误、5xx、408 超时、429 限流（需延迟）
**禁止重试**：POST/PUT/DELETE 等非幂等请求、4xx 客户端错误、用户主动触发的提交、支付/下单

## 六、接口数据处理

- 不直接修改响应数据，用 `map` 创建新对象
- 空值防御：`res.data?.list ?? []`、`res.data?.userInfo ?? {}`
- GET 参数放 params，POST/PUT 放 data
- URL 路径参数必须 encode：`/api/user/${encodeURIComponent(userId)}`
- 不要在请求参数中传递 undefined

## 七、接口分层

- API 请求函数统一放 `@/api/`，按模块划分
- 组件中不直接写 `axios.get()`，调用封装好的 API 函数
- API 函数负责：参数序列化、请求发送、统一错误处理、响应解包
- 组件负责：loading 状态、用户交互、数据转换

## 八、资源清理成对原则

凡有"创建/注册/订阅"的地方，必须在同一逻辑块附近有"销毁/取消/退订"。

| 申请 | 释放 |
|------|------|
| `addEventListener` | `removeEventListener` |
| `setTimeout` / `setInterval` | `clearTimeout` / `clearInterval` |
| `requestAnimationFrame` | `cancelAnimationFrame` |
| `MutationObserver` / `IntersectionObserver` / `ResizeObserver` | `.disconnect()` |
| `WebSocket` / `EventSource` / `Worker` | `.close()` / `.terminate()` |
| `AbortController` | `.abort()` |
| `eventBus.$on` / `bus.on` | `.$off` / `.off` |
| `store.subscribe` | 返回的 unsubscribe |
| 第三方 SDK init | SDK 的 destroy/dispose |

### Vue 清理模板
```typescript
onMounted(() => {
  window.addEventListener('resize', handleResize)
  const timer = setInterval(() => { ... }, 1000)
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    clearInterval(timer)
  })
})
```

### React 清理模板
```typescript
useEffect(() => {
  const timer = setInterval(() => { ... }, 1000)
  return () => clearInterval(timer)
}, [])
```

## 九、常见陷阱

1. **监听器引用不一致**：add 用箭头函数，remove 找不到同一引用 → 提取为命名函数
2. **定时器引用被覆盖**：多次调用覆盖前一个 → 设置前先 clear
3. **异步回调在卸载后执行**：用 AbortController 取消或 isMounted 标记保护
4. **watch immediate 创建资源**：watch 回调中 return cleanup 函数
5. **事件委托**：父元素是全局容器时必须手动移除

### 第三方库清理
ECharts `chart.dispose()`、地图 `map.destroy()`、编辑器 `editor.destroy()`、播放器 `player.dispose()`、拖拽库 `sortable.destroy()`。

### 自查
组件中使用了上述资源 API 但未出现 `onUnmounted`/`onBeforeUnmount`/`useEffect return`，视为不合格。
