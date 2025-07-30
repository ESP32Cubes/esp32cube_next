import { NextRequest, NextResponse } from 'next/server';
import { incrementViews } from '@/lib/database';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await incrementViews(slug);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('View increment error:', error);
    return NextResponse.json(
      { error: '浏览量统计失败' },
      { status: 500 }
    );
  }
} 