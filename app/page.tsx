import { getAllPosts } from '@/lib/posts';
import { MainLayout } from '@/components/layout/main-layout';
import { Footer } from '@/components/layout/footer';
import { PostCard } from '@/components/post-card';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const allPosts = await getAllPosts();
  // const categories = await getAllCategories(); // 暂时注释掉，因为未使用

  // Pagination logic
  const postsPerPage = 9;
  const currentPage = page;
  const totalPages = Math.ceil(allPosts.length / postsPerPage);

  // Calculate pagination
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = allPosts.slice(startIndex, endIndex);

  // Get posts for current page

  return (
    <>
      <MainLayout>
        {/* Hero section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">ESP32Cube</h1>
          <p className="text-muted-foreground mt-2">
            ESP32 development tutorials, project cases, and technical sharing
          </p>
        </div>

        <div>
          {allPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </MainLayout>
      <Footer />
    </>
  );
}
