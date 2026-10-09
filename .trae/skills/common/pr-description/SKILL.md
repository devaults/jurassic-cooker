---
name: pr-description
description: >-
  Pull Request description template for any language/framework. Use when
  creating a PR (GitHub/GitLab/Gitee), writing the PR body, filling the
  template before review, or reviewing someone else's PR description.
  Covers the unified PR body structure (背景/改动点/自检/测试/风险/关联),
  title rules, how to fill the checklist, and the "screenshot/video"
  expectations. Frontend-only PRs may also reference the frontend git-pr
  skill; this skill is the cross-stack baseline.
version: 1.0.0
status: stable
owner: "@jurassic-cooker-team"
updated: 2026-10-07
deprecated: false
---

# PR 描述模板（跨端通用）

> 适用于任何项目（前端 / 后端 / 脚本 / 文档），与具体代码库无关。
> 前端专项流程（Vue/TS/Sonar）见 `skills/frontend/git-pr/SKILL.md`。

---

## 0. 为什么用统一模板

- **评审者** 5 分钟能扫完一份 PR
- **作者** 不会漏写关键信息（自检 / 截图 / 关联 Issue）
- **合并后** CHANGELOG / release notes 可从 PR 自动生成
- **审计** 任何功能都可回溯到"为什么改 / 怎么改 / 验过没"

---

## 1. PR 标题规则

### 1.1 格式

```
[<type>] <scope>: <中文 subject>             # 中文项目
[<type>] <scope>: <imperative subject>       # 英文项目
```

**例子**：

```text
[feat] user: 用户列表支持按角色筛选
[fix] api: 修复 401 跳转后丢失 query 参数
[refactor] store: 抽公共 useRequest 组合式函数
[docs] readme: 补安装步骤
```

### 1.2 5 条硬规则

1. **≤ 72 字符**（与提交信息一致）
2. **首字母不大写**（英文 subject）
3. **不加句号**
4. **type 用 Conventional Commits 的 9 种**（见 `git-commit-style` 技能）
5. **scope 与改动子系统一致**（api/store/router/...）

---

## 2. PR 描述模板（复制即用）

```markdown
## 背景

<!-- 1-3 句话说清：为什么要做这个 PR / 解决什么问题 / 关联哪个 Issue -->

- 关联 Issue：#<编号>（必填；如无则填"无"）
- 关联 spec：specs/<domain>/<feature>/（必填；如无则填"无"）
- 需求来源：<产品需求 / Bug 反馈 / 内部重构>

## 改动点

<!-- 列出本次 PR 改动的核心点（不是 diff 复述） -->

- **核心改动 1**：<做了什么、为什么这么做>
- **核心改动 2**：<做了什么、为什么这么做>
- **核心改动 3**：<做了什么、为什么这么做>

## 改动文件清单

<!-- 按文件类型分组列；改动文件少时可省略 -->

- `src/api/<module>/` — 新增 / 修改
- `src/views/<page>/` — 新增
- `src/store/<module>.ts` — 新增
- `tests/` — 补单测

## 自检

<!-- 逐项勾；不勾的删掉对应行；新增项自行加 -->

- [ ] **边界**：空值 / 极值 / 异步回调卸载 / 深层属性 `?.`
- [ ] **内存**：本任务内的事件监听 / 定时器 / Observer 已注销
- [ ] **错误**：API 有 catch 且用户可感知 / catch 非空 / `JSON.parse` 有 try-catch
- [ ] **安全**：`v-html` 经 DOMPurify / 不打印敏感信息 / 外链 `noopener noreferrer`
- [ ] **回归**：本任务改动函数与公共工具的影响面已确认
- [ ] **i18n**（如有 UI）：中英文同步（不在代码里硬编码中文）
- [ ] **数据库**（如有 schema 变更）：Flyway / Liquibase 脚本就绪
- [ ] **配置**（如有配置变更）：`.env.example` 同步更新

## 测试

<!-- 列出实际跑过的命令与结果；没跑过的不要写 -->

| 命令 | 结果 |
|---|---|
| `npm run lint` | ✅ 0 errors |
| `npm run type-check` | ✅ pass |
| `npm test` | ✅ 22/22 pass |
| `npm run build` | ✅ dist 生成成功 |

手测路径（如有）：

1. 打开 `<URL>` → 步骤 1 → 步骤 2 → 期望结果
2. ...

## 截图 / 视频

<!-- UI 改动必填；后端 / 文档可填"无" -->

- 关键路径 1：![](附件 URL)
- 关键路径 2：![](附件 URL)
- 异常路径：![](附件 URL)

## 风险与回滚

- **风险**：<数据库变更 / 接口变更 / 性能影响 / 兼容影响>
- **回滚步骤**：<revert PR / 关 feature flag / 数据迁移逆向 SQL>

## 评审重点

<!-- 给评审者的提示：哪些点需要重点看 / 哪些是可选 -->

- **重点看**：<核心改动 1 的实现是否合理>
- **可选看**：<UI 细节 / 命名 / 注释>
- **可忽略**：<自动生成的代码 / 锁文件 / 测试 fixture>

## 关联

- spec：specs/<domain>/<feature>/
- 上游 PR：#<编号>（如有）
- 文档：<链接>
```

