import type { UserAvatar } from '../types.js';
import { parseAvatar } from '../utils/avatar.js';

export interface CommentRow {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: Date;
  email: string;
  username: string;
  avatar: string;
}

export interface PostRow {
  id: string;
  content: string;
  tag: string;
  created_at: Date;
  author_id: string;
  email: string;
  username: string;
  avatar: string;
  like_count: string | number;
  is_liked: boolean;
}

export function mapComment(row: CommentRow) {
  return {
    id: row.id,
    postId: row.post_id,
    authorId: row.user_id,
    authorEmail: row.email,
    authorName: row.username,
    authorAvatar: parseAvatar(row.avatar),
    content: row.content,
    createdAt: new Date(row.created_at).getTime(),
  };
}

export function mapPost(row: PostRow, comments: CommentRow[] = []) {
  const postComments = comments
    .filter((c) => c.post_id === row.id)
    .map(mapComment)
    .sort((a, b) => b.createdAt - a.createdAt);

  return {
    id: row.id,
    authorId: row.author_id,
    authorEmail: row.email,
    authorName: row.username,
    authorAvatar: parseAvatar(row.avatar),
    content: row.content,
    mood: row.tag,
    createdAt: new Date(row.created_at).getTime(),
    likeCount: Number(row.like_count) || 0,
    isLiked: Boolean(row.is_liked),
    comments: postComments,
  };
}

export function mapUser(row: {
  id: string;
  email: string;
  username: string;
  avatar: string;
}) {
  return {
    id: row.id,
    email: row.email,
    displayName: row.username,
    avatar: parseAvatar(row.avatar),
  };
}

export function mapProfilePayload(username: string, avatar: UserAvatar) {
  return {
    displayName: username,
    avatar,
  };
}
