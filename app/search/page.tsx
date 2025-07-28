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
                {/* Search header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Search</h1>
                    <p className="text-muted-foreground mt-2">
                        {query ? `Search: "${query}"` : 'Enter keywords to search articles'}
                    </p>
                </div>

                {/* Search results */}
                {query && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <p className="text-muted-foreground">
                                Found {posts.length} related articles
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
                                    <h3 className="text-lg font-semibold mb-2">No related articles found</h3>
                                    <p className="text-muted-foreground text-center">
                                        Please try other keywords
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                {/* Search hint */}
                {!query && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Search className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Start searching</h3>
                            <p className="text-muted-foreground text-center">
                                Add ?q=keywords to the address bar to search articles
                            </p>
                        </CardContent>
                    </Card>
                )}
            </MainLayout>
            <Footer />
        </>
    );
} 