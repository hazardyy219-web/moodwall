import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { initDatabase } from './db/init.js';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import postsRoutes from './routes/posts.js';

const app = express();

app.use(
  cors({
    origin: config.corsOrigin === '*' ? true : config.corsOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', env: config.nodeEnv });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: '接口不存在' });
});

async function start() {
  try {
    await initDatabase();
    app.listen(config.port, () => {
      console.log(`[server] Running on port ${config.port} (${config.nodeEnv})`);
    });
  } catch (err) {
    console.error('[server] Failed to start:', err);
    process.exit(1);
  }
}

start();
