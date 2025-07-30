import { db } from './db';

// 文章相关操作
export async function getPostStats(slug: string) {
  try {
    const [rows] = await db.execute(
      'SELECT views, likes FROM posts WHERE slug = ?',
      [slug]
    );
    return rows[0] || { views: 0, likes: 0 };
  } catch (error) {
    console.error('Error getting post stats:', error);
    return { views: 0, likes: 0 };
  }
}

export async function incrementViews(slug: string) {
  try {
    await db.execute(
      'INSERT INTO posts (slug, views) VALUES (?, 1) ON DUPLICATE KEY UPDATE views = views + 1',
      [slug]
    );
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
}

export async function toggleLike(slug: string, userId: string) {
  try {
    // 检查用户是否已经点赞
    const [existingLikes] = await db.execute(
      'SELECT id FROM user_likes WHERE user_id = ? AND post_slug = ?',
      [userId, slug]
    );

    if (Array.isArray(existingLikes) && existingLikes.length > 0) {
      // 取消点赞
      await db.execute(
        'DELETE FROM user_likes WHERE user_id = ? AND post_slug = ?',
        [userId, slug]
      );
      await db.execute(
        'UPDATE posts SET likes = likes - 1 WHERE slug = ?',
        [slug]
      );
      return { liked: false };
    } else {
      // 添加点赞
      await db.execute(
        'INSERT INTO user_likes (user_id, post_slug) VALUES (?, ?)',
        [userId, slug]
      );
      await db.execute(
        'INSERT INTO posts (slug, likes) VALUES (?, 1) ON DUPLICATE KEY UPDATE likes = likes + 1',
        [slug]
      );
      return { liked: true };
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
}

export async function checkUserLike(slug: string, userId: string) {
  try {
    const [rows] = await db.execute(
      'SELECT id FROM user_likes WHERE user_id = ? AND post_slug = ?',
      [userId, slug]
    );
    return Array.isArray(rows) && rows.length > 0;
  } catch (error) {
    console.error('Error checking user like:', error);
    return false;
  }
}

// 评论相关操作
export async function getComments(postSlug: string) {
  try {
    const [rows] = await db.execute(
      `SELECT c.*, u.name as user_name, u.image as user_image 
       FROM comments c 
       LEFT JOIN users u ON c.user_id = u.id 
       WHERE c.post_slug = ? 
       ORDER BY c.created_at DESC`,
      [postSlug]
    );
    return rows;
  } catch (error) {
    console.error('Error getting comments:', error);
    return [];
  }
}

export async function addComment(postSlug: string, content: string, userId?: string, authorName?: string, authorEmail?: string) {
  try {
    const [result] = await db.execute(
      'INSERT INTO comments (post_slug, user_id, author_name, author_email, content) VALUES (?, ?, ?, ?, ?)',
      [postSlug, userId || null, authorName || null, authorEmail || null, content]
    );
    return result;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}

// 初始化文章数据
export async function initializePostData(slug: string) {
  try {
    await db.execute(
      'INSERT IGNORE INTO posts (slug, views, likes) VALUES (?, 0, 0)',
      [slug]
    );
  } catch (error) {
    console.error('Error initializing post data:', error);
  }
} 