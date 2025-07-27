import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, User } from 'lucide-react';
import { Post } from '@/lib/posts';

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    // 生成随机浏览量（仅用于演示）
    const views = Math.floor(Math.random() * 5000) + 100;

    // 分类显示名称
    const getCategoryName = (category: string) => {
        switch (category) {
            case 'tutorials': return '教程';
            case 'projects': return '项目';
            case 'guides': return '指南';
            default: return category;
        }
    };

    return (
        <Link href={`/post/${post.slug}`} className="group block">
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] pt-0">
                {/* 封面图片 */}
                {post.cover && (
                    <div className="relative aspect-video overflow-hidden">
                        <img
                            src={post.cover}
                            alt={post.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300 m-0 border-b border-border"
                        />
                    </div>
                )}

                <CardHeader className="pb-3">
                    {/* 分类和日期信息 */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                                {getCategoryName(post.category)}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                            <time>
                                {post.date ? new Date(post.date).toLocaleDateString('zh-CN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }) : 'Unknown date'}
                            </time>
                        </div>
                    </div>

                    {/* 文章标题 */}
                    <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
                        {post.title}
                    </h3>
                </CardHeader>

                <CardContent className="pt-0">
                    {/* 摘要 */}
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {post.excerpt}
                    </p>

                    {/* 标签 */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                            {post.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                    #{tag}
                                </Badge>
                            ))}
                            {post.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{post.tags.length - 3}
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* 统计信息 */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            <span>0</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
} 