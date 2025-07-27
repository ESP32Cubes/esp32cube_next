import { getAllPosts, getAllCategories } from '@/lib/posts';
import { MainLayout } from '@/components/layout/main-layout';
import { Footer } from '@/components/layout/footer';
import { PostCard } from '@/components/post-card';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Lightbulb, FileText, Home } from 'lucide-react';
import Link from 'next/link';

export default async function HomePage() {
  const posts = await getAllPosts();
  const categories = await getAllCategories();

  // 按分类统计文章数量
  const categoryStats = categories.map(category => {
    const count = posts.filter(post => post.category === category).length;
    return { category, count };
  });

  // 获取每个分类的最新文章
  const latestByCategory = categories.map(category => {
    const categoryPosts = posts.filter(post => post.category === category);
    return {
      category,
      latestPost: categoryPosts[0] // 最新的文章
    };
  });

  return (
    <>
      <MainLayout>
        <div className="mx-auto">
          <div className="space-y-8">
            {/* 页面标题 */}
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight">ESP32Cube</h1>
              <p className="text-muted-foreground mt-2">
                ESP32 开发教程、项目案例、技术分享
              </p>
            </div>

            {/* 最新文章 */}
            <div>
              {posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {posts.slice(0, 8).map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">暂无文章内容</h3>
                    <p className="text-muted-foreground text-center">
                      请在 content 文件夹中添加 Markdown 文件
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* 分类最新文章 */}
            {latestByCategory.length > 0 && (
              <div className="space-y-6">
                {latestByCategory.map(({ category, latestPost }) => (
                  latestPost && (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">
                          {category === 'tutorials' ? '最新教程' :
                            category === 'projects' ? '最新项目' :
                              category === 'guides' ? '最新指南' : `最新${category}`}
                        </h2>
                        <Link href={`/${category}`}>
                          <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                            查看全部
                          </Badge>
                        </Link>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <PostCard post={latestPost} />
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </MainLayout>
      <Footer />
    </>
  );
}
