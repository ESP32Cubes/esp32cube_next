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
    
    // Decode URL-encoded image name
    const decodedImageName = decodeURIComponent(imageName);
    
    // Build the full path for the image file
    const imageFilePath = path.join(process.cwd(), 'content', 'images', decodedImageName);
    
    // Check if the file exists
    try {
      await fs.access(imageFilePath);
    } catch (error) {
      return new NextResponse('Image not found', { status: 404 });
    }
    
    // Read the image file
    const imageBuffer = await fs.readFile(imageFilePath);
    
    // Determine content type based on file extension
    const ext = path.extname(decodedImageName).toLowerCase();
    let contentType = 'image/jpeg'; // Default type
    
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
    
    // Return the image file
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