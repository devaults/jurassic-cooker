---
alwaysApply: false
description: 处理 SonarQube 代码质量问题或修复代码异味时使用
---

### SonarQube 代码质量规则

#### 常见阻断级规则

| 规则 ID | 规则名 | 级别 | 说明 |
|---|---|---|---|
| `javascript:S3358` | Nested ternary | Major | 禁止嵌套三目运算，拆分为独立语句 |
| `javascript:S1117` | Shadowing variable | Major | 变量名遮蔽外层作用域 |
| `javascript:S1488` | Multiple variable declarations | Major | 一行声明多个变量 |
| `javascript:S1854` | Dead stores | Major | 死存储，赋值后未使用即被覆盖 |
| `javascript:S138` | Function too long | Major | 函数过长（>100 行）|
| `javascript:S134` | Nesting too deep | Critical | 嵌套层级过深（>4 层）|
| `javascript:S1192` | String literal duplication | Critical | 字符串字面量重复（≥3 次）|
| `javascript:S3776` | Cognitive Complexity | Critical | 认知复杂度过高（>15）|
| `javascript:S2692` | Reassign parameter | Critical | 重新赋值函数参数 |
| `javascript:S2428` | Deprecated keyword | Major | 使用 var 而非 let/const |
| `javascript:S1656` | Self assignment | Major | 自赋值 `a = a` |
| `css:S4666` | Empty rule | Major | 空 CSS 规则 |
| `css:S4662` | Duplicated properties | Major | 重复的 CSS 属性 |

#### 可配置忽略的规则

| 规则 ID | 规则名 | 说明 |
|---|---|---|
| `javascript:S1135` | TODO tags | 可根据团队策略关闭 |
| `javascript:S109` | Magic numbers | 可对枚举/状态码场景关闭 |
| `javascript:S125` | Commented code | 可保留但建议清理 |
| `javascript:S1128` | Unused import | **新代码必须清理**，不可豁免；仅在批量处理历史遗留文件时可暂缓 |
| `javascript:S1192` | String literal duplication | 业务文案重复可豁免 |

#### 嵌套三目运算（强制）
禁止嵌套三目运算符（`javascript:S3358`），拆分为独立语句：

```js
// ❌ 反例
const className = this.ignoreActivities === 'true'
  ? (isInRange ? 'mark1' : '')
  : (isInRange ? (isVerified == 0 ? 'mark1' : 'mark2') : 'mark3')

// ✓ 正例
let className = ''
if (this.ignoreActivities === 'true') {
  className = isInRange ? 'mark1' : ''
} else if (isInRange) {
  className = isVerified === 0 ? 'mark1' : 'mark2'
} else {
  className = 'mark3'
}
```

#### Quality Gate 推荐阈值（新代码）
- Bug = 0，漏洞 = 0，异味 ≤ 5
- 覆盖率 ≥ 60%，重复率 < 3%，重复块 < 10
- 认知复杂度 ≤ 15

#### sonar-project.properties 关键配置
```properties
sonar.projectKey=<project-key>
sonar.sources=src
sonar.exclusions=**/node_modules/**,**/dist/**,**/*.min.js,**/vendor/**
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.javascript.file.suffixes=.js,.vue
```

> `sonar-project.properties` **并非每个项目都有**；没有时先确认 `projectKey` 来源（项目文件 / MCP 搜索），不要假设存在。

### SonarQube 接入（MCP / CLI / 扫描器）

> 本节不维护具体 MCP 配置——不同机器、不同项目组的接入方式差异较大（HTTP / stdio / 纯 CLI）。
> 接入方式以使用方本地配置为准；本仓只约定**对接时必须遵守的纪律**。

对 [`skills/frontend/sonar/SKILL.md`](../../../skills/frontend/sonar/SKILL.md) 的两点补充：

1. 技能描述的是一种**通用形态**；本机实际可能是 stdio server、HTTP server，或纯 CLI 调用。探测不到 sonar 工具时，按本机实际形态排查，**不要**照抄其他机器的配置去改 `.mcp.json`。
2. 凭据（`SONARQUBE_TOKEN`、账号密码）**只放本机配置**，绝不进 git（凭据通用约束见 [`common/mind/self-harness.md`](../../common/mind/self-harness.md) §4）。
