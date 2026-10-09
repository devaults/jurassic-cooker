# 使用指南

> **面向**：任何想用 `jurassic-cooker` 驱动 AI 走完"需求→设计→开发→QA"的项目团队。
> **前置**：本框架是个**规范/计划生成器**，不写业务代码——业务代码落在使用方自己的项目仓库里。

---

## 0. 30 秒搞清定位

```
jurassic-cooker                       框架仓（你正在看的）
  └─ .trae/                            驱动 AI 的"技能 + 模板 + 提示词"
       ├─ skills/                      可被 AI 调用的能力模块
       ├─ templates/                   各类文档骨架
       ├─ prompts/                     六阶段提示词
       └─ config.yaml                  框架默认配置

<业务项目仓>                           你的业务代码仓（举例：oio-master-web）
  └─ .trae/config.local.yaml           (可选) 仅本机生效的覆盖配置
```

**核心循环**：你跟 AI 说"做 X" → AI 按 `.trae/` 里的提示词与技能生成本框架要求的**规范**/计划文件 → 你或团队在约定阶段签字 → 把**规范**/计划交给开发 AI 落地业务代码。

---

## 1. 第一步：处理 `.trae/config.local.yaml`

> 这一步**先于一切**。它决定本机"个人通道"（个人 spec / 个人 plan）的落点，不配就走不通个人通道。

### 1.1 找 / 建文件

`jurassic-cooker/.trae/config.local.yaml` 通常是**不存在**的（`.gitignore` 忽略它，不会入仓）。手动建一份：

```bash
touch .trae/config.local.yaml
```

### 1.2 填你的本机实际值

最小可用版（把 `/abs/path/...` 换成你机器上真实存在、可写的目录）：

```yaml
# 本机局部覆盖（.gitignore，不入库）
spec:
  # 个人通道外置根：
  #   个人 spec → <root>/specs/<YYYY-MM>/<slug>/
  #   个人 plan → <root>/plans/<YYYY-MM>/<slug>.md
  personal:
    root: /abs/path/to/your-knowledge-base
  # E2E 产物根（Playwright 截图 / 录屏 / trace）
  artifacts:
    e2e_root: /abs/path/to/e2e-artifacts
```

**两层规则**：
- `config.yaml` = 团队共享默认（**禁止写本机路径**）
- `config.local.yaml` = 本机覆盖（`.gitignore`，**尽情写**）

设了的键覆盖 `config.yaml` 同名键；没设的键回落默认值。文件全注释掉时行为与只读 `config.yaml` 一致。

---

## 2. IDE 的 Workspace 开发模式

> `jurassic-cooker` 是个**跨仓编排器**——一个会话里要能访问框架仓 + 业务仓 + 个人知识库仓，Cursor 的 **Workspace** 是为此而生的。

### 2.1 推荐的三仓 Workspace

把以下三个目录同时加进同一个 Cursor Workspace（File → Add Folder to Workspace...）：

| 目录 | 角色 | 必加？ |
|---|---|---|
| `<cooker 仓根>` | 框架本身（技能 / 模板 / 提示词） | ✅ 必加 |
| `<业务项目仓>` | 业务代码落点（如 `oio-master-web`） | ✅ 必加 |
| `<个人知识库仓>` | 个人通道 spec/plan 落点 | 视需求 |

加完后 `.code-workspace` 文件长这样：

```json
{
  "folders": [
    { "path": "/abs/path/to/jurassic-cooker" },
    { "path": "/abs/path/to/your-business-project" },
    { "path": "/abs/path/to/your-knowledge-base" }
  ]
}
```

### 2.2 工作流回路

```
┌─────────────────┐  ① 描述需求  ┌──────────────────────┐
│  你 (Product)   │ ──────────▶ │  Cursor Agent (cooker) │
└─────────────────┘             └──────────────────────┘
                                          │ ② 生成 spec/plan
                                          ▼
                                ┌──────────────────────┐
                                │ specs/ 或 <知识库>/  │
                                │  plans/  里的文件     │
                                └──────────────────────┘
                                          │ ③ 签字 / 升版
                                          ▼
                                ┌──────────────────────┐
                                │ 各阶段角色执行         │
                                │ UI/契约/技术方案/开发/QA│
                                └──────────────────────┘
                                          │ ④ 落地业务代码
                                          ▼
                                ┌──────────────────────┐
                                │  <业务项目仓>          │
                                └──────────────────────┘
```

---

## 3. 创建一个 Spec（规范）

> **Spec** = 一个需求从"模糊"到"可开发"的全套产物，对应**六阶段**。

### 3.1 两种通道

| 通道 | 落点 | 何时用 |
|---|---|---|
| **团队通道** | `<cooker 仓根>/specs/domains/<产品线>/<slug>/` | 正式产品需求，要走完六阶段、要签字 |
| **个人通道** | `<config.local.yaml:spec.personal.root>/specs/<YYYY-MM>/<slug>/` | 个人探索/练手/小工具，无需签字 |

### 3.2 触发方式

对 AI 说"做个 X"或"按六阶段做 X"——AI 会：

1. **判定通道**：根据需求范围问你是"团队"还是"个人"
2. **拉模板**：从 `specs/_template/` 拷贝 12 文件骨架到目标目录
3. **走阶段提示词**：按 `prompts/stages/01..06*.md` 逐阶段生成内容
4. **签字闸口**：每阶段结束要角色签字（`--check-signing` 检）

### 3.3 六个阶段速览

