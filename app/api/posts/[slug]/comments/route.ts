import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getComments, addComment } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const comments = await getComments(slug);
    
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { error: '获取评论失败' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession();
    const { slug } = await params;
    const { content, authorName, authorEmail } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: '评论内容不能为空' },
        { status: 400 }
      );
    }

    // 如果用户已登录，使用用户信息；否则使用游客信息
    const userId = session?.user?.id;
    const name = session?.user?.name || authorName;
    const email = session?.user?.email || authorEmail;

    if (!userId && (!name || !email)) {
      return NextResponse.json(
        { error: '游客评论需要提供姓名和邮箱' },
        { status: 400 }
      );
    }

    await addComment(slug, content.trim(), userId, name, email);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Add comment error:', error);
    return NextResponse.json(
      { error: '添加评论失败' },
      { status: 500 }
    );
  }
} 