# <功能名> · 前端技术方案（阶段五）

> **阶段五产物**·
> 主导角色：[`frontend-role.md`](${rel.cooker}/.trae/steering/frontend-role.md) ·
> 对应提示词：[`05-dev-frontend.md`](${rel.cooker}/.trae/prompts/stages/05-dev-frontend.md)
>
> **输入**：API 契约 v1（已签字）+ UI Spec v1（已签字）·**不写后端代码**。

## 0. 元信息

| 项 | 值 |
|---|---|
| 上游契约 | `design-contract.md` v1（已签字） |
| 上游 UI Spec | `design-ui.md` v`<x>`（已签字） |
| 前端项目路径 | `<仓库名>[/<项目内相对路径>]`（例：`oio-master-web` / `oio-master-web/src/views/order`；**仓库名 = 注册表键最后一段，不写 `group/` 前缀**） |
| 技术栈 | `<Vue 3 + Vite + TS + jurassic-ui 2.x / 或其它>` |
| 涉及模块 | `<目录/路由>` |
| 状态 | `草稿 / 进行中 / 已签字` |
| 文档版本 | `v0.1` |
| 代码 commit SHA | `<PR 合并后回填：abc1234>`（用于 QA / 上下游精准定位实现版本） |

---

## 1. 接口消费清单

> 与 `design-contract.md` §1 一一对应；不调用未定义的接口。

| # | 路径 / 方法 | api 函数名 | 入参类型 | 出参类型 | 错误码消费 |
|---|---|---|---|---|---|
| 1 | `GET /api/v1/<resource>` | `listResource(query: ListQuery): Promise<Page<Resource>>` | `ListQuery`（来自 swagger-typescript-api） | `Page<Resource>` |  |
| 2 | `POST /api/v1/<resource>` | `createResource(data: CreateRequest): Promise<Resource>` | `CreateRequest` | `Resource` |  |

> **优先用 `swagger-typescript-api` 生成** `src/api/<module>/types.ts` + `index.ts`；不要手抄字段。

## 2. 前端目录结构

```
src/
├── views/<模块>/<页面>/
│   ├── index.vue
│   └── components/        # 页面私有组件
├── components/<业务>/<Xxx>.vue     # 跨页组件
├── api/<模块>/
│   ├── index.ts           # swagger-typescript-api 生成
│   └── types.ts           # swagger-typescript-api 生成
├── store/modules/<模块>.ts
├── types/<模块>.d.ts      # 业务类型（非接口）
└── router/modules/<模块>.ts
```

## 3. 状态管理边界

| 状态 | 位置 | 例子 |
|---|---|---|
| 页面态（一次性） | 组件内 `ref` / `reactive` | 弹窗开关、临时表单 |
| 跨页共享 | Pinia store | 当前用户、菜单、字典 |
| 服务端态（缓存） | SWR / 自封装 | 列表分页缓存 |
| 全局 | `useAppStore` 等 | 主题、语言 |

## 4. 关键技术决策

| 决策 | 选择 | 理由 | 备选 | 风险 |
|---|---|---|---|---|
| UI 组件库 | jurassic-ui 2.x | 团队统一 / 已有主题 | Ant Design Vue |  |
| 状态管理 | Pinia | Vue 3 官方推荐 | Vuex（仅 Vue 2） |  |
| API 类型生成 | swagger-typescript-api | 契约一致 | 手写 |  |
| 列表虚拟化阈值 | `> 100 行` | 性能 | 全部加载 |  |
| 缓存 | SWR | 减少请求 | 每次拉 |  |

## 5. 错误处理策略

```ts
// src/api/request.ts
axios.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const { code, message, traceId } = err.response?.data || {}
    if (code === 401) router.push('/login')
    else if (code === 403) message.error('无权限')
    // 兜底
    return Promise.reject(err)
  }
)
```

- **HTTP 错误码 → 用户提示映射**：

| HTTP / 业务码 | 场景 | 用户提示 |
|---|---|---|
| 400 | 入参错误 | "请检查输入" |
| 401 | 未登录 | 跳登录 |
| 403 | 无权限 | "无权限访问" |
| 404 | 资源不存在 |  |
| 500 | 服务端异常 | "服务异常，请稍后重试" |
| `<resource>.xxx` | 业务码 | 按 `design-contract.md` §5 |

## 6. 性能与可访问性

- **列表虚拟化**：> 100 行启用
- **大表单**：> 50 字段考虑分步
- **图片懒加载**：`v-lazyload` 或 `@vueuse/core` 的 `useIntersectionObserver`
- **键盘可达**：Tab 顺序合理 / Enter 提交 / Esc 关闭弹窗
- **对比度**：≥ 4.5:1

## 7. 测试策略

- **单元测试**（关键 composable / util）：Vitest
- **E2E**（核心路径）：Playwright（项目已配置）
- **手测 checklist**：对照 `design-ui.md` §8 走查 checklist

## 8. 上线与回滚

> **上线动作（部署 / 灰度 / 正式发布）由使用方本地的上线流程决定**，**不在 QA 验收范围**。本节只写"QA 通过后**待执行**的上线步骤"，由上线执行方在 QA 通过后按下表执行。

- **feature flag / 灰度**：`<如：按用户白名单>`
- **回滚步骤**：`<回滚 commit + 清缓存>`

---

## 签字与版本

```markdown
前端技术方案 v0.1 ✅ 已签字 @前端名 YYYY-MM-DD
- 范围：
- 不做：
- 风险：
```

---

## 下游衔接

- 与后端并行开发（依赖契约 v1）
- 完成后与后端同步进入阶段 6 QA（见 `./qa/README.md`）