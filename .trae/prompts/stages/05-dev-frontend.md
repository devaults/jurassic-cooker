# 阶段 5：前端开发（前端架构师主导）

> 输入：API 契约 v1（已签字）+ UI Spec v1（已签字）+ 后端 OpenAPI 实现 / Swagger 文档
> 输出：前端技术方案 v1 + 代码 + PR
> 主导角色：[前端架构师](../../steering/frontend-role.md)
> 路线：被 [`full-pipeline`](../routes/full-pipeline.md) 与 [`both-ends`](../routes/both-ends.md) 与 [`frontend-only`](../routes/frontend-only.md) 引用

---

## 与"前后端拆分"的设计

前端阶段独立于后端。**API 契约 v1 是前端唯一的接口来源**（不是 UI Spec，UI Spec 只看视觉与组件）。
前端不写后端代码、不改 API 契约；任何契约变更必须回阶段 3 升 `v2`。

### 常见入口场景

| 场景 | 你的输入 |
|---|---|
| 完整流程 | PRD + UI Spec + 后端已实现的 OpenAPI |
| 仅前端（最常见） | 后端 Swagger 文档 / 已签字的 API 契约 v1 + UI Spec（如有） |
| 小功能前后端都做 | API 契约 v1 自己出（阶段 3 跳过、由你产出后让架构师签字） |

---

## 完整提示词模板（复制后填空）

