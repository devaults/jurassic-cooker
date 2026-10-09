# 前端子应用 README 格式模板

> 用法：复制到项目根 `README.md` 后按项目实际情况填写。**不需要的章节直接删**，不要留空标题。
> 提交规范不在本模板里，见 `.trae/rules/frontend/eng/config.md`（勿在项目 README 重复维护一份）。

#### 概述
简单描述此前端子应用实现了什么功能。

#### 技术栈
列出使用的主要技术栈及版本，示例：
- Vue 2.6.10 / Vue 3.5.24
- Vuex 3.0.1 / Pinia 3.0.4
- Vue Router 3.0.1 / 4.6.4
- Axios 0.21.3
- Jurassic-UI 2.0.6

> 版本以 `package.json` 实际值为准，不要照抄示例。

#### 依赖服务
列出依赖的后端服务及其版本要求，示例：
- cloud_auth v3.1.1：提供登录鉴权相关 API

#### 功能清单
按菜单组织列出前端页面提供的功能，示例：
1. 首页
   - 内容分类展示
   - 热门内容推荐
2. 项目配置管理
   - 配置列表
   - 配置详情
   - 配置状态更新

#### 开发指南
- **环境要求**：Node.js 等版本要求
- **本地开发设置**：
  ```bash
  git clone <repo-url>
  cd <repo-dir>
  npm install
  npm run dev        # 或 npm run serve：以 package.json 为准
  ```

#### 构建和测试
```bash
npm run build      # 构建
npm run test       # 测试（项目没有该脚本时删掉本行，不要写成有）
```

#### Releases
按版本列出每个版本新增的功能、Change logs（含日期）、Bug Fixes、部署变更。
OiO 版本无严格版本号，用 Change logs 记录功能变更日志。

#### 部署说明
列出 docker 部署配置信息（docker-compose、环境变量、挂载路径等），示例：
```yaml
version: "2"
services:
  oio-master-web:
    image: 192.168.1.36/jurassic/oio-master-web:3.1.0-dev
    restart: always
    environment:
      - GATEWAY_HOST=192.168.0.137:7000
    ports:
      - 8870:8080
    container_name: oio-master-web
    volumes:
      - /opt/jurassic/global-js/resource-web/global.js:/usr/share/nginx/html/global.js
```

#### 配置
按功能列出配置说明（主要是 global 中的配置），示例：
1. API_BASE_URL
   - 说明：后端 API 的基础 URL
   - 支持的值：有效的 URL 字符串
   - 默认值：http://192.168.0.137:7000
