---
alwaysApply: false
description: 前端安全规范——XSS 防范、敏感信息保护、CSRF、依赖安全、数据校验、路由权限
---

# Security：前端安全编码规范

> **强制**：前端安全直接影响用户数据和账号安全。

## 1. XSS 防范

- ❌ 禁止 `v-html` / `innerHTML` 直接插入用户输入或未消毒内容
- ❌ 禁止 `eval()`、`new Function()` 解析执行含用户输入的字符串
- ❌ 禁止把用户可控内容直接作为 `href` / `src` 且未做协议检查
- ✅ 必须用 `v-html` 时先经 DOMPurify 消毒
- ✅ 外链 `target="_blank"` 必须加 `rel="noopener noreferrer"`
- ✅ 用户提供的链接校验协议，禁止 `javascript:`

## 2. 敏感信息保护

- ❌ 禁止硬编码 API 密钥、Secret、密码、Token
- ❌ 禁止 `console.log` 打印完整 token / 身份证 / 手机号 / 密码（需打码）
- ❌ 禁止 `localStorage` / `sessionStorage` 存敏感信息（XSS 可读）
- ✅ Token 推荐 HttpOnly + Secure Cookie
- ✅ Vite 中 `VITE_` 前缀变量会暴露给客户端，不能放密钥

## 3. CSRF

非 GET 请求携带 CSRF Token；敏感操作二次验证；跨域请求配置 `withCredentials: true`。

## 4. 依赖安全

定期 `npm audit`；锁定依赖版本并把 lock 文件提交 Git；不安装来源不明的 npm 包。

## 5. 数据校验

前端校验是体验优化、**不是安全措施**，后端必须重做；URL 参数必须 `encodeURIComponent`；文件上传后端必须再次校验类型/大小。

## 6. 路由与权限

前端路由守卫**不是安全边界**，权限校验必须在后端；路由参数不携带敏感信息；退出登录时清除本地数据与 token 并调用后端注销。
