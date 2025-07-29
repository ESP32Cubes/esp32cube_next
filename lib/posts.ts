import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Post {
  filename: string;
  title: string;
  slug: string;
  category: string;
  cover?: string;
  created_at?: string;
  updated_at?: string;
  excerpt: string;
  summary?: string;
  tags?: string[];
  author?: string;
  views?: number;
  likes?: number;
}

export interface PostData extends Post {
  content: string;
}

const contentDirectory = path.join(process.cwd(), 'content');
const fallbackCovers = ['/1.jpg', '/2.jpg', '/3.jpg', '/4.jpg', '/5.jpg', '/6.jpg', '/7.jpg', '/8.jpg', '/9.jpg', '/10.jpg'];

function getRandomCover(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash) + slug.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % fallbackCovers.length;
  return fallbackCovers[idx];
}

function processCoverPath(coverPath: string): string {
  // If it's already a full path (starts with /) or an external link, return directly
  if (coverPath.startsWith('/') || coverPath.startsWith('http')) {
    return coverPath;
  }
  
  // URL encode image paths to handle spaces and special characters
  const encodedCoverPath = encodeURIComponent(coverPath);
  
  // All relative image paths are assumed to be in the content/images directory
  return `/content/images/${encodedCoverPath}`;
}

function processMarkdownLinks(content: string): string {
  // Process internal article links: [Article Title](ArticleFileName.md)
  content = content.replace(
    /\[([^\]]+)\]\(([^)]+\.md)\)/g,
    (match, title, filename) => {
      const slug = filename.replace('.md', '');
      const cleanSlug = slug.replace(/^\d{1,3}-/, '');
      return `[${title}](/post/${cleanSlug})`;
    }
  );

  // Process Obsidian-style image links: ![[filename]]
  content = content.replace(
    /!\[\[([^\]]+)\]\]/g,
    (match, filename) => {
      return `![](${filename})`;
    }
  );

  // Process standard Markdown image links: ![](imageFileName)
  content = content.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (match, alt, imagePath) => {
      // If it's already a full path or an external link, return directly
      if (imagePath.startsWith('/') || imagePath.startsWith('http')) {
        return match;
      }
      
      // URL encode image paths to handle spaces and special characters
      const encodedImagePath = encodeURIComponent(imagePath);
      
      // All relative image paths are assumed to be in the content/images directory
      const fullImagePath = `/content/images/${encodedImagePath}`;
      return `![${alt}](${fullImagePath})`;
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

        const processedContent = processMarkdownLinks(content);

        const excerpt = processedContent
          .replace(/[#*`]/g, '')
          .replace(/\n/g, ' ')
          .substring(0, 200) + '...';

        const slug = data.slug || path.basename(relativePath, '.md');
        const cover = data.cover && data.cover.trim() ? processCoverPath(data.cover) : getRandomCover(slug);

        return {
          filename: path.basename(relativePath),
          title: data.title || path.basename(relativePath, '.md'),
          slug,
          category,
          cover,
          created_at: data.created_at ? String(data.created_at) : '',
          updated_at: data.updated_at ? String(data.updated_at) : '',
          excerpt,
          summary: data.summary || '',
          tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
          author: data.author || '',
          views: data.views ? Number(data.views) : 0,
          likes: data.likes ? Number(data.likes) : 0,
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
      if (!a.updated_at || !b.updated_at) return 0;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
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
    
    const processedContent = processMarkdownLinks(content);

    const cover = data.cover && data.cover.trim() ? processCoverPath(data.cover) : getRandomCover(slug);

    const postData = {
      filename: path.basename(targetFile.relativePath),
      title: data.title || slug,
      slug: data.slug || slug,
      category: targetFile.category,
      cover,
      content: processedContent,
      created_at: data.created_at ? String(data.created_at) : '',
      updated_at: data.updated_at ? String(data.updated_at) : '',
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
      author: data.author || '',
      summary: data.summary || '',
      excerpt: processedContent.replace(/[#*`]/g, '').substring(0, 200) + '...',
      views: data.views ? Number(data.views) : 0,
      likes: data.likes ? Number(data.likes) : 0,
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