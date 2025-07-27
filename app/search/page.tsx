import { searchPosts } from '@/lib/posts';
import { MainLayout } from '@/components/layout/main-layout';
import { Footer } from '@/components/layout/footer';
import { PostCard } from '@/components/post-card';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';

interface SearchPageProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;
    const query = q || '';
    const posts = query ? await searchPosts(query) : [];

    return (
        <>
            <MainLayout>
                <div className="mx-auto">
                    <div className="space-y-8">
                        {/* 页面标题 */}
                        <div className="text-center">
                            <h1 className="text-3xl font-bold tracking-tight">Search</h1>
                            <p className="text-muted-foreground mt-2">
                                {query ? `搜索: "${query}"` : '输入关键词搜索文章'}
                            </p>
                        </div>

                        {/* 搜索结果 */}
                        {query && (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <p className="text-muted-foreground">
                                        找到 {posts.length} 篇相关文章
                                    </p>
                                </div>

                                {posts.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {posts.map((post) => (
                                            <PostCard key={post.slug} post={post} />
                                        ))}
                                    </div>
                                ) : (
                                    <Card>
                                        <CardContent className="flex flex-col items-center justify-center py-12">
                                            <Search className="h-12 w-12 text-muted-foreground mb-4" />
                                            <h3 className="text-lg font-semibold mb-2">未找到相关文章</h3>
                                            <p className="text-muted-foreground text-center">
                                                请尝试其他关键词
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        )}

                        {/* 搜索提示 */}
                        {!query && (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">开始搜索</h3>
                                    <p className="text-muted-foreground text-center">
                                        在地址栏添加 ?q=关键词 来搜索文章
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