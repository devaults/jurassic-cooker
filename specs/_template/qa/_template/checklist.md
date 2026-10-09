# <功能名> · 验收对照清单

> 把上游 `requirements.md` §6「验收清单」与 `design-ui.md` §8「走查 checklist」逐条展开。
> 配合 [README.md](./README.md) 使用；每条结论在本表勾选。

---

## 0. 运行前置（前端用例）

> 跑前端 E2E / 手测前先确认；地址与登录方式见 [README.md](./README.md) §0.1「运行环境」。

- [ ] 访问地址（URL）已确认，可正常打开：`<http://<host>:<port>/<path>>`
- [ ] 确认所用为**测试环境**，未使用正式（生产）环境地址
- [ ] 如需登录：已由**人工接管**完成登录（账号密码不入库），并从 `<登录后入口>` 继续访问目标页
- [ ] 账号权限覆盖本次验收点（有权限 / 无权限两种都测）

---

## A. 需求验收（requirements.md §6）

| # | 验收点 | 验收步骤 | 期望 | 实际 | 通过 |
|---|---|---|---|---|---|
| AC-1 |  |  |  |  | ⬜ |
| AC-2 |  |  |  |  | ⬜ |

---

## B. 设计走查（design-ui.md §8）

### B.1 视觉

- [ ] 间距一致：`spacing.xs/sm/md/lg/xl`
- [ ] 字号一致：`fontSize.sm/md/lg/xl`
- [ ] 颜色一致：`text.primary / text.secondary / brand.primary`
- [ ] 无魔法值

### B.2 交互

- [ ] hover 反馈
- [ ] focus 反馈
- [ ] disabled 反馈
- [ ] loading 反馈
- [ ] error 反馈

### B.3 可访问性

- [ ] 键盘可达（Tab 顺序合理）
- [ ] 对比度 ≥ 4.5:1
- [ ] aria-label 完整
- [ ] 表单有 label

### B.4 边界

- [ ] 空数据展示
- [ ] 极值（0 / 负数 / 超大数量 / 超长文本）
- [ ] 错误状态
- [ ] 并发场景

---

## C. 接口契约验收（design-contract.md v1）

| # | 验收点 | 期望 | 实际 | 通过 |
|---|---|---|---|---|
| IC-1 | 每个契约接口均有日志（前后端均实现） |  |  | ⬜ |
| IC-2 | 字段名 / 类型 / 必填 与 v1 100% 一致 |  |  | ⬜ |
| IC-3 | 错误码覆盖（HTTP + 业务码）实测 |  |  | ⬜ |
| IC-4 | 鉴权实测（401 / 403） |  |  | ⬜ |
| IC-5 | 无契约未覆盖的接口暴露 |  |  | ⬜ |
| IC-6 | 无契约未定义字段被消费 |  |  | ⬜ |

---

## D. 非功能需求（requirements.md §7）

| 维度 | 指标 | 实测 | 通过 |
|---|---|---|---|
| 性能 |  |  | ⬜ |
| 安全 |  |  | ⬜ |
| 兼容 |  |  | ⬜ |

---

## E. 前端实现验收（tier: frontend）

> 仅在 tier=frontend 任务有改动时跑；本节给前端 QA 独立勾选。

### E.1 UI 实现

- [ ] 与 `design-ui.md` §4 组件清单一致（不私自换组件）
- [ ] 视觉走查（视觉 / 交互 / 可访问性 / 边界）全勾
- [ ] i18n 中英文完整

### E.2 自检清单（5 类）

- [ ] 边界（空值 / 极值 / 异步回调卸载 / 深层属性）
- [ ] 内存（事件监听 / 定时器 / Observer / $on）
- [ ] 错误（API catch / JSON.parse / catch 非空）
- [ ] 安全（v-html / console.log / 外链 / URL encode）
- [ ] 回归（公共函数 / composable / 删除代码）

### E.3 Vue/React 专项

- [ ] v-for 唯一 key / v-if 与 v-for 不在同元素
- [ ] prop 定义完整 / TS 类型完整

### E.4 质量门禁

- [ ] Prettier 通过
- [ ] ESLint 通过
- [ ] TypeScript 类型检查通过
- [ ] Sonar（用 MCP）：无新增 Bug / 异味

### E.5 契约消费

- [ ] 每个调用的接口都在 `design-contract.md` v1 中定义
- [ ] 类型用 `swagger-typescript-api` 生成

---

## F. 后端实现验收（tier: backend）

> 仅在 tier=backend 任务有改动时跑；本节给后端 QA 独立勾选。

### F.1 接口实现

- [ ] 每个接口都在 `design-contract.md` v1 中定义
- [ ] 字段、错误码、路径与契约 100% 一致
- [ ] 无私自新增 / 修改接口

### F.2 自检清单（6 类）

- [ ] 边界（空值 / 极值 / 分页 / 必填校验）
- [ ] 事务与并发（@Transactional 边界 / 锁 / 幂等）
- [ ] 资源清理（连接 / Statement / IO / 临时文件）
- [ ] 错误（@RestControllerAdvice / catch 非空 / JSON try-catch）
- [ ] 安全（#{} vs ${} / 鉴权 / 敏感信息脱敏）
- [ ] 回归（公共 service / mapper / 删除代码）

### F.3 质量门禁

- [ ] Checkstyle / PMD 通过
- [ ] Sonar（用 MCP）：无新增 Bug / 异味
- [ ] 单元测试（service 层 > 80% 覆盖）
- [ ] 集成测试通过

### F.4 数据库

- [ ] 索引设计（外键 / 高频查询字段）
- [ ] 大表分页（避免 OFFSET 大数字）
- [ ] 慢 SQL 已分析（EXPLAIN）
- [ ] Flyway 迁移脚本就绪

### F.5 安全

- [ ] MyBatis 用 #{}（不用 ${}）
- [ ] 敏感信息不打日志
- [ ] 接口权限注解（@PreAuthorize）
- [ ] 密钥管理（不进 git）

---

## 签字

```markdown
Checklist 完成 ✅ @QA名 YYYY-MM-DD
- 通过项：N / 总数 N
- 遗留项：见 qa/README.md §4
```

> **签署说明**：QA 跑 E / F 哪几节，取决于该功能改了哪几层。
> - 仅前端：E 全跑 + F 跳过
> - 仅后端：F 全跑 + E 跳过
> - 前后端都改：E + F 全跑
> - 仅改契约：C 跑（接口对齐）