import { getAllPosts, getAllCategories } from '@/lib/posts';
import { MainLayout } from '@/components/layout/main-layout';
import { Footer } from '@/components/layout/footer';
import { PostCard } from '@/components/post-card';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Lightbulb, FileText, Home } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import Link from 'next/link';

interface HomePageProps {
  searchParams: { page?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const posts = await getAllPosts();
  const categories = await getAllCategories();

  // Pagination logic
  const postsPerPage = 9;
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Calculate pagination
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

  // Get posts for current page
  const categoryStats = categories.map(category => {
    const count = posts.filter(post => post.category === category).length;
    return { category, count };
  });

  // Get latest posts by category
  const latestByCategory = categories.map(category => {
    const categoryPosts = posts.filter(post => post.category === category);
    return {
      category,
      latestPost: categoryPosts[0] // Latest post
    };
  });

  return (
    <>
      <MainLayout>
        <div className="mx-auto">
          <div className="space-y-8">
            {/* Hero section */}
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight">ESP32Cube</h1>
              <p className="text-muted-foreground mt-2">
                ESP32 development tutorials, project cases, and technical sharing
              </p>
            </div>

            <div>
              {posts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {currentPosts.map((post) => (
                      <PostCard key={post.slug} post={post} />
                    ))}
                  </div>

                  {/* All posts with pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    baseUrl="/"
                  />
                </>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No content available</h3>
                    <p className="text-muted-foreground text-center">
                      Please add Markdown files in the content folder
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
      <Footer />
    </>
  );
}
