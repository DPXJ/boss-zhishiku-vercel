# Boss 知识库 Vercel 代理

本项目为 FastGPT API 的 Vercel 代理，支持 GitHub Pages、静态站点等前端跨域安全调用。

## 快速部署

1. **Fork 或上传本项目到你的 GitHub 账号**
2. **访问 [Vercel 官网](https://vercel.com/)，选择 Import GitHub Repository**
3. 选择本仓库，点击 Deploy
4. 部署完成后，获得代理地址：
   `https://你的-vercel-app.vercel.app/api/fastgpt/...`
5. 前端配置 API 地址为上面代理地址即可

## 主要文件
- `api/fastgpt.js`：主代理逻辑，自动转发所有 FastGPT API 请求
- `vercel.json`：Vercel 路由配置

## 适用场景
- GitHub Pages 静态站点跨域调用 FastGPT
- 保护 API 密钥安全
- 免费/低成本云端代理

## 常见问题
- 代理仅用于开发/轻量生产，重度生产建议自建服务器
- 如遇 429/限流，请升级 Vercel 计划或自建代理

---

如有问题请联系开发者或提交 issue。 