import { Router } from 'express';
import { pool } from '../db/pool.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';
import { mapUser } from '../services/postMapper.js';
import { parseAvatar, stringifyAvatar } from '../utils/avatar.js';
import type { UserAvatar } from '../types.js';

const router = Router();

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, email, username, avatar FROM users WHERE id = $1',
      [id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: '用户不存在' });
      return;
    }

    res.json({ user: mapUser(result.rows[0]) });
  } catch (err) {
    console.error('[users/get]', err);
    res.status(500).json({ message: '获取用户失败' });
  }
});

router.patch('/profile', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const { displayName, avatar } = req.body as {
      displayName?: string;
      avatar?: UserAvatar;
    };

    const username = displayName?.trim();
    if (!username) {
      res.status(400).json({ message: '昵称不能为空' });
      return;
    }

    let avatarJson: string;
    if (avatar?.type === 'image' && avatar.value) {
      avatarJson = stringifyAvatar(avatar);
    } else if (avatar?.type === 'text') {
      avatarJson = stringifyAvatar({
        type: 'text',
        value: (avatar.value || username.charAt(0)).slice(0, 2),
      });
    } else {
      avatarJson = stringifyAvatar({ type: 'text', value: username.charAt(0) });
    }

    const result = await pool.query(
      `UPDATE users SET username = $1, avatar = $2 WHERE id = $3
       RETURNING id, email, username, avatar`,
      [username, avatarJson, userId],
    );

    res.json({ user: mapUser(result.rows[0]) });
  } catch (err) {
    console.error('[users/profile]', err);
    res.status(500).json({ message: '更新资料失败' });
  }
});

export default router;
