'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Send } from 'lucide-react';

interface Comment {
    id: number;
    content: string;
    author_name: string;
    author_email: string;
    user_name?: string;
    user_image?: string;
    created_at: string;
}

interface CommentsSectionProps {
    postSlug: string;
}

export function CommentsSection({ postSlug }: CommentsSectionProps) {
    const { data: session } = useSession();
    const [comments, setComments] = useState<Comment[]>([]);
    const [content, setContent] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [authorEmail, setAuthorEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 加载评论
    useEffect(() => {
        fetchComments();
    }, [postSlug]);

    const fetchComments = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/posts/${postSlug}/comments`);
            const data = await response.json();
            setComments(data);
        } catch (error) {
            console.error('获取评论失败:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/posts/${postSlug}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: content.trim(),
                    authorName: session?.user?.name || authorName,
                    authorEmail: session?.user?.email || authorEmail,
                }),
            });

            if (response.ok) {
                setContent('');
                if (!session?.user) {
                    setAuthorName('');
                    setAuthorEmail('');
                }
                fetchComments(); // 重新加载评论
            } else {
                const error = await response.json();
                alert(error.error || '评论提交失败');
            }
        } catch (error) {
            console.error('提交评论失败:', error);
            alert('评论提交失败');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    评论 ({comments.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* 评论表单 */}
                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="space-y-4">
                        {!session?.user && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    placeholder="您的姓名"
                                    value={authorName}
                                    onChange={(e) => setAuthorName(e.target.value)}
                                    required
                                />
                                <Input
                                    type="email"
                                    placeholder="您的邮箱"
                                    value={authorEmail}
                                    onChange={(e) => setAuthorEmail(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                        <Textarea
                            placeholder="写下您的评论..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={3}
                            required
                        />
                        <Button type="submit" disabled={isSubmitting || !content.trim()}>
                            <Send className="w-4 h-4 mr-2" />
                            {isSubmitting ? '提交中...' : '发表评论'}
                        </Button>
                    </div>
                </form>

                {/* 评论列表 */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="text-center py-4">加载评论中...</div>
                    ) : comments.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                            还没有评论，来发表第一条评论吧！
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3 p-4 border rounded-lg">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={comment.user_image || ''} />
                                    <AvatarFallback>
                                        {(comment.user_name || comment.author_name)?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium">
                                            {comment.user_name || comment.author_name}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(comment.created_at).toLocaleDateString('zh-CN')}
                                        </span>
                                    </div>
                                    <p className="text-sm">{comment.content}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 