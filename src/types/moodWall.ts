import type { UserAvatar } from './auth';

/** 心情标签类型 */
export type MoodTag = 'happy' | 'calm' | 'sad' | 'motivated';

/** 留言列表筛选 */
export type MoodFilter = 'all' | 'mine';

/** 作者信息快照（留言/评论发布时绑定） */
export interface AuthorSnapshot {
  userId: string;
  authorEmail: string;
  authorName: string;
  authorAvatar: UserAvatar;
}

/** 单条评论 */
export interface MoodComment {
  id: string;
  postId: string;
  authorId: string;
  authorEmail: string;
  authorName: string;
  authorAvatar: UserAvatar;
  content: string;
  createdAt: number;
}

/** 评论区块组件 Props */
export interface CommentSectionProps {
  postId: string;
  comments: MoodComment[];
  currentUserId: string;
  isExpanded: boolean;
  onSubmit: (content: string) => void;
  onDelete: (commentId: string) => void;
}

/** 单条心情留言 */
export interface MoodPost {
  id: string;
  authorId: string;
  authorEmail: string;
  authorName: string;
  authorAvatar: UserAvatar;
  content: string;
  mood: MoodTag;
  createdAt: number;
  likeCount: number;
  comments: MoodComment[];
  /** 当前用户是否已点赞（API 返回） */
  isLiked?: boolean;
}

/** localStorage 持久化结构 */
export interface MoodWallStorageData {
  posts: MoodPost[];
  /** postId → 点赞用户 ID 列表 */
  likes: Record<string, string[]>;
}

/** 留言卡片组件 Props */
export interface WallGridCardProps {
  post: MoodPost;
  isOwner: boolean;
  isLiked: boolean;
  currentUserId: string;
  animationDelay?: number;
  onToggleLike: () => void;
  onDelete: () => void;
  onAddComment: (content: string) => void;
  onDeleteComment: (commentId: string) => void;
  onAuthorClick: (userId: string) => void;
}
