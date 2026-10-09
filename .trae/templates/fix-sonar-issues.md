# 黄金路径：修 SonarQube 异味

> 用法：把下面「提示词」整段复制到对话，替换 `<...>` 内容。

## 提示词

```text
修 <项目名（仓库名，如 oio-master-web）> 在 SonarQube 上的异味。范围：<当前分支增量 / 指定文件 / 全项目 OPEN>。

流程要求（按 `skills/frontend/sonar/SKILL.md`）：
1. 先解析 projectKey（优先项目根 sonar-project.properties，其次 MCP 搜索）；拿不到就停下来问我，不要猜。
2. 拉 OPEN issue（默认 MAINTAINABILITY，从 BLOCKER/HIGH 开始），按文件聚合。
3. 每条 issue：show_rule 读规则 → 定位本地代码 → **只改与该规则相关的最小范围**。
4. 改后用 analyze_code_snippet 复验；本地能跑的 lint/typecheck 也跑。
5. 规则与项目有意设计冲突时**先问我**，不要静默 ignore / eslint-disable / @ts-ignore。
6. 报告归档到使用方本地知识库的报告目录（`sonar-reports/`），命名 sonar-<project>-<YYYYMMDD-HHMMSS>.md，**不要覆盖旧报告**。
```

## 交卷要求

- projectKey 与本次范围（增量 / 全量 / 单文件）
- 拉到多少条 issue、严重级别分布
- 已改文件 + 对应的规则 key
- `analyze_code_snippet` 与 lint/typecheck 的真实结果
- 哪些 issue 需要 CI 全量扫描才会关闭、哪些需要人工决策（accept / false positive）

## 相关

- 技能：`skills/frontend/sonar`、`skills/frontend/quality-review`
- 规则：`.trae/rules/frontend/eng/sonar.md`（SonarQube 规则集与阈值；MCP 接入以使用方本地配置为准）
- 报告归档：使用方本地知识库的报告目录（`sonar-reports/`）
