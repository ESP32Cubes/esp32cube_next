import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { toggleLike, checkUserLike } from '@/lib/database';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '需要登录才能点赞' },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const result = await toggleLike(slug, session.user.id);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json(
      { error: '点赞失败' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession();
    const { slug } = await params;
    
    if (!session?.user?.id) {
      return NextResponse.json({ liked: false });
    }

    const liked = await checkUserLike(slug, session.user.id);
    return NextResponse.json({ liked });
  } catch (error) {
    console.error('Check like error:', error);
    return NextResponse.json({ liked: false });
  }
} 