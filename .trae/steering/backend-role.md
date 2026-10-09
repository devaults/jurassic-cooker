# 角色卡：后端架构师

> 主导阶段：**后端开发（阶段 4）**。负责把 API 契约 v1 转成可运行的后端服务 + 自研代码 + PR。

---

## 一、这个角色是谁

后端架构师的核心不是"写代码"，而是：

1. **契约实现** —— 把 `API 契约 v1` 中的接口落成可调用的服务
2. **事务与并发** —— 划清 `@Transactional` 边界、锁的范围
3. **数据建模** —— Entity、索引、迁移脚本
5. **错误处理** —— `@RestControllerAdvice`、业务异常码体系
7. **安全** —— SQL 注入、鉴权、密钥管理、日志脱敏
8. **可观测性** —— 日志（traceId）、监控、告警

AI 在后端阶段是**规范助手 + 代码生成器**：把契约转成 Entity/Service/Controller、把代码做 Sonar 自检。

---

## 二、AI 放大点（这个角色最该让 AI 干的事）

| 任务 | 为什么适合 AI | 典型提示词信号 |
|---|---|---|
| API 契约 → Entity/DTO | 模式匹配 | "基于 design-contract.md 生成 Entity / DTO 类" |
| API 契约 → Service 接口 | 模板化 | "基于契约生成 Service 接口方法 + 实现" |
| API 契约 → Controller | 模板化 | "基于契约生成 @RestController，每个接口一个方法" |
| Sonar 自检 | 跨规则匹配 | "对照 Sonar 阈值清单" |
| 事务边界设计 | 模式匹配 | "分析本 service 的事务边界（避免远程调用吞事务）" |
| 跨模块影响分析 | 跨文件检索 | "改 [函数 X]，列出所有引用方和影响范围" |
| 写 ADR | 结构化输出 | "把本方案的关键决策写成 ADR" |
| SQL 优化 | 模式匹配 | "EXPLAIN 该查询，给出索引与写法优化建议" |
| 错误处理统一 | 模板化 | "基于 @RestControllerAdvice 统一业务异常码" |

---

## 三、判断红线（AI 不能干的部分）

| 判断 | 为什么必须人 |
|---|---|
| **数据库 schema 变更** | 高风险，需 review + 迁移方案 |
| **新增服务/拆分链路** | 架构层决策，影响部署 |
| **接口变更** | 影响其他模块/调用方（必须升契约 v2） |
| **跨团队协议** | 涉及外部系统 |
| **线上事故应急** | 需基于完整监控/日志判断 |
| **代码签字（PR 合入）** | 责任归属 |

---

## 四、阶段产物清单

```markdown
后端技术方案 v[N] - [功能名]
├─ 1. 接口实现清单（与契约对齐）
├─ 2. 数据模型（Entity / DTO）
├─ 3. 后端目录结构（controller / service / mapper / entity / config）
├─ 4. 事务与并发边界
├─ 5. 关键技术决策（选了什么 / 不选什么 / 为什么）
├─ 6. 缓存与性能
├─ 7. 安全（SQL 注入 / 鉴权 / 密钥 / 脱敏）
├─ 8. 错误处理策略（@RestControllerAdvice / 业务码）
├─ 9. 测试策略（service >80% / controller happy + 2 异常）
├─ 10. 上线与回滚（迁移脚本 / 灰度）
├─ 11. 签字 + 版本号
└─ 12. 给 QA/前端的下一步指令
```

---

## 五、调用 AI 的最小提示词模板

> 完整模板见 [`../prompts/stages/04-dev-backend.md`](../prompts/stages/04-dev-backend.md)。

骨架：

```markdown
# 角色
你是熟悉 [Java 17 + Spring Boot 3 + MyBatis-Plus + MySQL 8] 的后端架构师。
你严守契约：你只能实现 design-contract.md 中已定义的接口——不能擅自加字段、改错误码。

# 当前阶段
后端开发。我要把 API 契约 v1 转成后端技术方案 v1 + 首版代码。

# 输入物
- API 契约 v1：[链接]
- PRD v[N]：[链接]
- UI Spec v[N]：[链接]
- 项目上下文：[后端项目名（仓库名）、技术栈、涉及目录]

# 必须读取
- 使用方本地项目规则：该项目总览（错误码约定 / 包约定 / 鉴权方式）
- rules/backend/lang/java.md
- rules/backend/lang/sql.md
- rules/backend/eng/security.md
- rules/backend/eng/sonar.md

# 验收口径
- 契约对齐：每个接口都在 design-contract.md 中定义
- 代码质量：ESLint/Sonar/PMD 通过
- 自检清单全勾

# 反例
- 不要超出 API 契约范围（私自加接口 = 违规）
- 不要碰 .env / 凭据 / 密钥
- 不要替人提交代码
- 不要直接修改已上线的 SQL
```

---

## 六、与下游的衔接

后端开发完成后，与前端同步进入 QA：

```markdown
执行 checklist：
- [ ] 从 main 拉新分支（命名：feat/<功能简写>）
- [ ] 提交粒度：每个 commit 一个逻辑闭环
- [ ] 每写完一个文件跑：checkstyle + pmd
- [ ] 写完跑：mvn verify
- [ ] 写完跑：Sonar（用 MCP）
- [ ] 写完跑：相关单元测试 + 集成测试
- [ ] PR 描述对照后端技术方案第 1、4、5 节
- [ ] 自检清单按 change-review §二 全部勾选
- [ ] 与前端同步联调（前后端并行开发场景）
```

---

## 附录：常用 AI 提示词片段

| 场景 | 提示词片段 |
|---|---|
| 契约 → Controller | "基于 design-contract.md 每个接口生成 @RestController 方法（springdoc-openapi 注解）" |
| 事务边界 | "分析本 service 的 @Transactional 边界（避免远程调用吞事务）" |
| SQL 注入 | "扫一遍 mapper，#{} vs ${} 是否合规" |
| 索引优化 | "EXPLAIN 该查询，给出索引设计" |
| 错误处理 | "统一 @RestControllerAdvice 业务异常码与 HTTP 映射" |
| 写 ADR | "把本方案的关键技术决策写成 ADR（背景/选项/决策/后果）" |