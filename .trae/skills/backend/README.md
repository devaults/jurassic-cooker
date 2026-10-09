# skills/backend/ — 后端专属技能（待补）

> ⚠️ **占位目录**：当前为空。后端技能补齐后会放在这里。

## 当前状态

- **技能数**：0
- **维护负责人**：待定

## 计划收录的技能（TODO）

> 仅当某个流程**仅后端相关**且**正文较长**时才放到这里；其余放 frontend 或 common。
> 方向假设与 [`../../RULE.md`](../../RULE.md) 第一节 `backend/` 的"默认技术方向"一致（**Java + Spring Boot 生态**）。

| 候选技能 | 主题 | 触发条件 |
|---|---|---|
| `java-coding-style` | Java 命名/异常/并发/集合/泛型/Optional/Stream | 任何 Java 代码改动 |
| `spring-boot-controller` | `@RestController` 写法、参数校验、Swagger 注解、Knife4j 暴露 | 写接口 |
| `mybatis-plus-pattern` | BaseMapper、LambdaQueryWrapper、逻辑删除、自动填充、分页 | MyBatis-Plus 相关 |
| `spring-data-jpa-pattern` | Repository 写法、`@Query`、实体关系、N+1 问题 | JPA 相关 |
| `spring-security-jwt` | SecurityConfig 链、JWT 过滤器、刷新 Token、权限注解 | 鉴权模块 |
| `global-exception-handler` | `@RestControllerAdvice`、业务异常码、错误响应统一 | 全局异常处理 |
| `dockerfile-multi-stage` | JDK 镜像选择、构建缓存、非 root 用户、健康检查 | Dockerfile 编写 |
| `api-versioning` | URL 路径版本 vs Header 版本、迁移策略 | 接口版本变更 |
| `mysql-index-design` | 索引选型、慢查询分析、EXPLAIN 用法 | 性能调优 |
| `springdoc-openapi` | `springdoc-openapi` 注解规范、Knife4j 接入、文档分组 | API 文档 |
| `maven-multi-module` | parent/child 拆分、依赖管理、版本锁定 | 多模块项目 |
| `logback-config` | Logback 配置、`MDC` traceId、日志滚动与归档 | 日志规范 |
| `observability-setup` | Prometheus 指标、SkyWalking 接入、健康检查端点 | 监控接入 |
| `testcontainers-junit5` | Testcontainers 集成测试、JUnit 5 生命周期 | 集成测试 |
| `transactional-boundary` | `@Transactional` 范围、传播行为、避免远程调用 | 事务相关 |

## 不收录的内容

- 前端相关技能（Vue/React/Jura） → [`../frontend/`](../frontend/)
- 跨端通用技能（Git/Markdown/PR） → [`../common/`](../common/)
- 单文件 ≤ 50 行的短流程 → [`../../templates/`](../../templates/)

## 补齐流程

1. 在本目录下新建 `skills/<kebab-case-name>/SKILL.md`
2. SKILL.md 必须含 `name` + `description` frontmatter
3. 在 [`../../SKILL.md`](../../SKILL.md) 的路由表 P1 区域登记
4. 在 [`../../CHANGELOG.md`](../../CHANGELOG.md) 追加一条