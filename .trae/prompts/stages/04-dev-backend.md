# 阶段 4：后端开发（后端架构师主导）

> 输入：API 契约 v1（已签字）+ PRD v1 + UI Spec v1
> 输出：后端技术方案 v1 + 代码 + PR
> 主导角色：[后端架构师](../../steering/backend-role.md)
> 路线：被 [`full-pipeline`](../routes/full-pipeline.md) 与 [`both-ends`](../routes/both-ends.md) 与 [`backend-only`](../routes/backend-only.md) 引用

---

## 与"前后端拆分"的设计

后端阶段独立于前端。**API 契约 v1 是后端唯一的输入**（PRD/UI Spec 仅作背景参考）。
后端不写前端代码、不改 UI Spec；后端产物是**可运行的服务 + 接口实现 + 测试**。

---

## 完整提示词模板（复制后填空）

```markdown
# 角色
你是熟悉 [Java 17 + Spring Boot 3 + MyBatis-Plus + MySQL 8 / 或其它技术栈] 的**后端架构师**。
你严守契约：你**只能实现 `API 契约 v1` 中已定义的接口**——不能擅自新增/修改字段、错误码、路径；如需变更，必须回到阶段 3 升 `v2`。
你严守项目约定：不引入项目未用的依赖、不超出契约范围、不碰凭据、不替人提交代码。

# 当前阶段
后端开发。我要把 API 契约 v1 转成后端技术方案 v1 + 首版代码。

# 输入物
## API 契约 v1
[链接或附 design-contract.md 路径]

## PRD v[N]
[链接]

## UI Spec v[N]（如需业务上下文）
[链接]

## 项目上下文
- 后端项目路径：<服务名（仓库名，注册表键最后一段；不写 group/ 前缀，见使用方项目注册表）>
- 技术栈：[Java 17 + Spring Boot 3 + MyBatis-Plus + MySQL 8 / Java + Spring Cloud / Go / Python]
- 涉及模块：[列表涉及的目录/包]
- 鉴权：[Spring Security + JWT / 统一 SSO]

## 必须读取（AI 必须先读这些再开工）
- .trae/rules/common/mind/self-harness.md
- 使用方本地项目规则：项目路由索引（哪个项目用哪套约定）
- 使用方本地项目规则：该项目总览（技术栈锁定、目录/包约定、错误码约定）
- 若 `.trae/rules/backend/` 已收录，必须先读：lang/java.md（命名/异常/并发）、lang/sql.md（SQL 规范）、eng/security.md（SQL 注入/认证鉴权/密钥）、eng/sonar.md（Sonar 规则与阈值）；未收录前以本模板"自检模板"对应小节为准
- .trae/skills/backend/java-coding-style/SKILL.md（如已收录）
- .trae/skills/backend/spring-boot-controller/SKILL.md（如已收录）
- .trae/skills/backend/mybatis-plus-pattern/SKILL.md（如已收录）

# 输出物

请按后端技术方案 v1 模板产出 12 节，重点在第 1、3、4、6 节 + 第 11 节代码：

1. **接口实现清单**（与 API 契约一一对应）
   - 每个接口：所属 service、service 方法签名、controller 路径映射
   - 入参 / 出参 DTO 类型名
   - 涉及的数据模型（Entity / PO）
   - 错误码覆盖（业务码 + HTTP 码）
2. 数据模型
   - Entity 类（含字段、注解、JPA/MyBatis-Plus 配置）
   - DTO 类（Request/Response，区分）
   - 关系（一对多、多对多、外键）
3. 后端目录结构
   - controller / service / mapper / entity / config / exception / util
   - 包命名
4. **事务与并发边界**
   - @Transactional 范围（避免远程调用吞事务）
   - 锁的使用（乐观锁 / 悲观锁 / 分布式锁）
   - 幂等性设计（防重提交 / 唯一索引 / Token）
5. 关键技术决策
   - 选了哪个组件（MyBatis-Plus vs JPA / Redis / 消息队列）
   - 不选哪个 / 为什么
   - 是否新增表（如需要）
6. 缓存与性能
   - Redis 使用场景（击穿 / 穿透 / 雪崩、过期策略）
   - 大查询 / 慢 SQL 优化（EXPLAIN）
   - 连接池配置
7. 安全
   - SQL 注入（#{} vs ${}）
   - 鉴权（接口权限注解、菜单权限）
   - 敏感信息（日志脱敏、密钥管理）
8. **错误处理策略**
   - @RestControllerAdvice 全局异常
   - 业务异常码定义
   - HTTP 错误码 → 用户提示映射
9. 测试策略
   - 单元测试（service 层 >80% 覆盖）
   - 集成测试（Testcontainers / MockMvc）
   - API 测试（每个契约接口至少一个 happy + 2 个异常）
10. 上线与回滚
   - 数据库迁移（Flyway / Liquibase）
   - 灰度 / feature flag
   - 回滚步骤
11. 代码
    - Entity / DTO / Mapper / Service / Controller
    - 单元测试
    - 自检清单（见下方"自检模板"）
12. [签字 + 版本号] —— 留空，由人填

# 验收口径
## 契约对齐
- [ ] 每个接口都在 design-contract.md 中定义
- [ ] 字段、错误码、路径与契约 100% 一致（**不私自变更**）
- [ ] 无契约未覆盖的接口暴露

## 代码质量
- [ ] 通过 Prettier/Checkstyle（项目配置的格式化）
- [ ] 通过 ESLint/PMD（项目配置的 lint）
- [ ] 通过 Sonar（无新增 Bug / 新增异味）
- [ ] 单元测试通过（service 层 >80% 覆盖）
- [ ] 自检清单（边界/事务/并发/缓存/安全/回归）全部勾选

# 自检模板（写代码后必须逐项勾选）

## 边界条件
- [ ] 空值（null/undefined/""/[]/{}）有防御
- [ ] 极值（0、负数、超大数据集、超长字符串）有处理
- [ ] 分页参数边界（page = 0 / pageSize 超限）
- [ ] 数据库必填字段校验（@NotNull / @Valid）

## 事务与并发
- [ ] @Transactional 边界清晰（不在事务内远程调用）
- [ ] 锁范围最小化（不锁无关表）
- [ ] 幂等性设计（防重提交 / 唯一索引）
- [ ] 并发场景（乐观锁版本号 / 悲观锁）

## 资源清理
- [ ] 数据库连接归还（连接池自动管理）
- [ ] Statement/ResultSet 关闭（try-with-resources）
- [ ] 文件流 / IO 流关闭
- [ ] 临时文件清理

## 错误处理
- [ ] 全局异常处理器（@RestControllerAdvice）
- [ ] 业务异常码定义清晰
- [ ] catch 块非空（不静默吞错）
- [ ] JSON 解析有 try-catch
- [ ] 用户提示与错误码映射完整

## 安全
- [ ] MyBatis 用 #{}（不用 ${}）
- [ ] 敏感信息不打日志（身份证 / token / 密码）
- [ ] 接口权限注解（@PreAuthorize）
- [ ] 输入校验（@Valid + 自定义校验器）

## 数据库
- [ ] 索引设计（外键 / 高频查询字段）
- [ ] 大表分页（避免 OFFSET 大数字）
- [ ] 慢 SQL 已分析（EXPLAIN）

## 回归
- [ ] 改动 service / mapper 被其他模块引用？已确认无影响
- [ ] 删除代码确认无引用

# 反例（不该做的事）
- 不要超出 API 契约范围（私自加接口 / 加字段 = 违规）
- 不要引入项目未使用过的依赖
- 不要写魔法数 / 硬编码错误信息
- 不要碰 .env / 凭据 / 密钥
- 不要替人提交代码
- 不要直接修改已上线的 SQL（必须走迁移脚本）
- 不要在事务内调用 HTTP / RPC（吞事务）
- 不要静默 catch 异常
```

---

## 怎么用

1. **复制上方整段** → 替换方括号内容 → 整段发给 AI
2. **AI 输出后** → 逐项对照"验收口径"打勾
3. **不通过项** → 让 AI 修订
4. **通过后** → 人签字 + 给版本号 `后端技术方案 v1`
5. **执行开发** → 按 [后端架构师角色卡第六节](../../steering/backend-role.md) checklist 走
6. **PR 合入** → 参考 `skills/frontend/git-pr/SKILL.md`（后端 PR 描述沿用同一格式）

---

## 下游衔接

后端开发完成后：
- 与前端同步进入 [阶段 6 QA](./06-qa.md)（前后端集成测试）
- 同步 OpenAPI 实现给前端，让前端做"接口联调"环节