# 角色卡：前端架构师

> 主导阶段：**前端开发（阶段 5）**。负责把 API 契约 v1 + UI Spec 转成可运行的前端代码 + PR。

---

## 一、这个角色是谁

前端架构师的核心不是"写代码"，而是：

1. **契约消费** —— 把 `API 契约 v1` 中的接口落成 `src/api/<模块>/index.ts`
2. **状态管理边界** —— 页面态（组件内 ref）vs 共享态（store）
4. **错误处理** —— axios 拦截器、HTTP 错误码 → 用户提示映射
5. **性能与可访问性** —— 虚拟化、大表单、键盘可达性
6. **质量兜底** —— ESLint、Sonar、可测试、可回滚

AI 在前端阶段是**规范助手 + 代码生成器**：把契约转成 TS 类型 + API 函数、把 UI Spec 转成首版代码、把代码做 Sonar 自检。

---

## 二、AI 放大点（这个角色最该让 AI 干的事）

| 任务 | 为什么适合 AI | 典型提示词信号 |
|---|---|---|
| API 契约 → TS 类型 | 模板化 | "用 swagger-typescript-api 从契约片段（或后端导出的 OpenAPI）生成 src/api/types.ts" |
| UI Spec → 首版页面 | 模式匹配 | "基于 UI Spec §4 组件清单 + §3 交互流程，生成 crud-page 首版代码" |
| Sonar 自检 | 跨规则匹配 | "对照 Sonar 阈值清单" |
| 跨模块影响分析 | 跨文件检索 | "改 [函数 X]，列出所有引用方和影响范围" |
| 写 ADR | 结构化输出 | "把本方案的关键决策写成 ADR" |
| 错误处理统一 | 模板化 | "基于 api-request 技能，统一本项目错误处理策略" |

---

## 三、判断红线（AI 不能干的部分）

| 判断 | 为什么必须人 |
|---|---|
| **接口变更** | 影响后端 / 调用方（必须升契约 v2） |
| **新增依赖** | 影响整个项目生命周期 |
| **跨团队协议** | 涉及外部系统 |
| **线上事故应急** | 需基于完整监控/日志判断 |
| **代码签字（PR 合入）** | 责任归属 |

---

## 四、阶段产物清单

```markdown
前端技术方案 v[N] - [功能名]
├─ 1. 接口消费清单（与契约对齐）
├─ 2. 前端目录结构（页面 / 组件 / store / api / types）
├─ 3. 状态管理边界
├─ 4. 关键技术决策（选了什么 / 不选什么 / 为什么）
├─ 5. 错误处理策略
├─ 6. 性能与可访问性
├─ 7. 测试策略
├─ 8. 上线与回滚
├─ 9. 代码 + 自检报告
├─ 10. 签字 + 版本号
└─ 11. 给 QA/产品的下一步指令
```

---

## 五、调用 AI 的最小提示词模板

> 完整模板见 [`../prompts/stages/05-dev-frontend.md`](../prompts/stages/05-dev-frontend.md)。

骨架：

```markdown
# 角色
你是熟悉 [Vue 3 + Vite + TS + jurassic-ui 2.x] 的前端架构师。
你严守契约：你只能消费 design-contract.md 中已定义的接口。

# 当前阶段
前端开发。我要把 API 契约 v1 + UI Spec 转成前端技术方案 v1 + 首版代码。

# 输入物
- API 契约 v1：[链接]
- UI Spec v1：[链接]
- 项目上下文：[前端项目名（仓库名，如 oio-master-web）、技术栈、涉及目录]

# 必须读取
- 使用方本地项目规则：该项目总览
- rules/frontend/lang/vue.md
- rules/frontend/eng/sonar.md
- rules/frontend/eng/security.md
- skills/frontend/crud-page
- skills/frontend/api-request
- skills/frontend/sonar
- skills/frontend/quality-review

# 验收口径
- 契约消费：每个调用都在 design-contract.md 中定义；不私自改路径/字段
- 代码质量：Prettier + ESLint + Sonar 通过
- 自检清单全勾

# 反例
- 不要超出 API 契约范围
- 不要硬编码中文/魔法数字
- 不要碰 .env / 凭据 / 密钥
- 不要替人提交代码
```

---

## 六、与下游的衔接

前端开发完成后，与后端同步进入 QA：

```markdown
执行 checklist：
- [ ] 从 main 拉新分支（命名：feat/<功能简写>）
- [ ] 提交粒度：每个 commit 一个逻辑闭环
- [ ] 每写完一个文件跑：prettier + eslint
- [ ] 写完跑：type-check（如项目支持）
- [ ] 写完跑：Sonar（用 MCP）
- [ ] 写完跑：相关单元测试
- [ ] PR 描述对照前端技术方案第 1、4 节
- [ ] 自检清单按 change-review §二 全部勾选
- [ ] 与后端同步联调
```

---

## 附录：常用 AI 提示词片段

| 场景 | 提示词片段 |
|---|---|
| 契约 → TS 类型 | "用 swagger-typescript-api 从契约片段（或后端导出的 OpenAPI）生成 src/api/types.ts" |
| UI Spec → CRUD 首版 | "基于 UI Spec §4 组件清单 + §3 交互流程，生成 crud-page 首版代码（用 crud-page 技能）" |
| Sonar 自检 | "对照 Sonar 阈值清单（Bug=0 / 认知复杂度≤15 / 重复率<3%）" |
| 改函数影响分析 | "列出 [函数 X] 在 [项目名（仓库名）] 的所有引用" |
| 写 ADR | "把本方案的关键技术决策写成 ADR（背景/选项/决策/后果）" |
| 性能优化 | "本页列表 1000+ 行，给出虚拟化方案（vue-virtual-scroller 或 vxe-table）" |
| 错误处理 | "基于 api-request 技能，统一本项目的错误处理策略" |