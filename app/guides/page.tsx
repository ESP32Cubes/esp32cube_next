import { getPostsByCategory } from '@/lib/posts';
import { MainLayout } from '@/components/layout/main-layout';
import { Footer } from '@/components/layout/footer';
import { PostCard } from '@/components/post-card';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default async function GuidesPage() {
    const posts = await getPostsByCategory('guides');

    return (
        <>
            <MainLayout>
                <div className="mx-auto">
                    <div className="space-y-8">
                        {/* Page header */}
                        <div className="text-center">
                            <h1 className="text-3xl font-bold tracking-tight">Guides</h1>
                            <p className="text-muted-foreground mt-2">
                                ESP32 development guides and reference materials
                            </p>
                        </div>

                        {/* Posts grid */}
                        {posts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {posts.map((post) => (
                                    <PostCard key={post.slug} post={post} />
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No guides found</h3>
                                    <p className="text-muted-foreground text-center">
                                        Please add Markdown files in the content/guides folder
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