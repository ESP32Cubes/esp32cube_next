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

    // Collect all tags for the sidebar
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
                    {/* Main content area */}
                    <div className="lg:col-span-3">
                        <div className="space-y-6">
                            {/* Page header */}
                            <div className="flex items-center gap-4">
                                <Link href="/tags">
                                    <ArrowLeft className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                                </Link>
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">#{tag}</h1>
                                    <p className="text-muted-foreground mt-1">
                                        {posts.length} articles
                                    </p>
                                </div>
                            </div>

                            {/* Posts grid */}
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
                                        <h3 className="text-lg font-semibold mb-2">No articles yet</h3>
                                        <p className="text-muted-foreground text-center">
                                            No articles under this tag yet
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-4">All Tags</h3>
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