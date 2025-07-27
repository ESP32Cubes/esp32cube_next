import { getPostsByTag, getAllPosts } from '@/lib/posts';
import { MainLayout } from '@/components/layout/main-layout';
import { Footer } from '@/components/layout/footer';
import { PostCard } from '@/components/post-card';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
    const { tag } = await params;
    const posts = await getPostsByTag(tag);
    const allPosts = await getAllPosts();

    // 收集所有标签用于侧边栏
    const allTags = new Set<string>();
    allPosts.forEach(post => {
        if (post.tags) {
            post.tags.forEach(t => allTags.add(t));
        }
    });

    const tagsArray = Array.from(allTags).sort();

    return (
        <>
            <MainLayout>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* 主要内容区域 */}
                    <div className="lg:col-span-3">
                        <div className="space-y-6">
                            {/* 页面标题 */}
                            <div className="flex items-center gap-4">
                                <Link href="/tags">
                                    <ArrowLeft className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                                </Link>
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">#{tag}</h1>
                                    <p className="text-muted-foreground mt-1">
                                        {posts.length} 篇文章
                                    </p>
                                </div>
                            </div>

                            {/* 文章列表 */}
                            {posts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {posts.map((post) => (
                                        <PostCard key={post.slug} post={post} />
                                    ))}
                                </div>
                            ) : (
                                <Card>
                                    <CardContent className="flex flex-col items-center justify-center py-12">
                                        <Tag className="h-12 w-12 text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">暂无文章</h3>
                                        <p className="text-muted-foreground text-center">
                                            该标签下暂无文章
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>

                    {/* 侧边栏 */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-4">所有标签</h3>
                                <div className="flex flex-wrap gap-2">
                                    {tagsArray.map((t) => (
                                        <Link key={t} href={`/tag/${t}`}>
                                            <Badge
                                                variant={t === tag ? "default" : "secondary"}
                                                className="cursor-pointer hover:bg-primary/80 transition-colors"
                                            >
                                                {t}
                                            </Badge>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </MainLayout>
            <Footer />
        </>
    );
} 