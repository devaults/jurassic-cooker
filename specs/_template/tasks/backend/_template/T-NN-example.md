# T-NN · <任务名（动词开头）>

> 单任务卡片 · 引用：本目录 [README.md](./README.md) 第 1 节「任务索引」。
> **tier**: backend

## 0. 元信息

| 项 | 值 |
|---|---|
| 任务 ID | `T-NN` |
| **tier** | `backend` |
| 关联契约 | `../../design-contract.md` §`<章节号>` |
| 关联技术方案 | `../../tech-solution-backend.md` §`<章节号>` |
| 依赖 | `T-NN` / `T-MM` / — |
| 改动项目 | `<后端仓库名>`（注册表键最后一段，不写 `group/` 前缀） |
| 改动文件 | `src/main/java/...` |
| 验证方式 | 命令 + 期望输出 / 手测步骤 |
| 状态 | ⬜ 待开始 / 🟡 进行中 / ✅ 已完成 |

---

## 1. 任务描述

> 用一两句话讲清：要改什么、为什么、做完是什么样。

## 2. 改动计划

| 文件 | 改动点 |
|---|---|
| `<Entity>.java` | 新增字段 / 调整索引 |
| `<Service>.java` | 实现业务逻辑 |
| `<Controller>.java` | 接口路径映射 |
| `<Mapper>.java` + `<Mapper>.xml` | SQL 写法 |
| `flyway/V<YYYYMMDD>__<feature>.sql` | 数据库迁移 |

## 3. 自检（交卷前）

> 这是单任务内的自检；全局自检见 [README.md §3](./README.md#3-全局自检)。

### 边界条件
- [ ] 空值（null/undefined/""/[]/{}）有防御
- [ ] 极值（0、负数、超大数据集、超长字符串）有处理
- [ ] 分页参数边界（page = 0 / pageSize 超限）
- [ ] 数据库必填字段校验（@NotNull / @Valid）

### 事务与并发
- [ ] @Transactional 边界清晰（不在事务内远程调用）
- [ ] 锁范围最小化（不锁无关表）
- [ ] 幂等性设计（防重提交 / 唯一索引）

### 资源清理
- [ ] 数据库连接归还（连接池自动管理）
- [ ] Statement/ResultSet 关闭（try-with-resources）
- [ ] 文件流 / IO 流关闭
- [ ] 临时文件清理

### 错误处理
- [ ] 全局异常处理器（@RestControllerAdvice）
- [ ] catch 块非空（不静默吞错）
- [ ] JSON 解析有 try-catch
- [ ] 用户提示与错误码映射完整

### 安全
- [ ] MyBatis 用 #{}（不用 ${}）
- [ ] 敏感信息不打日志（身份证 / token / 密码）
- [ ] 接口权限注解（@PreAuthorize）

### 数据库
- [ ] 索引设计（外键 / 高频查询字段）
- [ ] 大表分页（避免 OFFSET 大数字）
- [ ] 慢 SQL 已分析（EXPLAIN）

### 回归
- [ ] 改动 service / mapper 被其他模块引用？已确认无影响
- [ ] 删除代码确认无引用

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
T-NN ✅ 已完成 @后端名 YYYY-MM-DD
```