| 阶段 | 产出 | 角色 |
|---|---|---|
| 01 需求 | `01-product.md` | 产品 |
| 02 UI | `02-ui/design-ui.md` | UI 设计师 |
| 03 契约 | `03-contract/design-contract.md` | 接口架构师 |
| 04 技术方案 | `04-tech/{backend,frontend}.md` | 后端 / 前端架构师 |
| 05 开发 | 业务代码（落业务仓）| 前后端开发 |
| 06 QA | `06-qa/{README,checklist,test-cases}.md` | QA |

进度看板：`specs/_template/STATUS.md`（**全局唯一**，团队成员共享）记录每个 spec 的当前阶段。

### 3.4 软闸口：UI Spec 变更

进入阶段 5（开发）后，**任何** UI Spec 变更必须：
- 升 `design-ui.md` 版本号
- 通知**后端 + 接口架构师**（`design-contract.md` §6.1 联系人表）

不允许"口头说一下就改 UI"——后端可能已按旧 UI 写好接口。

---

## 4. 创建一个 Plan（计划）

> **Plan** = 单一目的的轻量文档，比如"调研 X 技术"、"临时修个 bug"、"实验 Y 方案"。

### 4.1 触发

对 AI 说"做个 plan：XXX"或"调研 XXX 给我个 plan"。

### 4.2 落点

| 通道 | 落点 |
|---|---|
| 团队 | `<cooker 仓根>/plans/<slug>.md` |
| 个人 | `<config.local.yaml:spec.personal.root>/plans/<YYYY-MM>/<slug>.md` |

### 4.3 与 Spec 的差别

| | Plan | Spec |
|---|---|---|
| 文件数 | 1 个 `.md` | 12 个文件骨架 |
| 阶段 | 不分阶段 | 六阶段 |
| 签字 | 不要 | 要 |
| 适用 | 调研/单点改动/实验 | 完整产品需求 |

---

## 5. 模板与定制

### 5.1 模板放哪

- **规范**模板：`specs/_template/`（**只读骨架**，不要直接改）
- Plan 模板：`plans/` 下的 `_template.md`
- 业务项目骨架：`templates/`（如 `templates/new-crud-page.md` 是给业务 AI 用的）

### 5.2 想改默认模板

- **团队约定变更**：改 `_template/` 后跑 `node .trae/scripts/render-templates.mjs` 把现有 spec 拉齐
- **本机临时覆盖**：复制 `_template/` 内容到 `specs/domains/<产品线>/_template/` 自定义

### 5.3 渲染/校验脚本

```bash
# 渲染所有 spec 骨架（dry-run 看会动哪些文件）
node .trae/scripts/render-templates.mjs

# 真实写入
node .trae/scripts/render-templates.mjs --write

# 只校验签字（CI 可用）
node .trae/scripts/render-templates.mjs --check-signing
```

---

## 6. 给业务项目用：技能路由

`jurassic-cooker` 是个**框架**，业务项目的 AI 真正落地代码时，需要按业务项目的技能路由走。

### 6.1 业务项目侧建议结构

```
<业务项目仓>/
  .trae/
    skills/                    # 业务项目专属技能（项目约定/API 习惯等）
  src/                         # 业务代码
```

### 6.2 框架技能与业务技能的边界

| 来自 `jurassic-cooker` | 来自业务项目 |
|---|---|
| 通用规范（Vue/TS/CSS/i18n/CRUD 页面模式） | 项目特定 API、目录约定、组件封装 |
| Jurassic 生态（jurassic-ui、jurassic-biz） | 第三方库使用习惯 |
| Playwright E2E 上手指南 | 项目已有用例组织方式 |

业务 AI 调用技能时，**项目技能优先**——AI 会先看业务项目 `.trae/skills/` 找具体约定，看不到才回落框架通用技能。

---

## 7. 协作与签字

### 7.1 角色

六阶段对应 6 个角色（详见 `specs/_template/STATUS.md`）。每阶段结束：
- 文件末尾追加签字行
- 跑 `--check-signing` 校验

### 7.2 升版规则

| 文档 | 升版时机 |
|---|---|
| `design-ui.md` | UI 变更（哪怕小动）|
| `design-contract.md` | 接口变更 / 字段增减 |
| `tech-solution-*.md` | 技术栈 / 架构变更 |

每个文档头部都有 `version` 字段，bump 后跑 `render-templates.mjs` 同步引用方。

### 7.3 进度同步

更新 `specs/_template/STATUS.md`（**全局唯一**）里你那行的阶段——所有人看一份。

---

## 8. 常见问题

**Q: 我只想要个简单 plan，不想跑六阶段？**
A: 走"个人通道"+ plan，单文件，不要签字。

**Q: 我改了 UI Spec 但忘了通知后端会怎样？**
A: 后端按旧 UI 写的接口上线后，前端发现对不上，要返工——这就是为什么有软闸口。

**Q: 业务项目能不能直接复用 `jurassic-cooker` 的技能？**
A: 能。Workspace 里两个仓都打开，业务 AI 自然会读 `jurassic-cooker/.trae/skills/`。但**项目特定约定**仍放业务仓 `.trae/skills/`，别污染框架。

**Q: `config.local.yaml` 改了不生效？**
A: 确认 YAML 缩进（2 空格）；确认键路径与 `config.yaml` 一致（`spec.personal.root` 而非 `personal.root`）。

**Q: AI 生成的 spec 跟我预期差很多？**
A: 检查 `.trae/steering/mindset.md` 里关于"如何描述需求"的指引——描述越具体，结果越可控。

---

## 9. 下一步

- [ ] 按 §1 建好 `config.local.yaml`
- [ ] 按 §2 把三个仓加进同一个 Workspace
- [ ] 对 AI 说"做个简单 plan：把 README 翻译成英文"试试水
- [ ] 熟了之后做正式 spec
