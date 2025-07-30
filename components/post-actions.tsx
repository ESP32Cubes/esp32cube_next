'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Heart, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostActionsProps {
    slug: string;
    initialLikes?: number;
    initialViews?: number;
}

export function PostActions({ slug, initialLikes = 0, initialViews = 0 }: PostActionsProps) {
    const { data: session } = useSession();
    const [likes, setLikes] = useState(initialLikes);
    const [views, setViews] = useState(initialViews);
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // 检查用户是否已点赞
    useEffect(() => {
        if (session?.user?.id) {
            fetch(`/api/posts/${slug}/like`)
                .then(res => res.json())
                .then(data => setIsLiked(data.liked))
                .catch(console.error);
        }
    }, [slug, session?.user?.id]);

    // 记录浏览量
    useEffect(() => {
        fetch(`/api/posts/${slug}/view`, { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setViews(prev => prev + 1);
                }
            })
            .catch(console.error);
    }, [slug]);

    const handleLike = async () => {
        if (!session?.user?.id) {
            // 可以在这里显示登录提示
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/posts/${slug}/like`, {
                method: 'POST',
            });
            const data = await response.json();

            if (data.liked) {
                setLikes(prev => prev + 1);
                setIsLiked(true);
            } else {
                setLikes(prev => prev - 1);
                setIsLiked(false);
            }
        } catch (error) {
            console.error('点赞失败:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{views}</span>
            </div>

            <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isLoading || !session?.user?.id}
                className={cn(
                    "flex items-center gap-1",
                    isLiked && "text-red-500"
                )}
            >
                <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                <span>{likes}</span>
            </Button>
        </div>
    );
} 