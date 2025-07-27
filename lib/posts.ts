import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export interface Post {
  filename: string;
  title: string;
  slug: string;
  category: string;
  cover?: string;
  date?: string;
  excerpt: string;
  tags?: string[];
  author?: string;
}

export interface PostData extends Post {
  contentHtml: string;
  content: string;
}

const contentDirectory = path.join(process.cwd(), 'content');
const fallbackCovers = ['/1.jpg', '/2.jpg', '/3.jpg', '/4.jpg'];

function getRandomCover(slug: string) {
  // 保证同一slug始终分配同一张图片
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash) + slug.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % fallbackCovers.length;
  return fallbackCovers[idx];
}

// 递归读取目录中的所有 Markdown 文件
async function getAllMarkdownFiles(dir: string, baseDir: string = ''): Promise<Array<{ filePath: string; relativePath: string; category: string }>> {
  const files: Array<{ filePath: string; relativePath: string; category: string }> = [];
  
  try {
    const items = await fs.readdir(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      const relativePath = path.join(baseDir, item.name);
      
      if (item.isDirectory()) {
        // 递归读取子目录
        const subFiles = await getAllMarkdownFiles(fullPath, relativePath);
        files.push(...subFiles);
      } else if (item.isFile() && item.name.endsWith('.md')) {
        // 确定分类
        const category = baseDir || 'general';
        files.push({
          filePath: fullPath,
          relativePath,
          category
        });
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
  
  return files;
}

// 获取所有文章列表（用于首页）
export async function getAllPosts(): Promise<Post[]> {
  const markdownFiles = await getAllMarkdownFiles(contentDirectory);

  const posts = await Promise.all(
    markdownFiles.map(async ({ filePath, relativePath, category }) => {
      try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data, content } = matter(fileContent);

        // 生成摘要（取前200个字符）
        const excerpt = content
          .replace(/[#*`]/g, '')
          .replace(/\n/g, ' ')
          .substring(0, 200) + '...';

        const slug = data.slug || path.basename(relativePath, '.md');
        const cover = data.cover && data.cover.trim() ? data.cover : getRandomCover(slug);

        return {
          filename: path.basename(relativePath),
          title: data.title || path.basename(relativePath, '.md'),
          slug,
          category,
          cover,
          date: data.date || '',
          excerpt,
          tags: data.tags || [],
          author: data.author || '',
        };
      } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
        return null;
      }
    })
  );

  // 过滤掉处理失败的文章并按日期排序（最新的在前）
  return posts
    .filter(post => post !== null)
    .sort((a, b) => {
      if (!a || !b) return 0;
      if (!a.date || !b.date) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }) as Post[];
}

// 获取单篇文章的完整数据
export async function getPostData(slug: string, category?: string): Promise<PostData> {
  try {
    console.log(`Trying to load post: ${slug}${category ? ` in category: ${category}` : ''}`);
    
    const markdownFiles = await getAllMarkdownFiles(contentDirectory);
    let targetFile: { filePath: string; relativePath: string; category: string } | undefined;
    
    // 如果指定了分类，优先在该分类下查找
    if (category) {
      for (const file of markdownFiles) {
        if (file.category === category) {
          try {
            const fileContent = await fs.readFile(file.filePath, 'utf-8');
            const { data } = matter(fileContent);
            if (data.slug === slug) {
              targetFile = file;
              break;
            }
          } catch (error) {
            console.error(`Error reading file ${file.relativePath}:`, error);
          }
        }
      }
    }
    
    // 如果没找到或没指定分类，在所有文件中查找
    if (!targetFile) {
      for (const file of markdownFiles) {
        try {
          const fileContent = await fs.readFile(file.filePath, 'utf-8');
          const { data } = matter(fileContent);
          if (data.slug === slug) {
            targetFile = file;
            break;
          }
        } catch (error) {
          console.error(`Error reading file ${file.relativePath}:`, error);
        }
      }
    }

    if (!targetFile) {
      throw new Error(`No file found with slug: ${slug}`);
    }

    console.log(`Found file: ${targetFile.relativePath} for slug: ${slug}`);
    
    const fileContent = await fs.readFile(targetFile.filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    
    const processedContent = await remark()
      .use(html)
      .process(content);

    const cover = data.cover && data.cover.trim() ? data.cover : getRandomCover(slug);

    const postData = {
      filename: path.basename(targetFile.relativePath),
      title: data.title || slug,
      slug: data.slug || slug,
      category: targetFile.category,
      cover,
      contentHtml: processedContent.toString(),
      content,
      date: data.date || '',
      tags: data.tags || [],
      author: data.author || '',
      excerpt: content.replace(/[#*`]/g, '').substring(0, 200) + '...',
    };

    console.log(`Successfully loaded post: ${slug}`, { title: postData.title, category: postData.category, cover: postData.cover });
    return postData;
  } catch (error) {
    console.error(`Failed to load post: ${slug}`, error);
    throw new Error(`Failed to load post: ${slug}`);
  }
}

// 获取所有文章的slug列表
export async function getAllPostSlugs(): Promise<Array<{ slug: string; category: string }>> {
  try {
    const markdownFiles = await getAllMarkdownFiles(contentDirectory);
    console.log('Found files in content directory:', markdownFiles.map(f => f.relativePath));
    
    const slugs = await Promise.all(
      markdownFiles.map(async ({ filePath, relativePath, category }) => {
        try {
          const fileContent = await fs.readFile(filePath, 'utf-8');
          const { data } = matter(fileContent);
          const slug = data.slug || path.basename(relativePath, '.md');
          console.log(`Found slug: ${slug} from file: ${relativePath} in category: ${category}`);
          return { slug, category };
        } catch (error) {
          console.error(`Error processing file ${relativePath}:`, error);
          return null;
        }
      })
    );

    const validSlugs = slugs.filter(slug => slug !== null) as Array<{ slug: string; category: string }>;
    console.log('All valid slugs:', validSlugs);
    return validSlugs;
  } catch (error) {
    console.error('Error reading content directory:', error);
    return [];
  }
}

// 根据分类获取文章
export async function getPostsByCategory(category: string): Promise<Post[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => post.category === category);
}

// 根据标签获取文章
export async function getPostsByTag(tag: string): Promise<Post[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => 
    post.tags && post.tags.includes(tag)
  );
}

// 搜索文章
export async function searchPosts(query: string): Promise<Post[]> {
  const allPosts = await getAllPosts();
  const lowercaseQuery = query.toLowerCase();
  
  return allPosts.filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.excerpt.toLowerCase().includes(lowercaseQuery) ||
    (post.tags && post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
  );
}

// 获取所有分类
export async function getAllCategories(): Promise<string[]> {
  const allPosts = await getAllPosts();
  const categories = new Set(allPosts.map(post => post.category));
  return Array.from(categories).sort();
} 