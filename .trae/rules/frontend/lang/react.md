---
alwaysApply: false
description: 编写或修改 React + TypeScript 代码时使用（函数组件 + Hooks 模式）
---

### React + TypeScript 编码规范

> 适用于 React 18+ 函数组件 + Hooks + TypeScript，基于团队既有 React 项目风格。

#### 文件命名与组织（强制）

| 类型 | 命名 | 示例 |
|------|------|------|
| 组件（.tsx） | PascalCase | `Sidebar.tsx` |
| Hook（.ts/.tsx） | camelCase，use 前缀 | `useBidManagement.tsx` |
| 类型/工具（.ts） | camelCase | `types.ts`、`file.ts` |
| 目录 | kebab-case 或 PascalCase | `components/`、`BidManagement/` |
| 模块入口 | index.ts/index.tsx | 统一导出 |

#### 组件结构顺序（强制）

`imports → Props interface → 组件声明 → Context/Hooks → ref → state → computed/memo → callbacks → useEffect → render`

#### Hooks 规范（强制）

- **useState**：明确类型；相关状态合并为对象或用 useReducer；惰性初始化传函数
- **useEffect**：依赖数组完整；副作用必须 return 清理（成对原则与模板见 [`api-cleanup.md`](../mind/api-cleanup.md) §八）；竞态用 AbortController/isMounted；不直接写 async
- **useCallback**：传递给子组件的函数必须包裹
- **useMemo**：Context value 必须包裹；昂贵计算缓存；不滥用
- **useRef**：DOM 引用 `useRef<HTMLElement | null>(null)`；存储不触发渲染的值
- **自定义 Hook**：use 前缀 + camelCase；返回对象非数组；职责单一；内部 useEffect 自动清理

#### Props 规范（强制）

- `interface` 定义 Props，放组件文件顶部
- 可选 props 用 `?`，回调命名 `onXxx`，布尔用 is/has/can 前缀
- 不透传多余 props

#### Context 规范（强制）

- 默认值 `undefined`，useXxx Hook 中做存在性检查并抛错
- Provider value 必须 `useMemo` 包裹
- 复杂状态拆分多个 Context

```tsx
const contextValue = useMemo(() => ({ toast, showToast }), [toast, showToast]);
```

#### JSX 书写（强制）

- 超过 2 个属性每属性独占一行
- 条件渲染：简单用 `&&`（注意 falsy 不渲染 0），复杂用三元或抽变量
- 列表 `key` 用唯一 id，禁止用 index（静态列表除外）
- 事件命名 `handleXxx`，传参用箭头函数包裹
- 样式用 Tailwind，条件类名用 clsx/classnames

#### 性能优化（推荐）

- 传递给子组件的对象/函数用 useMemo/useCallback
- 长列表用 React.memo 包裹子项
- 状态下沉到最小使用层级
- 大组件用 React.lazy + Suspense 懒加载

#### 禁止行为（强制）

- ❌ 直接修改 state（用 setState 更新）
- ❌ 渲染期间执行副作用（放 useEffect）
- ❌ Hooks 在条件/循环中调用
- ❌ useEffect 依赖遗漏引用类型（闭包陷阱）
- ❌ 组件内创建大对象/数组传给子组件（每次新引用）
- ❌ 组件函数体内定义子组件
- ❌ 使用类组件（维护老代码除外）
- ❌ findDOMNode、字符串 ref，统一用 useRef

#### TypeScript 补充（强制）

- Props 用 `interface`，其他可用 `type`
- 事件类型：`React.MouseEvent<HTMLButtonElement>`、`React.ChangeEvent<HTMLInputElement>`
- children 类型：`React.ReactNode`
- 组件 ref：`React.RefObject<HTMLDivElement>`
- `any` / `unknown` / 类型守卫等通用规则见 [`typescript.md`](./typescript.md) §六，此处不重复
