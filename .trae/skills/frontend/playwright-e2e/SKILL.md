---
name: playwright-e2e
description: >-
  Playwright end-to-end test conventions: where cases live, how each case owns a
  playwright.config.ts, and the artifact (screenshot/video/trace) output directory
  (default <cooker>/.screenshots/<feature>/<yyyy-MM-dd>/, overridable via
  .trae/config.local.yaml). Use when 跑测试用例、E2E、端到端、Playwright config、
  截图产物、回归, or adding / changing a Playwright case.
version: 1.0.0
status: stable
owner: "@jurassic-cooker-team"
updated: 2026-10-09
deprecated: false
---

# Playwright 端到端测试

E2E 用例工程与产物目录的统一约定。用例放知识库，**产物默认统一落 cooker 仓**（可用 `config.local.yaml` 改落点）。

## 何时使用

- 新增 / 修改 Playwright 用例或 `playwright.config.ts`。
- 跑 E2E、验收走查、需要截图 / 录屏 / trace 产物。
- 质量问题需回归对应用例时（先查用例库是否已覆盖）。

## 产物目录（默认落 cooker，可配置）

截图、视频、trace **统一**落**产物根**：

```
<产物根>/<feature>/<yyyy-MM-dd>/
```

**产物根解析（local 优先）**——按序取**第一个命中**的值：

1. `<cooker 仓根>/.trae/config.local.yaml` 的 `spec.artifacts.e2e_root`（git 忽略；**存在且设置即优先**）；
2. 否则 `<cooker 仓根>/.trae/config.yaml` 的 `spec.artifacts.e2e_root`，默认 `<cooker 仓根>/.screenshots`。

> 两个配置文件都在 **cooker 仓**下（不在知识库）；合并规则（local 已设置的键覆盖同名键、未设置的回落默认）见 `config.yaml` 文件头「本机局部覆盖」。local 不存在或全注释时，等价于只用 `config.yaml` 默认值。

| 段 | 取值 |
|---|---|
| `<产物根>` | 见上方解析规则；默认 `<cooker 仓根>` = cooker 仓库根（用你本机 cooker 仓的绝对路径替换） |
| `<feature>` | 用例目录的**叶子名**，如 `effort-query`、`task-03-router-exception-system` |
| `<yyyy-MM-dd>` | **运行当日**（本地时区），不是用例目录名里的历史日期 |

- 默认产物根在 cooker 仓内，由 cooker 的 `.gitignore` 忽略，**产物不入 git**。
- 用例目录内**不再留** `test-artifacts/`、`screen/` 等分散产物目录。
- `reports/`（HTML reporter）仍可留在用例目录内，或按需一并指向产物根，二选一但要一致。

## base config 模板（照抄改 `<feature>`）

```ts
import { defineConfig, devices } from '@playwright/test'

// 产物根：先看 .trae/config.local.yaml 的 spec.artifacts.e2e_root（local 优先），
// 无则用默认 cooker 仓根/.screenshots；把 <产物根> 换成解析后的绝对路径
const SCREENSHOT_ROOT = '<产物根>'
const d = new Date()
const RUN_DATE = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export default defineConfig({
  testDir: './',
  fullyParallel: false,
  workers: 1,
  // 强制：产物落 <产物根>/<feature>/<运行日>/
  outputDir: `${SCREENSHOT_ROOT}/<feature>/${RUN_DATE}/`,
  reporter: [['html', { outputFolder: 'reports', open: 'never' }], ['list']],
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'] } },
  ],
})
```

> 只改 `outputDir`（+ 顶部 3 行常量）；`baseURL`、`headless`、`channel`、`projects` 等按用例实际需要保留。
> **`<产物根>` 必须填「解析后」的值**：本机若用 `config.local.yaml` 覆盖，就填 local 的值（否则会把默认路径写死，local 覆盖失效）；换机器 / 换本机配置后重新解析一次。
> 用例里显式 `page.screenshot({ path })` 时，`path` 也要落在 `${SCREENSHOT_ROOT}/<feature>/${RUN_DATE}/` 下。

## 用例工程组织

- 位置：`<知识库>/work/qa/playwright/{domain}/{date-or-version}/`，每个用例目录**自带** `playwright.config.ts`。
- 生成 / 更新 config 前，先按 §产物目录 解析**产物根**（local 优先），再据此填 `SCREENSHOT_ROOT`。
- 环境地址、是否登录、登录后入口取自对应 spec 的 `qa/README.md` §0.1「运行环境」；`baseURL` 填该地址。
- **凭据不入库**：账号密码**不写进用例、spec 或脚本**；需要登录时由**人工接管**——执行到登录页即暂停，请人登录后继续（登录态可复用）。
- 一次性依赖在用例库根装：`pnpm install` + `npm run install:browsers`。
- 运行：`npx playwright test --config=<用例目录>/playwright.config.ts`。

## 反例

- 用相对 `outputDir: './test-artifacts/'`，产物散在用例目录里被误提交。
- 把截图写死到其它仓 / 临时目录（如 `Docs/`），绕过产物根约定。
- 把登录账号密码写进用例或 spec（应运行时人工接管登录）。
- 在用例目录里堆截图、录屏、trace。
- 不跑用例、只看静态代码就写"通过"。

## 相关

- 用例库与用例登记：知识库 `work/qa/playwright/README.md`。
- 交卷口径：`rules/common/mind/change-review.md` §三；阶段 6 提示词：[`prompts/stages/06-qa.md`](../../../prompts/stages/06-qa.md)。
