import { getPostData, getAllPosts } from '@/lib/posts';
import { MainLayout } from '@/components/layout/main-layout';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Link from 'next/link';
import { Calendar, User, Tag, ArrowLeft, FolderOpen } from 'lucide-react';
import { PostContent } from '@/components/post-content';
import { getThemeConfig } from '@/lib/server-config';

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    try {
        const postData = await getPostData(slug);
        const allPosts = await getAllPosts();
        const themeConfig = await getThemeConfig();

        return (
            <>
                <MainLayout>
                    <div className="w-full mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                            {/* 左侧主要内容区域 */}
                            <div className="lg:col-span-3">

                                {/* 文章头部 */}
                                <Card className="mb-8 pt-0 overflow-hidden">
                                    {postData.cover && (
                                        <div className="relative h-64 overflow-hidden">
                                            <img
                                                src={postData.cover}
                                                alt={postData.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <CardHeader>
                                        <h1 className="text-3xl font-bold mb-4">{postData.title}</h1>
                                        <div className="flex items-center gap-4 text-gray-600 mb-4">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                <span>{postData.author}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{postData.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link href={`/${postData.category}`} className="hover:text-primary transition-colors">
                                                    <div className="flex items-center gap-2">
                                                        <FolderOpen className="w-4 h-4" />
                                                        <span>
                                                            {postData.category === 'tutorials' ? '教程' :
                                                                postData.category === 'projects' ? '项目' :
                                                                    postData.category === 'guides' ? '指南' : postData.category}
                                                        </span>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                        {postData.tags && postData.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {postData.tags.map((tag: string) => (
                                                    <Link key={tag} href={`/tag/${tag}`}>
                                                        <Badge variant="secondary" className="cursor-pointer">
                                                            <Tag className="w-3 h-3 mr-1" />
                                                            {tag}
                                                        </Badge>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </CardHeader>

                                    {/* 文章内容 */}
                                    <CardContent className="pb-8">
                                        <PostContent
                                            content={postData.content}
                                            codeTheme={themeConfig.codeTheme}
                                        />
                                    </CardContent>
                                </Card>
                            </div>

                            {/* 右侧侧边栏 */}
                            <div className="lg:col-span-1">
                                <div className="space-y-6">

                                    {/* 最新文章 */}
                                    <Card>
                                        <CardHeader>
                                            <h3 className="text-lg font-semibold">最新文章</h3>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {allPosts.slice(0, 5).map((post) => (
                                                    <Link key={post.slug} href={`/post/${post.slug}`}>
                                                        <div className="text-sm text-primary hover:text-primary/80 transition-colors cursor-pointer">
                                                            {post.title}
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* 相关文章 */}
                                    <Card>
                                        <CardHeader>
                                            <h3 className="text-lg font-semibold">相关文章</h3>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {allPosts
                                                    .filter(post =>
                                                        post.category === postData.category &&
                                                        post.slug !== postData.slug
                                                    )
                                                    .slice(0, 5)
                                                    .map((post) => (
                                                        <Link key={post.slug} href={`/post/${post.slug}`}>
                                                            <div className="text-sm text-primary hover:text-primary/80 transition-colors cursor-pointer">
                                                                {post.title}
                                                            </div>
                                                        </Link>
                                                    ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </MainLayout>
                <Footer />
            </>
        );
    } catch (error) {
        console.error('Error loading post:', error);
        return (
            <>
                <MainLayout>
                    <div className="max-w-4xl mx-auto text-center py-12">
                        <h1 className="text-2xl font-bold mb-4">文章未找到</h1>
                        <p className="text-gray-600 mb-6">无法找到slug为 "{slug}" 的文章</p>
                        <Link href="/">
                            <Button>返回首页</Button>
                        </Link>
                    </div>
                </MainLayout>
                <Footer />
            </>
        );
    }
} 