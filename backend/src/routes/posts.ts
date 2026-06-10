import { Router } from 'express';
import { pool } from '../db/pool.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';
import { mapComment, mapPost, type CommentRow, type PostRow } from '../services/postMapper.js';

const router = Router();

const MOOD_TAGS = ['happy', 'calm', 'sad', 'motivated'];

async function fetchCommentsForPosts(postIds: string[]): Promise<CommentRow[]> {
  if (postIds.length === 0) {
    return [];
  }
  const result = await pool.query(
    `SELECT c.id, c.post_id, c.user_id, c.content, c.created_at,
            u.email, u.username, u.avatar
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.post_id = ANY($1::uuid[])
     ORDER BY c.created_at DESC`,
    [postIds],
  );
  return result.rows as CommentRow[];
}

async function fetchSinglePost(postId: string, userId: string) {
  const postsResult = await pool.query(
    `SELECT p.id, p.content, p.tag, p.created_at,
            u.id AS author_id, u.email, u.username, u.avatar,
            COUNT(l.id)::int AS like_count,
            EXISTS(
              SELECT 1 FROM likes lk
              WHERE lk.post_id = p.id AND lk.user_id = $2
            ) AS is_liked
     FROM posts p
     JOIN users u ON p.user_id = u.id
     LEFT JOIN likes l ON l.post_id = p.id
     WHERE p.id = $1
     GROUP BY p.id, u.id`,
    [postId, userId],
  );

  if (postsResult.rows.length === 0) {
    return null;
  }

  const comments = await fetchCommentsForPosts([postId]);
  return mapPost(postsResult.rows[0] as PostRow, comments);
}

async function fetchPosts(
  userId: string,
  limit: number,
  offset: number,
  filterUserId?: string,
) {
  const params: string[] = [userId, limit, offset];
  let whereClause = '';
  if (filterUserId) {
    whereClause = 'WHERE p.user_id = $4';
    params.push(filterUserId);
  }

  const postsResult = await pool.query(
    `SELECT p.id, p.content, p.tag, p.created_at,
            u.id AS author_id, u.email, u.username, u.avatar,
            COUNT(l.id)::int AS like_count,
            EXISTS(
              SELECT 1 FROM likes lk
              WHERE lk.post_id = p.id AND lk.user_id = $1
            ) AS is_liked
     FROM posts p
     JOIN users u ON p.user_id = u.id
     LEFT JOIN likes l ON l.post_id = p.id
     ${whereClause}
     GROUP BY p.id, u.id
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    params,
  );

  const postRows = postsResult.rows as PostRow[];
  const postIds = postRows.map((p) => p.id);
  const comments = await fetchCommentsForPosts(postIds);

  return postRows.map((row) => mapPost(row, comments));
}

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const countResult = await pool.query('SELECT COUNT(*)::int AS total FROM posts');
    const total = countResult.rows[0]?.total ?? 0;

    const posts = await fetchPosts(userId, limit, offset);

    res.json({
      posts,
      page,
      limit,
      total,
      hasMore: offset + posts.length < total,
    });
  } catch (err) {
    console.error('[posts/list]', err);
    res.status(500).json({ message: '获取留言失败' });
  }
});

router.get('/mine', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const countResult = await pool.query(
      'SELECT COUNT(*)::int AS total FROM posts WHERE user_id = $1',
      [userId],
    );
    const total = countResult.rows[0]?.total ?? 0;

    const posts = await fetchPosts(userId, limit, offset, userId);

    res.json({
      posts,
      page,
      limit,
      total,
      hasMore: offset + posts.length < total,
    });
  } catch (err) {
    console.error('[posts/mine]', err);
    res.status(500).json({ message: '获取个人留言失败' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const { content, mood, tag } = req.body as {
      content?: string;
      mood?: string;
      tag?: string;
    };

    const moodTag = mood || tag;
    const trimmed = content?.trim();

    if (!trimmed) {
      res.status(400).json({ message: '内容不能为空' });
      return;
    }

    if (!moodTag || !MOOD_TAGS.includes(moodTag)) {
      res.status(400).json({ message: '无效的心情标签' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO posts (user_id, content, tag) VALUES ($1, $2, $3) RETURNING id`,
      [userId, trimmed, moodTag],
    );

    const postId = result.rows[0].id;
    const created = await fetchSinglePost(postId, userId);

    if (!created) {
      res.status(500).json({ message: '发布成功但读取失败' });
      return;
    }

    res.status(201).json({ post: created });
  } catch (err) {
    console.error('[posts/create]', err);
    res.status(500).json({ message: '发布失败' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const postId = req.params.id;

    const owner = await pool.query('SELECT user_id FROM posts WHERE id = $1', [postId]);
    if (owner.rows.length === 0) {
      res.status(404).json({ message: '留言不存在' });
      return;
    }

    if (owner.rows[0].user_id !== userId) {
      res.status(403).json({ message: '无权删除此留言' });
      return;
    }

    await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
    res.json({ message: '删除成功' });
  } catch (err) {
    console.error('[posts/delete]', err);
    res.status(500).json({ message: '删除失败' });
  }
});

