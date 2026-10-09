---
alwaysApply: false
description: 编写或修改 JavaScript / TypeScript 代码时使用
---

### JavaScript & TypeScript 编码规范

> **分工**：本文件是**项目无关的通用规范**。Jura 中后台（Vue3 + jurassic-ui）的目录、命名、TS 约定
> 以技能 [`skills/frontend/project-conventions`](../../../skills/frontend/project-conventions/SKILL.md) 为准；
> 新代码与之冲突时以技能为准。

## 一、通用命名规范（强制）

- 标准变量驼峰式（对象属性可与后台字段对齐灵活命名）
- 常量全大写，下划线连接（`MAX_COUNT`）
- 变量名准确完整描述事物（`userId` 而非 `id`，`orderData` 而非 `obj`）
- 不使用中文拼音（`timestamp` 而非 `shijianchuo`）
- 复数加 `s` 或 `List`（`orderList`、`menuItems`）
- 过去式加 `ed`（`updated`），进行时加 `ing`（`calling`）
- 布尔变量用 `done/found/success/ok/available` 等，使用肯定命名，不用 `notOk`
- 对仗明确：`up/down`、`begin/end`、`opened/closed`、`visible/invisible`、`source/target`

## 二、JS 语法规范（强制）

- 变量不要先使用后声明，不要声明却不使用
- 不要在同作用域下声明同名变量
- 函数作用域变量声明提到首部，可分组但不允许两个连续声明
- 声明变量时必须赋值（`let count = 0` 而非 `let count`）
- 单一函数返回值类型要确定
- `debugger` 不得出现在提交代码中
- 使用 `===`/`!==` 代替 `==`/`!=`
- 使用 `let` 定义变量，`const` 定义常量
- 简单 if-else 用三目运算，简单函数用箭头函数

## 三、代码风格

> **引号、分号、缩进由项目的 prettier/eslint 配置决定，各项目不一致**（有的要求双引号、有的单引号；
> 分号有 `semi: false` 的）。**以项目实际配置为准**（见 [`eng/config.md`](../eng/config.md)），不要照搬其它项目。
> 下列为**常见默认**，仅供项目未配置时参考。

- 缩进 2 空格
- 引号：跟随项目 prettier 配置（勿在项目间套用）
- 语句结尾分号：跟随项目 prettier 配置
- 不需要空格：对象属性名后、一元运算符前后、函数调用括号前、`(` 前、数组方括号内
- 需要空格：二元运算符前后、三元运算符前后、代码块 `{` 前、关键字前后、注释 `//` 后

## 四、数组与对象（强制）

- 对象属性名不加引号，以缩进形式书写不写一行
- 数组中不存在空元素，不用 `for in` 循环数组

## 五、null 与 undefined（强制）

- `null` 用于：初始化可能被赋值为对象的变量、与已初始化变量比较、对象参数传参/返回值
- 不要用 `null` 判断函数是否传参，不要与未初始化变量比较
- 不要给变量赋值 `undefined`，用 `typeof x === 'undefined'` 判断

## 六、TypeScript 类型规范（强制）

### 类型使用原则
- **禁止无理由使用 `any`**：无法确定时优先用 `unknown` 代替
- 函数必须标注返回值类型（公共 API 函数、composable、工具函数）
- 不要写 `as any` 强制断言绕过类型检查，除非有充分理由并注释
- 非空断言 `!` 只在 100% 确定不为 null/undefined 时使用，且注释原因

### 类型定义位置
- 组件内 props/emits：直接在 `defineProps` / `defineEmits` 中写类型
- API 响应类型：放 `@/api/` 或 `@/types/api.ts`
- 公共业务类型：放 `@/types/` 按模块划分
- 单文件使用的类型：定义在该文件顶部

### interface vs type
- 对象结构、类的形状用 `interface`
- 联合类型、交叉类型、元组、别名用 `type`
- 统一约定，不混用（推荐默认 `interface`）

### 泛型规范
- 命名：单字母 `T`/`K`/`V`/`U`，或描述性 `TData`/`TResponse`
- 公共函数泛型参数加默认类型
- 简单场景不需要泛型抽象

```typescript
interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}
```

### 类型守卫
- 运行时判断用类型守卫收窄类型，而非强转
- 常用：`Array.isArray()`、`typeof x === 'string'`、自定义类型谓词 `obj is UserInfo`

### 枚举 vs 常量对象
- 不需要反向映射优先用 `as const` 常量对象 + `typeof` 推导
- 需要反向映射时用 `enum`
- 与后端约定的枚举值优先用 const 对象

```typescript
export const OrderStatus = {
  Pending: 0, Paid: 1, Shipped: 2, Cancelled: -1
} as const
export type OrderStatusType = typeof OrderStatus[keyof typeof OrderStatus]
```

### Vue/React 相关类型
- `ref<Type>()`：必须显式指定泛型
- `reactive<Type>()`：显式指定类型
- `computed`：自动推导，复杂场景显式标注
- 模板 ref：`ref<HTMLDivElement | null>(null)` / `ref<InstanceType<typeof Comp> | null>(null)`

### import type
仅作为类型使用的 import 用 `import type`，避免编译后残留运行时引入：
```typescript
import type { UserInfo } from '@/types/user'
import { getUserInfo } from '@/api/user'
```

### 禁止行为
- 禁止 `@ts-ignore`，必须说明时用 `@ts-expect-error` 并加注释
- 禁止空 interface `interface Foo {}` 或空 type `type Foo = {}`
- 禁止在 .vue 文件中声明全局 namespace
- 禁止函数参数隐式 any

## 七、注释（参考）

- 所有常量、函数、类建议使用 JSDoc 注释
- 使用 `@param` `@method` `@returns` 等标签