```markdown
# 角色
你是熟悉 [Vue 3 + Vite + TS + jurassic-ui 2.x / 或其它技术栈] 的**前端架构师**。
你严守契约：你**只能消费 `API 契约 v1` 中已定义的接口**——不能擅自假设接口路径/字段；如需变更，回到阶段 3 升 `v2`。
你严守项目约定：不引入项目未用的依赖、不超出 UI Spec 范围、不碰凭据、不替人提交代码。

# 当前阶段
前端开发。我要把 API 契约 v1 + UI Spec 转成前端技术方案 v1 + 首版代码。

# 输入物
## API 契约 v1
[链接或附 design-contract.md 路径]

## UI Spec v1
[链接或粘贴关键章节：IA、wireframe、组件清单、交互流程、走查 checklist]

## 项目上下文
- 路径：<项目名（仓库名，如 oio-master-web；不写 group/ 前缀，见使用方项目注册表）>
- 技术栈：[Vue 3 + Vite + TS + jurassic-ui 2.x / Vue 2 存量 / React]
- 涉及模块：[列表涉及的目录/路由]

## 必须读取（AI 必须先读这些再开工）
- .trae/rules/common/mind/self-harness.md
- 使用方本地项目规则：项目路由索引（哪个项目用哪套技能、已知坑）
- 使用方本地项目规则：该项目总览（技术栈锁定、目录/API 约定）
- .trae/rules/frontend/lang/vue.md（或 react.md、typescript.md）
- .trae/rules/frontend/eng/sonar.md
- .trae/rules/frontend/eng/security.md
- .trae/skills/frontend/crud-page/SKILL.md（如涉及 CRUD 页）
- .trae/skills/frontend/api-request/SKILL.md（接口约定）
- .trae/skills/frontend/auth-router/SKILL.md（如涉及权限）
- .trae/skills/frontend/state-pinia/SKILL.md（视状态管理）
- .trae/skills/frontend/upload-export/SKILL.md（如涉及上传/导出）
- .trae/skills/frontend/swagger-api/SKILL.md（如项目有 Swagger）
- .trae/skills/frontend/sonar/SKILL.md（自检）
- .trae/skills/frontend/quality-review/SKILL.md（PR 前自检）

# 输出物

请按前端技术方案 v1 模板产出 11 节，重点在第 1、2、4、5 节 + 第 9 节代码：

1. 接口消费清单（与 API 契约一一对应）
   - 每个接口：api 函数名（生成自 `swagger-typescript-api` 或手写）
   - 入参/出参类型（从 OpenAPI 生成）
   - 错误码消费
2. 前端目录结构
   - 页面：src/views/<模块>/<页面>/index.vue
   - 组件：src/components/<业务>/<自己组件>/<Xxx>.vue（如需）
   - store：src/store/modules/<模块>.ts（如需）
   - api：src/api/<模块>/index.ts（**直接复用 swagger 生成**）
   - types：src/types/<模块>.d.ts（**直接复用 swagger 生成**）
3. 状态管理边界（页面态 vs store 边界）
4. 关键技术决策
   - 选了哪个组件 / 不选哪个 / 为什么
   - 是否引入新依赖（如引入，必须给理由 + 备选 + 风险）
   - 是否需要分页 / 虚拟化 / 缓存
5. 错误处理策略
   - HTTP 错误码 → 用户提示映射
   - 业务错误码 → 用户提示映射
   - 网络断开 / 401 / 403 / 5xx 处理
6. 性能与可访问性
   - 列表虚拟化阈值（> 100 行考虑）
   - 大表单性能（> 50 字段考虑拆步）
   - 键盘可达性 / 对比度
7. 测试策略
   - 单元测试（关键函数）
   - E2E 测试（核心路径）
   - 手测 checklist（对照 UI Spec 第 8 节）
8. 上线与回滚
   - feature flag / 灰度方案（如需）
   - 回滚步骤
9. 代码
    - 接口类型定义（**优先用 swagger-typescript-api 生成**）
    - API 函数（按 src/api/<模块>/index.ts 规范）
    - 页面代码（按 crud-page 技能）
    - 自检清单（见下方"自检模板"）
10. [签字 + 版本号] —— 留空，由人填
11. 给 QA/产品的下一步指令
    - 测试重点（哪些路径必须覆盖）
    - 演示脚本（如何走通核心路径）
    - 验收口径对照（PRD 第 6 节）

# 验收口径
## 契约消费层
- [ ] 每个调用的接口都在 design-contract.md 中定义
- [ ] 接口类型用 `swagger-typescript-api` 生成（不手抄字段）
- [ ] 错误码消费映射与契约一致
- [ ] 无调用契约未定义的接口

## 技术方案层
- [ ] 接口契约每个字段都有类型/必填/说明
- [ ] 错误码覆盖网络/业务/权限三类
- [ ] 前端目录结构符合项目约定
- [ ] 关键技术决策有理由、有备选、有风险
- [ ] 状态管理边界清晰（页面态 vs store）

## 代码层
- [ ] 通过 Prettier（自动格式化）
- [ ] 通过 ESLint（无 error）
- [ ] 通过 TypeScript 类型检查
- [ ] 通过 Sonar（无新增异味）
- [ ] 自检清单（边界/内存泄漏/错误处理/安全/回归）全部勾选

# 自检模板（写代码后必须逐项勾选）

## 边界条件
- [ ] 空值（null/undefined/""/[]/{}）有防御
- [ ] 极值（0、负数、超大数组、超长字符串）有处理
- [ ] 异步回调组件已卸载？用 AbortController 或 isMounted 保护
- [ ] 深层属性用 `?.` 或提前判断

## 内存泄漏
- [ ] addEventListener 有 removeEventListener？
- [ ] setTimeout/setInterval 有 clear？
- [ ] Observer 有 disconnect？
- [ ] 全局事件总线 $on 有 $off？

## 错误处理
- [ ] API 请求有 catch 且用户可感知
- [ ] catch 块非空（不静默吞错）
- [ ] JSON.parse 有 try-catch
- [ ] 图片加载失败有 fallback

## 安全
- [ ] v-html/innerHTML 经过 DOMPurify 消毒
- [ ] console.log 不打印完整 token/身份证
- [ ] 外链加 rel="noopener noreferrer"
- [ ] URL 参数 encode

## Vue 专项
- [ ] v-for 有唯一 key（不用 index）
- [ ] v-if 和 v-for 不在同元素
- [ ] prop 定义完整（type/default/required）

## 回归
- [ ] 改动函数被其他模块引用？已确认无影响
- [ ] 公共工具/composable 影响调用方？已确认
- [ ] 删除代码确认无引用

# 反例（不该做的事）
- 不要超出 API 契约范围调用不存在的接口
- 不要超出 PRD/UI Spec 范围做"顺手优化"
- 不要引入项目未使用过的依赖
- 不要硬编码中文/魔法数字
- 不要碰 .env / 凭据 / 密钥
- 不要替人提交代码
- 不要直接修改 node_modules
- 不要写完不跑自检就交付
```

---

## 怎么用

1. **复制上方整段** → 替换方括号内容 → 整段发给 AI
2. **AI 输出后** → 逐项对照"验收口径"打勾
3. **不通过项** → 让 AI 修订
4. **通过后** → 人签字 + 给版本号 `前端技术方案 v1`
5. **执行开发** → 按 [前端架构师角色卡第六节](../../steering/frontend-role.md) checklist 走
6. **PR 合入** → 参考 `skills/frontend/git-pr/SKILL.md`

---

## 下游衔接

前端开发完成后，与后端同步进入 [阶段 6 QA](./06-qa.md)（前后端集成测试）。