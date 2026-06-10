import type { UserAvatar } from '../types/auth';
import type { MoodComment, MoodPost, MoodWallStorageData } from '../types/moodWall';
import { createDefaultAvatar, createUserIdFromEmail } from '../utils/userId';

const STORAGE_KEY = 'apex-mood-wall';

const EMPTY_DATA: MoodWallStorageData = {
  posts: [],
  likes: {},
};

function normalizeAvatar(name: string, avatar?: UserAvatar): UserAvatar {
  if (avatar?.type === 'image' && avatar.value) {
    return avatar;
  }
  if (avatar?.type === 'text' && avatar.value) {
    return avatar;
  }
  return createDefaultAvatar(name);
}

function migrateComment(comment: MoodComment & { authorId?: string; authorAvatar?: UserAvatar }): MoodComment {
  const authorId = comment.authorId ?? createUserIdFromEmail(comment.authorEmail);
  return {
    ...comment,
    authorId,
    authorAvatar: normalizeAvatar(comment.authorName, comment.authorAvatar),
  };
}

function migratePost(post: MoodPost & { authorId?: string; authorAvatar?: UserAvatar }): MoodPost {
  const authorId = post.authorId ?? createUserIdFromEmail(post.authorEmail);
  return {
    ...post,
    authorId,
    authorAvatar: normalizeAvatar(post.authorName, post.authorAvatar),
    comments: (post.comments ?? []).map(migrateComment),
  };
}

/** 迁移点赞数据：email → userId */
function migrateLikes(
  likes: Record<string, string[]>,
  posts: MoodPost[],
): Record<string, string[]> {
  const emailToId = new Map<string, string>();
  posts.forEach((p) => emailToId.set(p.authorEmail, p.authorId));

  const migrated: Record<string, string[]> = {};
  Object.entries(likes).forEach(([postId, likers]) => {
    migrated[postId] = likers.map((id) => {
      if (id.startsWith('user-')) {
        return id;
      }
      return emailToId.get(id) ?? createUserIdFromEmail(id);
    });
  });
  return migrated;
}

/** 从 localStorage 读取心情墙数据（含旧数据迁移） */
export function readMoodWallData(): MoodWallStorageData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...EMPTY_DATA };
    }
    const parsed = JSON.parse(raw) as MoodWallStorageData;
    if (!Array.isArray(parsed.posts)) {
      return { ...EMPTY_DATA };
    }
    const posts = parsed.posts.map(migratePost).sort((a, b) => b.createdAt - a.createdAt);
    const likes = migrateLikes(parsed.likes ?? {}, posts);
    return { posts, likes };
  } catch {
    return { ...EMPTY_DATA };
  }
}

/** 写入心情墙数据到 localStorage */
export function writeMoodWallData(data: MoodWallStorageData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
