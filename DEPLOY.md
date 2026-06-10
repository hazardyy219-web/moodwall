# Apex 心情墙 — 全栈部署说明

## 项目结构

```
agent/
├── backend/          # Node.js + Express + PostgreSQL API
├── src/              # React + Vite 前端
├── .env.example      # 前端环境变量示例
└── DEPLOY.md         # 本文件
```

## 本地开发

### 1. 准备 PostgreSQL

创建数据库（示例）：

```bash
createdb apex_mood
```

### 2. 启动后端

```bash
cd backend
cp .env.example .env
# 编辑 .env 填入 DATABASE_URL 和 JWT_SECRET

npm install
npm run dev
```

后端默认运行在 `http://localhost:3001`，启动时自动创建表。

### 3. 启动前端

```bash
cd ..   # 回到项目根目录
cp .env.example .env

npm install
npm run dev
```

前端默认 `http://localhost:5173`，通过 Vite 代理访问 `/api`。

## Render 部署

### 后端 Web Service

1. 在 Render 创建 **PostgreSQL** 数据库
2. 创建 **Web Service**，连接本仓库，Root Directory 设为 `backend`
3. 配置环境变量：

| 变量 | 说明 |
|------|------|
| `DATABASE_URL` | Render PostgreSQL 自动提供（Internal URL） |
| `JWT_SECRET` | 随机长字符串 |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | 前端部署地址，如 `https://your-app.onrender.com` |

4. Build Command: `npm install && npm run build`
5. Start Command: `npm run start`

### 前端 Static Site（或 Web Service）

1. Root Directory: 项目根目录（非 backend）
2. Build Command: `npm install && npm run build`
3. Publish Directory: `dist`
4. 环境变量：

| 变量 | 值 |
|------|-----|
| `VITE_API_URL` | `https://your-backend.onrender.com/api` |

### 健康检查

后端提供 `GET /api/health` 用于 Render 健康检查。

## API 概览

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/register` | 注册 |
| POST | `/api/auth/login` | 登录 |
| GET | `/api/auth/me` | 当前用户 |
| PATCH | `/api/users/profile` | 更新资料 |
| GET | `/api/users/:id` | 获取用户 |
| GET | `/api/posts` | 分页获取留言 |
| GET | `/api/posts/mine` | 我的留言 |
| POST | `/api/posts` | 发布心情 |
| DELETE | `/api/posts/:id` | 删除留言 |
| POST | `/api/posts/:id/comments` | 评论 |
| DELETE | `/api/posts/:postId/comments/:commentId` | 删评论 |
| POST | `/api/posts/:id/like` | 点赞/取消 |

认证：Header `Authorization: Bearer <JWT>`

## 注意事项

- 生产环境务必更换 `JWT_SECRET`
- 图片头像以 base64 存入数据库，建议限制大小（前端已限制 512KB）
- 旧版 localStorage 数据不会自动迁移，需重新注册登录
