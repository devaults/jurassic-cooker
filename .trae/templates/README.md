# templates/

**不参与 AI 智能生效的空白模板与黄金路径提示词**，需要时复制出去用。

放在这里而不是 `.trae/rules/`，是为了避免空白模板里的示例值被当成规则加载、污染上下文；
也避免把"提示词"和"约束"混在同一层。

## 文件

| 文件 | 用途 |
|---|---|
| `plan.md` | Plan 通道：小任务单文件计划模板 → 复制到 `plans/<YYYY-MM>/<slug>.md`（团队；个人任务落**外置个人根**）（配套路线 `prompts/routes/plan-only.md`） |
| `current-iteration.md` | 迭代上下文模板 → 复制到工作区根为 `CURRENT-ITERATION.md`，填写本阶段重点；迭代结束即删 |
| `project-readme.md` | 前端子应用 README 格式模板（提交规范不在此，见 `.trae/rules/frontend/eng/config.md`） |
| `new-crud-page.md` | 黄金路径：新增一个 CRUD 页面 |
| `migrate-vue2-route.md` | 黄金路径：Vue2 → Vue3 按路由迁移 |
| `fix-sonar-issues.md` | 黄金路径：修 SonarQube 异味 |
| `submit-review.md` | 黄金路径：交卷 / 提 PR 前的自检与验证 |

## 用法

1. 打开对应模板，把 `<尖括号>` 里的内容换成你的实际信息；
2. 整段「提示词」复制到对话里（配合工作区模式，规则与技能才会一起生效）；
3. 每个模板末尾的「交卷要求」就是验收标准——AI 没按它回答，可以直接追问。

## 约定

- 新增模板 → 本目录 + 更新本 README 的表格；
- 模板里**不写具体项目名/路径**，用占位符，保持可复用；
- 模板不复制规则内容，只写"该读哪个规则/技能"，避免两处维护。
