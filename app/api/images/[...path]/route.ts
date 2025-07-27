import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: imagePath } = await params;
    const imageName = imagePath.join('/');
    
    // 构建图片文件的完整路径
    const imageFilePath = path.join(process.cwd(), 'content', 'images', imageName);
    
    // 检查文件是否存在
    try {
      await fs.access(imageFilePath);
    } catch (error) {
      return new NextResponse('Image not found', { status: 404 });
    }
    
    // 读取图片文件
    const imageBuffer = await fs.readFile(imageFilePath);
    
    // 根据文件扩展名确定 MIME 类型
    const ext = path.extname(imageName).toLowerCase();
    let contentType = 'image/jpeg'; // 默认类型
    
    switch (ext) {
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
      case '.jpg':
      case '.jpeg':
      default:
        contentType = 'image/jpeg';
        break;
    }
    
    // 返回图片文件
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 