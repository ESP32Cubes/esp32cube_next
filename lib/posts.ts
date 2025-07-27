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
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash) + slug.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % fallbackCovers.length;
  return fallbackCovers[idx];
}

function processMarkdownLinks(content: string, currentCategory: string): string {
  // 处理站内文章链接: [文章标题](文章文件名.md)
  content = content.replace(
    /\[([^\]]+)\]\(([^)]+\.md)\)/g,
    (match, title, filename) => {
      const slug = filename.replace('.md', '');
      const cleanSlug = slug.replace(/^\d{1,3}-/, '');
      return `[${title}](/post/${cleanSlug})`;
    }
  );

  // 处理图片链接: ![](图片文件名)
  content = content.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (match, alt, imagePath) => {
      if (!imagePath.includes('/') && !imagePath.startsWith('http')) {
        const fullImagePath = `/content/images/${imagePath}`;
        return `![${alt}](${fullImagePath})`;
      }
      return match;
    }
  );

  return content;
}

async function getAllMarkdownFiles(dir: string, baseDir: string = ''): Promise<Array<{ filePath: string; relativePath: string; category: string }>> {
  const files: Array<{ filePath: string; relativePath: string; category: string }> = [];
  
  try {
    const items = await fs.readdir(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      const relativePath = path.join(baseDir, item.name);
      
      if (item.isDirectory()) {
        const subFiles = await getAllMarkdownFiles(fullPath, relativePath);
        files.push(...subFiles);
      } else if (item.isFile() && item.name.endsWith('.md')) {
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

export async function getAllPosts(): Promise<Post[]> {
  const markdownFiles = await getAllMarkdownFiles(contentDirectory);

  const posts = await Promise.all(
    markdownFiles.map(async ({ filePath, relativePath, category }) => {
      try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data, content } = matter(fileContent);

        const processedContent = processMarkdownLinks(content, category);

        const excerpt = processedContent
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

  return posts
    .filter(post => post !== null)
    .sort((a, b) => {
      if (!a || !b) return 0;
      if (!a.date || !b.date) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }) as Post[];
}

export async function getPostData(slug: string, category?: string): Promise<PostData> {
  try {
    console.log(`Trying to load post: ${slug}${category ? ` in category: ${category}` : ''}`);
    
    const markdownFiles = await getAllMarkdownFiles(contentDirectory);
    let targetFile: { filePath: string; relativePath: string; category: string } | undefined;
    
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
    
    const processedContent = processMarkdownLinks(content, targetFile.category);
    
    const processedHtml = await remark()
      .use(html)
      .process(processedContent);

    const cover = data.cover && data.cover.trim() ? data.cover : getRandomCover(slug);

    const postData = {
      filename: path.basename(targetFile.relativePath),
      title: data.title || slug,
      slug: data.slug || slug,
      category: targetFile.category,
      cover,
      contentHtml: processedHtml.toString(),
      content: processedContent,
      date: data.date || '',
      tags: data.tags || [],
      author: data.author || '',
      excerpt: processedContent.replace(/[#*`]/g, '').substring(0, 200) + '...',
    };

    console.log(`Successfully loaded post: ${slug}`, { title: postData.title, category: postData.category, cover: postData.cover });
    return postData;
  } catch (error) {
    console.error(`Failed to load post: ${slug}`, error);
    throw new Error(`Failed to load post: ${slug}`);
  }
}

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

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => post.category === category);
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => 
    post.tags && post.tags.includes(tag)
  );
}

export async function searchPosts(query: string): Promise<Post[]> {
  const allPosts = await getAllPosts();
  const lowercaseQuery = query.toLowerCase();
  
  return allPosts.filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.excerpt.toLowerCase().includes(lowercaseQuery) ||
    (post.tags && post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
  );
}

export async function getAllCategories(): Promise<string[]> {
  const allPosts = await getAllPosts();
  const categories = new Set(allPosts.map(post => post.category));
  return Array.from(categories).sort();
} 