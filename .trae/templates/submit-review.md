# 黄金路径：交卷 / 提 PR 前的自检

> 用法：改动做完后，把下面「提示词」整段复制到对话。**不要**只说"帮我 review 一下"。

## 提示词

```text
我要交卷 / 提 PR。改动范围：<一句话 + 涉及的项目名（仓库名）>。
本次改动是否影响已上线功能：<是 / 否 / 不确定>。

请按顺序做，再给结论：
1. **自检**：影响分析（改了哪些公共函数/props/样式类/store/API，grep 了哪些引用）；
   边界条件、内存泄漏、错误处理、安全性（见 .trae/rules/common/mind/change-review.md）。
2. **验证**：先查使用方项目注册表确认该项目实际有哪几个命令，逐条执行并报告真实结果。
   **没跑的命令不许写成跑过**；项目没有 typecheck/test 时如实说明替代方式。
3. **回归**：若影响已上线功能，跑该项目的 E2E 用例（见使用方本地用例清单，
   约定见 skills/frontend/playwright-e2e/SKILL.md），或按回归清单核对相关项；
   产物默认落 cooker `.screenshots/`（可用 `.trae/config.local.yaml` 覆盖）。
4. **PR**：按 skills/git-pr 的格式写描述；确认没有提交 .env、凭据、调试代码、无关格式化。
5. 输出五段：改动文件清单 / 实际命令与结果 / 未做项 / 阻塞点 / 建议的回归范围。
```

## 为什么不用"帮我 review 一下"

模糊请求会让 AI 只做静态阅读、跳过真实命令，最后给一句"看起来没问题"。
上面的提示词强制了**验证证据**与**未做项披露**，这正是 `.trae/rules/common/mind/change-review.md` §三「交卷口径」。

## 相关

- 规则：`.trae/rules/common/mind/change-review.md`（影响分析 / 自检 / §三 交卷口径）、`verification-recovery.md`（§1 验证闭环）
- 技能：`skills/quality-review`、`skills/git-pr`、`skills/frontend/playwright-e2e`（E2E 产物约定与解析）
- 回归资产：使用方本地知识库的 E2E 用例清单与回归清单；运行产物默认落 cooker `.screenshots/`
