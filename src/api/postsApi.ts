import type { MoodComment, MoodTag } from '../types/moodWall';
import { api } from './client';
import type { ApiMoodPost, LikeResponse, PostsListResponse } from './types';

export async function fetchPosts(page = 1, limit = 10): Promise<PostsListResponse> {
  return api<PostsListResponse>(`/posts?page=${page}&limit=${limit}`);
}

export async function fetchMyPosts(page = 1, limit = 10): Promise<PostsListResponse> {
  return api<PostsListResponse>(`/posts/mine?page=${page}&limit=${limit}`);
}

export async function createPost(content: string, mood: MoodTag): Promise<{ post: ApiMoodPost }> {
  return api<{ post: ApiMoodPost }>('/posts', {
    method: 'POST',
    body: JSON.stringify({ content, mood }),
  });
}

export async function deletePost(postId: string): Promise<void> {
  await api(`/posts/${postId}`, { method: 'DELETE' });
}

export async function toggleLike(postId: string): Promise<LikeResponse> {
  return api<LikeResponse>(`/posts/${postId}/like`, { method: 'POST' });
}

export async function addComment(postId: string, content: string): Promise<{ comment: MoodComment }> {
  return api<{ comment: MoodComment }>(`/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export async function deleteComment(postId: string, commentId: string): Promise<void> {
  await api(`/posts/${postId}/comments/${commentId}`, { method: 'DELETE' });
}
