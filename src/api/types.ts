import type { UserAvatar } from '../types/auth';
import type { MoodComment, MoodPost, MoodTag } from '../types/moodWall';

export interface ApiUser {
  id: string;
  email: string;
  displayName: string;
  avatar: UserAvatar;
}

export interface AuthResponse {
  token: string;
  user: ApiUser;
}

export interface PostsListResponse {
  posts: ApiMoodPost[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface ApiMoodPost extends Omit<MoodPost, 'mood'> {
  mood: MoodTag;
  isLiked: boolean;
}

export interface LikeResponse {
  isLiked: boolean;
  likeCount: number;
}