router.post('/:id/comments', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const postId = req.params.id;
    const { content } = req.body as { content?: string };
    const trimmed = content?.trim();

    if (!trimmed) {
      res.status(400).json({ message: '评论内容不能为空' });
      return;
    }

    const postExists = await pool.query('SELECT id FROM posts WHERE id = $1', [postId]);
    if (postExists.rows.length === 0) {
      res.status(404).json({ message: '留言不存在' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO comments (post_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, post_id, user_id, content, created_at`,
      [postId, userId, trimmed],
    );

    const userResult = await pool.query(
      'SELECT email, username, avatar FROM users WHERE id = $1',
      [userId],
    );

    const row = {
      ...result.rows[0],
      email: userResult.rows[0].email,
      username: userResult.rows[0].username,
      avatar: userResult.rows[0].avatar,
    } as CommentRow;

    res.status(201).json({ comment: mapComment(row) });
  } catch (err) {
    console.error('[posts/comment]', err);
    res.status(500).json({ message: '评论失败' });
  }
});

router.delete('/:postId/comments/:commentId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const { commentId } = req.params;

    const comment = await pool.query('SELECT user_id FROM comments WHERE id = $1', [commentId]);
    if (comment.rows.length === 0) {
      res.status(404).json({ message: '评论不存在' });
      return;
    }

    if (comment.rows[0].user_id !== userId) {
      res.status(403).json({ message: '无权删除此评论' });
      return;
    }

    await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);
    res.json({ message: '删除成功' });
  } catch (err) {
    console.error('[posts/delete-comment]', err);
    res.status(500).json({ message: '删除评论失败' });
  }
});

router.post('/:id/like', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const postId = req.params.id;

    const postExists = await pool.query('SELECT id FROM posts WHERE id = $1', [postId]);
    if (postExists.rows.length === 0) {
      res.status(404).json({ message: '留言不存在' });
      return;
    }

    const existing = await pool.query(
      'SELECT id FROM likes WHERE post_id = $1 AND user_id = $2',
      [postId, userId],
    );

    let isLiked: boolean;

    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM likes WHERE post_id = $1 AND user_id = $2', [postId, userId]);
      isLiked = false;
    } else {
      await pool.query('INSERT INTO likes (post_id, user_id) VALUES ($1, $2)', [postId, userId]);
      isLiked = true;
    }

    const countResult = await pool.query(
      'SELECT COUNT(*)::int AS count FROM likes WHERE post_id = $1',
      [postId],
    );

    res.json({
      isLiked,
      likeCount: countResult.rows[0]?.count ?? 0,
    });
  } catch (err) {
    console.error('[posts/like]', err);
    res.status(500).json({ message: '点赞操作失败' });
  }
});

export default router;
