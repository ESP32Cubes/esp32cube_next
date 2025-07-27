import { promises as fs } from 'fs';
import path from 'path';

export interface SiteConfig {
  site: {
    name: string;
    title: string;
    description: string;
    url: string;
    version: string;
    author: string;
    email: string;
  };
  database: {
    type: string;
    path: string;
    host: string;
    port: number;
    name: string;
    username: string;
    password: string;
  };
  content: {
    directory: string;
    supportedFormats: string[];
    defaultAuthor: string;
    defaultTags: string[];
    pagination: {
      postsPerPage: number;
      maxPages: number;
    };
  };
  social: {
    github: string;
    twitter: string;
    discord: string;
    youtube: string;
  };
  features: {
    search: boolean;
    tags: boolean;
    comments: boolean;
    analytics: boolean;
    rss: boolean;
    sitemap: boolean;
  };
  theme: {
    defaultMode: string;
    codeTheme: string;
    enableDarkMode: boolean;
  };
  seo: {
    googleAnalytics: string;
    baiduAnalytics: string;
    keywords: string;
    robots: string;
  };
}

let configCache: SiteConfig | null = null;

export async function getConfig(): Promise<SiteConfig> {
  if (configCache) {
    return configCache;
  }

  try {
    const configPath = path.join(process.cwd(), 'config', 'site.json');
    const configData = await fs.readFile(configPath, 'utf-8');
    const parsedConfig = JSON.parse(configData) as SiteConfig;
    configCache = parsedConfig;
    return configCache;
  } catch (error) {
    console.error('Failed to load config:', error);
    // 返回默认配置
    const defaultConfig: SiteConfig = {
      site: {
        name: 'ESP32Cube',
        title: 'ESP32Cube - ESP32 开发教程与资源',
        description: 'ESP32 开发教程、项目案例、技术分享',
        url: 'https://esp32cube.com',
        version: '0.8.1',
        author: 'ESP32Cube Team',
        email: 'contact@esp32cube.com'
      },
      database: {
        type: 'sqlite',
        path: './data/posts.db',
        host: 'localhost',
        port: 5432,
        name: 'esp32cube_db',
        username: '',
        password: ''
      },
      content: {
        directory: './content',
        supportedFormats: ['.md', '.markdown'],
        defaultAuthor: 'ESP32Cube',
        defaultTags: ['ESP32', 'Arduino', 'IoT'],
        pagination: {
          postsPerPage: 10,
          maxPages: 50
        }
      },
      social: {
        github: 'https://github.com/esp32cube',
        twitter: 'https://twitter.com/esp32cube',
        discord: 'https://discord.gg/esp32cube',
        youtube: 'https://youtube.com/@esp32cube'
      },
      features: {
        search: true,
        tags: true,
        comments: false,
        analytics: true,
        rss: true,
        sitemap: true
      },
      theme: {
        defaultMode: 'light',
        codeTheme: 'github',
        enableDarkMode: true
      },
      seo: {
        googleAnalytics: '',
        baiduAnalytics: '',
        keywords: 'ESP32, Arduino, IoT, 物联网, 开发教程',
        robots: 'index, follow'
      }
    };
    configCache = defaultConfig;
    return configCache;
  }
}

// 便捷函数
export async function getSiteInfo() {
  const config = await getConfig();
  return config.site;
}

export async function getDatabaseConfig() {
  const config = await getConfig();
  return config.database;
}

export async function getThemeConfig() {
  const config = await getConfig();
  return config.theme;
}

export async function getSocialLinks() {
  const config = await getConfig();
  return config.social;
} 