---

## 3. 各节填写要点

### 3.1 背景

| ✓ 好 | ✗ 差 |
|---|---|
| 修复 #123 用户反馈列表加载慢 | 优化性能 |
| PRD v1 §3.2 第 2 条验收项 | 实现新功能 |
| 接入 SSO 替代账号密码（参考 ADR-007） | 改登录方式 |

### 3.2 改动点

- **3-7 条**为佳；太少说明没总结、太多说明 PR 太大
- 每条用**做了什么 + 为什么**（不只是"做什么"）
- 涉及**架构决策**时附 ADR 链接

### 3.3 自检

- **必勾项**：边界、内存、错误、安全、回归（前端/后端通用 5 类）
- **按需勾**：i18n、数据库、配置、性能、权限
- **不勾项**：写明"未涉及"或"已确认无影响"

### 3.4 测试

- **没跑过的命令不要写**（"诚实"原则）
- 至少列：**lint / type-check / 单元测试 / build**
- UI 改动加：**手测路径 + 截图**

### 3.5 截图 / 视频

| 改动类型 | 是否必填 |
|---|---|
| UI 改动（新增/修改页面/组件/样式） | ✓ 必填 |
| 交互改动（动画/状态/弹窗/loading） | ✓ 必填 |
| 仅后端 | ✗ 可省 |
| 仅文档/配置 | ✗ 可省 |

### 3.6 风险与回滚

- 任何**有副作用**的改动（DB / 接口 / 配置）必须写
- 任何**灰度/回滚成本 > 30 分钟**的改动必须写

---

## 4. 评审节奏建议

| PR 体积 | 文件数 | 建议动作 |
|---|---|---|
| 小 | < 5 文件 | 1 个评审者，自审 + 1 reviewer |
| 中 | 5-20 文件 | 1 个评审者，1 个关联模块 owner |
| 大 | 20-100 文件 | 拆 PR / 2 个评审者 |
| 超大 | > 100 文件 | **必须拆**；先合 design 阶段产物 |

---

## 5. 反例（不该写的 PR 描述）

```diff
- 修复 bug
- 完成功能
- 更新代码
- WIP
- 修复了一些问题
- 见 commit 信息
- 自检全过
- 测试通过

+ 见上方模板的 8 个段落
```

---

## 6. 与提交信息的关系

| 维度 | 提交信息 | PR 描述 |
|---|---|---|
| 粒度 | 一次 commit | 整个 PR（可能多 commit） |
| 长度 | 1-3 行 | 1-2 屏 |
| 内容 | "改了什么" | "为什么改 / 怎么改 / 验过没" |
| 读者 | 自己 / git log 扫的人 | 评审者 / 后人 |
| 关系 | PR 描述可**引用** commit；不必复述 | |

---

## 7. 与本仓库其他技能的关系

- **commit 风格** → `skills/common/git-commit-style/SKILL.md`
- **前端专项 PR 流程**（含 Sonar 截图 / Jura 评审）→ `skills/frontend/git-pr/SKILL.md`
- **故障复盘文档**（事故后的根因分析）→ `skills/common/incident-postmortem/SKILL.md`
