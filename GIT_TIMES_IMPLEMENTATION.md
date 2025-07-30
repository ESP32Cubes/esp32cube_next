# Git 时间获取功能实现

## 功能概述

本项目实现了使用 `git log` 获取文章创建与更新时间的功能，在构建时自动注入到每篇文章中。

## 实现细节

### 1. 核心函数

在 `lib/posts.ts` 中实现了 `getGitTimes()` 函数：

```typescript
function getGitTimes(filePath: string): { created_at: string; updated_at: string } {
  try {
    // 获取文件的相对路径（相对于 git 仓库根目录）
    const relativePath = path.relative(process.cwd(), filePath);
    
    // 获取文件的创建时间（第一次提交）- 使用 Windows 兼容的方式
    const createdTimeOutput = execSync(
      `git log --follow --format="%aI" --reverse -- "${relativePath}"`,
      { encoding: 'utf8', cwd: process.cwd() }
    ).trim();
    
    // 获取第一行（创建时间）
    const createdTime = createdTimeOutput.split('\n')[0] || '';
    
    // 获取文件的最后修改时间（最后一次提交）
    const updatedTime = execSync(
      `git log --follow --format="%aI" -1 -- "${relativePath}"`,
      { encoding: 'utf8', cwd: process.cwd() }
    ).trim();
    
    return {
      created_at: createdTime || '',
      updated_at: updatedTime || ''
    };
  } catch (error) {
    console.warn(`Failed to get git times for ${filePath}:`, error);
    return {
      created_at: '',
      updated_at: ''
    };
  }
}
```

### 2. 集成到文章加载

在 `getAllPosts()` 和 `getPostData()` 函数中集成了 git 时间获取：

```typescript
// 获取 git 时间，优先使用 git 时间，如果没有则使用 frontmatter 中的时间
const gitTimes = getGitTimes(filePath);
const created_at = gitTimes.created_at || (data.created_at ? String(data.created_at) : '');
const updated_at = gitTimes.updated_at || (data.updated_at ? String(data.updated_at) : '');
```

### 3. 时间格式

- 使用 ISO 8601 格式 (`%aI`)，例如：`2025-07-28T13:03:47+08:00`
- 支持时区信息
- 在显示时会转换为本地时间格式

## 功能特点

1. **跨平台兼容**：使用 Windows 兼容的方式处理 `head` 命令
2. **错误处理**：如果 git 命令失败，会回退到 frontmatter 中的时间
3. **性能优化**：只在构建时执行，不影响运行时性能
4. **向后兼容**：如果 git 时间获取失败，仍可使用 frontmatter 中的时间

## 使用方式

文章的时间信息会自动从 git 历史中获取，无需手动设置。在以下地方会显示时间：

1. **文章卡片**：显示更新时间
2. **文章详情页**：显示创建和更新时间
3. **文章排序**：按更新时间排序

## 技术细节

- 使用 `git log --follow` 跟踪文件重命名历史
- 使用 `--reverse` 获取第一次提交（创建时间）
- 使用 `-1` 获取最后一次提交（更新时间）
- 使用 `%aI` 格式获取 ISO 8601 时间戳

## 注意事项

1. 需要在 git 仓库中运行
2. 文件必须有 git 提交历史
3. 在 Vercel 部署时会自动执行
4. 本地开发时也会获取 git 时间 