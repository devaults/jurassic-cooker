# T-NN · <任务名（动词开头）>

> 单任务卡片 · 引用：本目录 [README.md](./README.md) 第 1 节「任务索引」。
> **tier**: frontend

## 0. 元信息

| 项 | 值 |
|---|---|
| 任务 ID | `T-NN` |
| **tier** | `frontend` |
| 关联契约 | `../../design-contract.md` §`<章节号>` |
| 关联 UI Spec | `../../design-ui.md` §`<章节号>` |
| 关联技术方案 | `../../tech-solution-frontend.md` §`<章节号>` |
| 依赖 | `T-NN` / `T-MM` / — |
| 改动项目 | `<前端仓库名>`（注册表键最后一段，如 `oio-master-web`） |
| 改动文件 | `src/...` |
| 验证方式 | 命令 + 期望输出 / 手测步骤 |
| 状态 | ⬜ 待开始 / 🟡 进行中 / ✅ 已完成 |

---

## 1. 任务描述

> 用一两句话讲清：要改什么、为什么、做完是什么样。

## 2. 改动计划

| 文件 | 改动点 |
|---|---|
| `src/views/.../index.vue` | 新增页面 / 调整布局 |
| `src/api/.../index.ts` | 调通接口（**优先用 swagger-typescript-api 生成**） |
| `src/store/modules/...ts` | 新增 / 调整 store |
| `src/types/...d.ts` | 业务类型 |

## 3. 自检（交卷前）

> 这是单任务内的自检；全局自检见 [README.md §3](./README.md#3-全局自检)。

### 边界条件
- [ ] 空值（null/undefined/""/[]/{}）有防御
- [ ] 极值（0、负数、超大数组、超长字符串）有处理
- [ ] 异步回调组件已卸载？用 AbortController 或 isMounted 保护
- [ ] 深层属性用 `?.` 或提前判断

### 内存泄漏
- [ ] addEventListener 有 removeEventListener？
- [ ] setTimeout/setInterval 有 clear？
- [ ] Observer 有 disconnect？
- [ ] 全局事件总线 $on 有 $off？

### 错误处理
- [ ] API 请求有 catch 且用户可感知
- [ ] catch 块非空（不静默吞错）
- [ ] JSON.parse 有 try-catch
- [ ] 图片加载失败有 fallback

### 安全
- [ ] v-html/innerHTML 经过 DOMPurify 消毒
- [ ] console.log 不打印完整 token/身份证
- [ ] 外链加 rel="noopener noreferrer"
- [ ] URL 参数 encode

### Vue 专项
- [ ] v-for 有唯一 key（不用 index）
- [ ] v-if 和 v-for 不在同元素
- [ ] prop 定义完整（type/default/required）

### 回归
- [ ] 改动函数被其他模块引用？已确认无影响
- [ ] 公共工具/composable 影响调用方？已确认
- [ ] 删除代码确认无引用

### 契约消费
- [ ] 调用的每个接口都在 `design-contract.md` v1 中定义
- [ ] 类型用 `swagger-typescript-api` 生成（不手抄）

## 4. 命令与结果

> 没跑过的命令不许写跑过——查本机项目注册表 [`project-registry.md`](${rel.project_registry}) 确认项目实际可用命令。

| 命令 | 结果 |
|---|---|
|  |  |

## 5. 未做项与阻塞（本任务内）

- 未做：
- 阻塞：

---

## 签字

```markdown
T-NN ✅ 已完成 @前端名 YYYY-MM-DD
```