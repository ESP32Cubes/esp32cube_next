import { getPostsByCategory } from '@/lib/posts';
import { MainLayout } from '@/components/layout/main-layout';
import { Footer } from '@/components/layout/footer';
import { PostCard } from '@/components/post-card';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

export default async function ProjectsPage() {
    const posts = await getPostsByCategory('projects');

    return (
        <>
            <MainLayout>
                <div className="mx-auto">
                    <div className="space-y-8">
                        {/* 页面标题 */}
                        <div className="text-center">
                            <h1 className="text-3xl font-bold tracking-tight">项目 (Projects)</h1>
                            <p className="text-muted-foreground mt-2">
                                ESP32 项目案例和实践
                            </p>
                        </div>

                        {/* 文章网格 */}
                        {posts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {posts.map((post) => (
                                    <PostCard key={post.slug} post={post} />
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">暂无项目</h3>
                                    <p className="text-muted-foreground text-center">
                                        请在 content/projects 文件夹中添加 Markdown 文件
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </MainLayout>
            <Footer />
        </>
    );
} 