import { getAllPosts } from '@/lib/posts';
import { MainLayout } from '@/components/layout/main-layout';
import { Footer } from '@/components/layout/footer';
import { PostCard } from '@/components/post-card';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';
import Link from 'next/link';

export default async function TagsPage() {
    const posts = await getAllPosts();

    // 收集所有标签
    const allTags = new Set<string>();
    posts.forEach(post => {
        if (post.tags) {
            post.tags.forEach(tag => allTags.add(tag));
        }
    });

    const tagsArray = Array.from(allTags).sort();

    return (
        <>
            <MainLayout>
                <div className="mx-auto">
                    <div className="space-y-8">
                        {/* 页面标题 */}
                        <div className="text-center">
                            <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
                            <p className="text-muted-foreground mt-2">
                                浏览所有标签
                            </p>
                        </div>

                        {/* 标签网格 */}
                        {tagsArray.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                {tagsArray.map((tag) => (
                                    <Link key={tag} href={`/tag/${tag}`}>
                                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                            <CardContent className="flex flex-col items-center justify-center py-6">
                                                <Tag className="h-8 w-8 text-muted-foreground mb-2" />
                                                <Badge variant="secondary" className="text-sm">
                                                    {tag}
                                                </Badge>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Tag className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">暂无标签</h3>
                                    <p className="text-muted-foreground text-center">
                                        请在文章中添加标签
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