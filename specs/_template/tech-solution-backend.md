# <功能名> · 后端技术方案（阶段四）

> **阶段四产物**·
> 主导角色：[`backend-role.md`](${rel.cooker}/.trae/steering/backend-role.md) ·
> 对应提示词：[`04-dev-backend.md`](${rel.cooker}/.trae/prompts/stages/04-dev-backend.md)
>
> **输入**：API 契约 v1（已签字）·**不写前端代码**。

## 0. 元信息

| 项 | 值 |
|---|---|
| 上游契约 | `design-contract.md` v1（已签字） |
| 后端项目路径 | `<服务名>[/<项目内相对路径>]`（例：`<服务名>` / `<服务名>/src/main/java/<包路径>`；**仓库名 = 注册表键最后一段，不写 `group/` 前缀**） |
| 技术栈 | `<Java 17 + Spring Boot 3 + MyBatis-Plus + MySQL 8 / 或其它>` |
| 涉及模块 | `<目录/包>` |
| 状态 | `草稿 / 进行中 / 已签字` |
| 文档版本 | `v0.1` |
| 代码 commit SHA | `<PR 合并后回填：abc1234>`（用于 QA / 上下游精准定位实现版本） |

---

## 1. 接口实现清单

> 与 `design-contract.md` §1 一一对应；不私自加接口。

| # | 路径 / 方法 | service 方法 | controller 路径映射 | 错误码覆盖 | 关联 DTO |
|---|---|---|---|---|---|
| 1 | `GET /api/v1/<resource>` | `<Service>.list(<Query>)` | `<Controller>.list` |  |  |
| 2 | `POST /api/v1/<resource>` | `<Service>.create(<Request>)` | `<Controller>.create` |  |  |
| 3 | `GET /api/v1/<resource>/:id` | `<Service>.get(<Id>)` | `<Controller>.get` |  |  |
| 4 | `PUT /api/v1/<resource>/:id` | `<Service>.update(<Id>, <Request>)` | `<Controller>.update` |  |  |
| 5 | `DELETE /api/v1/<resource>/:id` | `<Service>.delete(<Id>)` | `<Controller>.delete` |  |  |

## 2. 数据模型

### 2.1 Entity

| 字段 | 类型 | 注解 | 索引 | 说明 |
|---|---|---|---|---|
| `id` | `Bigint` | `@TableId(type = IdType.ASSIGN_ID)` | PK | 雪花 ID |
| `<field>` |  |  |  |  |

### 2.2 DTO

- `Request`（入参，含 `@NotNull` / `@Valid`）
- `Response`（出参）
- `ListItem`（列表项精简）

### 2.3 关系

- 一对多 / 多对多：…
- 外键约束：…

## 3. 后端目录结构

```
src/main/java/<group>/<artifact>/
├── controller/         # @RestController，每个契约接口一个方法
├── service/             # 业务逻辑
│   ├── impl/            # 实现
│   └── dto/             # DTO 类
├── mapper/              # MyBatis-Plus Mapper
├── entity/              # Entity（数据库表映射）
├── config/              # 配置类（鉴权 / OpenAPI / Redis …）
├── exception/           # 业务异常 + 全局处理器
├── enums/               # 业务枚举（错误码等）
└── util/                # 工具类
```

## 4. 事务与并发边界

| service 方法 | 事务边界 | 锁 | 幂等性 |
|---|---|---|---|
| `<Service>.create` | `@Transactional(rollbackFor = Exception.class)` | — | 唯一索引 |
| `<Service>.update` | 同上 | 乐观锁 `@Version` |  |
| `<Service>.delete` | 同上 | — | 逻辑删除 |

> ⚠️ **事务内不远程调用**：RPC / HTTP 必须在事务外；否则吞事务

## 5. 关键技术决策

| 决策 | 选择 | 理由 | 备选 | 风险 |
|---|---|---|---|---|
| ORM | MyBatis-Plus | 团队习惯 / 项目已有 | JPA |  |
| 缓存 | Redis（Caffeine 本地） | 高频读 | 仅 Redis |  |
| ID 策略 | 雪花 | 全局唯一 | UUID |  |
| 接口签名 | springdoc-openapi | 自动同步 OpenAPI | 手写 |  |

## 6. 缓存与性能

- **缓存场景**：<如：查询热门资产列表>
- **缓存键**：`<key 模板>`
- **TTL**：<时长>
- **击穿 / 穿透 / 雪崩**：<处理策略>
- **慢 SQL**：<已 EXPLAIN 验证>

## 7. 安全

- **SQL 注入**：所有 mapper 用 `#{}`，不用 `${}`
- **鉴权**：`@PreAuthorize("hasAuthority('xxx:list')")` 或自定义注解
- **敏感信息**：日志脱敏（身份证 / token / 密码）
- **密钥管理**：`<Vault / KMS / 环境变量>`，**不进 git**

## 8. 错误处理策略

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(BizException.class)
    public Result<Void> handleBiz(BizException e) {
        return Result.fail(e.getCode(), e.getMessage());
    }
    // 兜底：未知异常 → 500
}
```

- 业务异常码定义在 `enums/ErrorCode.java`
- HTTP 错误码 → 业务码映射见 `design-contract.md` §5

## 9. 测试策略

- **单元测试**（service 层 > 80% 覆盖）：JUnit 5 + Mockito
- **集成测试**（关键 service + mapper）：Testcontainers / H2
- **API 测试**（每个契约接口 1 happy + 2 异常）：MockMvc

## 10. 上线与回滚

> **上线动作（部署 / 灰度 / 正式发布）由使用方本地的上线流程决定**，**不在 QA 验收范围**。本节只写"QA 通过后**待执行**的上线步骤"，由上线执行方在 QA 通过后按下表执行。

- **数据库迁移**：Flyway 脚本 `V<YYYYMMDD>__<feature>.sql`
- **灰度**：<如：Nginx 按用户 ID 灰度>
- **回滚**：<SQL 逆向 + service 回滚>

---

## 签字与版本

```markdown
后端技术方案 v0.1 ✅ 已签字 @后端名 YYYY-MM-DD
- 范围：
- 不做：
- 风险：
```

---

## 下游衔接

- 与前端并行开发（依赖契约 v1）
- 同步 OpenAPI 实现给前端做联调
- 完成后与前端同步进入阶段 6 QA（见 `./qa/README.md`）