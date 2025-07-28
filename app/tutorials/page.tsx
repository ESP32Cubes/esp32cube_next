import { getPostsByCategory } from '@/lib/posts';
import { MainLayout } from '@/components/layout/main-layout';
import { Footer } from '@/components/layout/footer';
import { PostCard } from '@/components/post-card';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';

interface TutorialsPageProps {
    searchParams: Promise<{ page?: string }>;
}

export default async function TutorialsPage({ searchParams }: TutorialsPageProps) {
    const posts = await getPostsByCategory('tutorials');

    // Pagination logic
    const postsPerPage = 12;
    const params = await searchParams;
    const currentPage = params.page ? parseInt(params.page) : 1;
    const totalPages = Math.ceil(posts.length / postsPerPage);

    // Calculate pagination
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = posts.slice(startIndex, endIndex);

    return (
        <>
            <MainLayout>
                {/* Page header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Tutorials</h1>
                    <p className="text-muted-foreground mt-2">
                        ESP32 development tutorials and guides
                    </p>
                </div>

                {/* Posts grid */}
                {posts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentPosts.map((post) => (
                                <PostCard key={post.slug} post={post} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            baseUrl="/tutorials"
                        />
                    </>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No tutorials yet</h3>
                            <p className="text-muted-foreground text-center">
                                Please add Markdown files in the content/tutorials folder
                            </p>
                        </CardContent>
                    </Card>
                )}
            </MainLayout>
            <Footer />
        </>
    );
} 