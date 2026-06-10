import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db/pool.js';
import { config } from '../config.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';
import { defaultAvatarFromName, parseAvatar } from '../utils/avatar.js';
import { mapUser } from '../services/postMapper.js';

const router = Router();

function createToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, config.jwtSecret, { expiresIn: '7d' });
}

router.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body as {
      email?: string;
      password?: string;
      username?: string;
    };

    if (!email?.trim() || !password) {
      res.status(400).json({ message: '邮箱和密码不能为空' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ message: '密码至少 8 位' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const displayName =
      username?.trim() || normalizedEmail.split('@')[0] || 'User';
    const avatar = defaultAvatarFromName(displayName);
    const hashed = await bcrypt.hash(password, 10);

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [
      normalizedEmail,
    ]);
    if (existing.rows.length > 0) {
      res.status(409).json({ message: '该邮箱已注册' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO users (email, username, avatar, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, username, avatar`,
      [normalizedEmail, displayName, JSON.stringify(avatar), hashed],
    );

    const user = mapUser(result.rows[0]);
    const token = createToken(user.id, user.email);

    res.status(201).json({ token, user });
  } catch (err) {
    console.error('[auth/register]', err);
    res.status(500).json({ message: '注册失败' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email?.trim() || !password) {
      res.status(400).json({ message: '邮箱和密码不能为空' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const result = await pool.query(
      'SELECT id, email, username, avatar, password FROM users WHERE email = $1',
      [normalizedEmail],
    );

    if (result.rows.length === 0) {
      res.status(401).json({ message: '邮箱或密码错误' });
      return;
    }

    const row = result.rows[0];
    const valid = await bcrypt.compare(password, row.password);
    if (!valid) {
      res.status(401).json({ message: '邮箱或密码错误' });
      return;
    }

    const user = mapUser(row);
    const token = createToken(user.id, user.email);

    res.json({ token, user });
  } catch (err) {
    console.error('[auth/login]', err);
    res.status(500).json({ message: '登录失败' });
  }
});

router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const result = await pool.query(
      'SELECT id, email, username, avatar FROM users WHERE id = $1',
      [userId],
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: '用户不存在' });
      return;
    }

    res.json({ user: mapUser(result.rows[0]) });
  } catch (err) {
    console.error('[auth/me]', err);
    res.status(500).json({ message: '获取用户信息失败' });
  }
});

export default router;
