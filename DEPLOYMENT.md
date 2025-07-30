# 部署说明

## 数据库设置

1. 在你的 MySQL 服务器上创建数据库
2. 执行 `database-schema.sql` 文件中的 SQL 语句创建表结构
3. 确保数据库可以从 Vercel 访问（需要公网 IP 或使用云数据库服务）

## 环境变量配置

### 本地开发
创建 `.env.local` 文件并配置以下变量：

```env
# 数据库配置
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_DATABASE=your-database-name

# NextAuth 配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

### Vercel 部署
在 Vercel Dashboard 中配置相同的环境变量，但将 `NEXTAUTH_URL` 改为你的生产域名。

## OAuth 应用配置

### Google OAuth
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 创建 OAuth 2.0 凭据
5. 添加授权重定向 URI：
   - 本地：`http://localhost:3000/api/auth/callback/google`
   - 生产：`https://your-domain.vercel.app/api/auth/callback/google`

### GitHub OAuth
1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 创建新的 OAuth App
3. 设置授权回调 URL：
   - 本地：`http://localhost:3000/api/auth/callback/github`
   - 生产：`https://your-domain.vercel.app/api/auth/callback/github`

## 部署步骤

1. 将代码推送到 GitHub 仓库
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署项目

## 功能说明

### 已实现功能
- ✅ 用户认证（Google/GitHub 登录）
- ✅ 文章点赞功能
- ✅ 文章浏览量统计
- ✅ 评论系统（支持登录用户和游客）
- ✅ 响应式设计
- ✅ 暗色主题支持

### 使用说明
1. 用户可以通过 Google 或 GitHub 账号登录
2. 登录用户可以点赞文章
3. 所有用户都可以查看评论和发表评论
4. 游客评论需要提供姓名和邮箱
5. 文章浏览量会在每次访问时自动增加

## 故障排除

### 数据库连接问题
- 确保数据库服务器允许外部连接
- 检查防火墙设置
- 验证数据库凭据

### OAuth 登录问题
- 检查回调 URL 配置
- 确保 OAuth 应用已正确设置
- 验证环境变量配置

### 构建错误
- 确保所有依赖已正确安装
- 检查 TypeScript 类型错误
- 验证 API 路由配置 