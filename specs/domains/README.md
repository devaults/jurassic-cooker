# domains/

> 业务域分类目录。specs/ 下所有正式功能 spec（需签字、跨人协作、有 QA）都必须归入某个业务域。
>
> 本目录**不存放具体功能**，只作为一级分类；具体功能在 `<domain>/<feature>/` 下。

## 设计原则

- **业务域 = 业务线 / 产品线 / 系统归属**，不是技术分类（如"前端"、"后端"）
- 一个 `<feature>` 只属于一个业务域
- 业务域数量不宜过多（建议 3-8 个）；过多说明抽象粒度不对

## 当前业务域

| 域 | 说明 | 例子 |
|---|---|---|
| _（待定义）_ |  |  |

> 有新功能时，先判断归属哪个已有域；域不存在则新建（需在本 README 登记）。

## 新增业务域

1. 在本目录创建 `<domain>/` 子目录
2. 在本 README「当前业务域」表格登记
3. 在 `<domain>/` 下创建 `README.md`（域总览）
4. 渲染 `<feature>/`——目标路径即最终位置，直接落在 `<domain>/` 下

```bash
# 示例：在 domains/ 下新建「资产管理系统」域，并渲染一个功能
# （在 specs/ 目录下执行）
mkdir -p domains/asset-management
echo "# 资产管理系统\n\n> 负责资产全生命周期管理。" > domains/asset-management/README.md
node ../.trae/scripts/render-templates.mjs domains/asset-management/my-asset-feature
```

## 目录结构

```
domains/
├── README.md              # 本文件
├── <domain-1>/           # 业务域 1
│   ├── README.md          # 域总览（业务背景 + 涉及系统 + 关联团队）
│   └── <feature-1>/      # 功能 1（用 render-templates.mjs 渲染）
│       ├── requirements.md
│       ├── design-ui.md
│       ├── design-contract.md
│       ├── tech-solution-backend.md
│       ├── tech-solution-frontend.md
│       ├── STATUS.md              # 全局进度看板
│       ├── tasks/
│       │   ├── backend/
│       │   └── frontend/
│       └── qa/
└── <domain-2>/           # 业务域 2
    └── ...
```

## 与 `_template/` 的关系

- `_template/` 是**框架模板**（可移植到其他团队）
- `domains/` 是**本仓正式 spec 存放处**（团队共享、必须签字）
- 个人 spec **不落本仓**，落**外置个人根**（使用方本机 `.trae/config.local.yaml` 的 `spec.personal.root`，免签字）

## 硬约束

- **UI Spec 是软闸口**：前端开发期间若发现 UI Spec 需变更，**必须升 UI Spec v2** 并同步通知后端与接口架构师；禁止"小修一下继续走"。详见 [`../README.md`](../README.md) 硬约束节。

## 相关

- 框架说明：[`../README.md`](../README.md)
- 个人 spec（外置，不共享）：见 [`../README.md`](../README.md) 的「个人 spec（外置，不共享）」一节
- 模板定义：[`../_template/`](../_template/)