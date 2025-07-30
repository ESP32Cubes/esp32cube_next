好的，以下是你这个项目的完整需求总结与主要解决方案，使用简洁清晰的语言表述，便于你复制粘贴到 Cursor 等 AI 工具中作为上下文信息：



### ✅ 项目目标：

构建一个基于 Markdown 内容的 CMS 网站，支持文章展示、用户交互和基本社交功能，部署在 Vercel 上，支持第三方登录和数据库交互。

---

### 🧱 技术架构：

* **内容来源**：本地使用 Obsidian 编辑 Markdown 文件，提交到 GitHub 仓库。
* **部署方式**：GitHub 提交后，自动由 Vercel 构建并部署。
* **前端框架**：Next.js（使用 App Router）
* **UI 组件库**：ShadCN + Tailwind CSS
* **Markdown 解析**：gray-matter 提取 frontmatter，remark 渲染 HTML
* **数据库**：MySQL，部署在远程服务器（非 Vercel 内部数据库）
* **认证**：使用 next-auth 实现 Google 和 GitHub 登录
* **评论与点赞**：通过 API 与 MySQL 数据库交互，记录动态数据
* **文章创建/更新时间**：构建时使用 `git log` 获取每篇文章的提交历史时间

---

### 📂 文件与数据结构：

#### Markdown 文件：

放在 `/content/` 目录，每篇文章是一个 `.md` 文件，使用 Frontmatter 格式：

```md
---
title: "示例文章"
slug: "example-post"
cover: "/cover/example.jpg"
tags: ["nextjs", "blog"]
author: "Colin"
---
Markdown 正文内容...
```

---

### 🗃️ 数据库结构（MySQL）：

#### posts 表（记录文章动态信息）：

```sql
CREATE TABLE posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);
```

#### comments 表（记录文章评论）：

```sql
CREATE TABLE comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_slug VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  email VARCHAR(255),
  content TEXT NOT NULL,
  created_at DATETIME NOT NULL
);
```

---

### 🔧 功能实现说明：

* **文章渲染**：构建时读取 Markdown 文件，提取 frontmatter 与 HTML 内容，结合动态数据（点赞数、评论数等）展示文章详情页。
* **文章时间**：使用 `child_process.execSync` 执行 `git log` 获取创建与更新时间，构建时注入。
* **点击与点赞记录**：通过 Next.js API routes 写入 `posts` 表中。
* **评论功能**：游客或登录用户提交评论，通过 API 写入数据库并展示。
* **第三方登录**：使用 `next-auth` + Google/GitHub provider，支持用户身份认证。
* **环境变量**：通过 `.env.local`（本地）和 Vercel Dashboard（线上）配置数据库连接信息。

---

### 🌐 部署说明：

* 所有静态内容来自 Markdown，动态数据由 API 提供。
* 构建只依赖 Markdown 和 Git，无需构建时访问数据库。
* 所有用户交互（点赞、评论）在运行时通过数据库完成。

我项目已有的代码实现了网站布局和从md文件中读取内容，并显示在页面上。但是没有数据库支持的功能。请你先分析我的项目文件结构和代码，然后根据我的需求，给出实现方案。