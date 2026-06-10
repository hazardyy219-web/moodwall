import type { MoodTag } from '../types/moodWall';

export const MAX_POST_LENGTH = 280;
export const MAX_COMMENT_LENGTH = 120;
export const POSTS_PAGE_SIZE = 8;
/** 无限滚动每页加载条数 */
export const INFINITE_SCROLL_PAGE_SIZE = 10;
/** 无限滚动模拟网络延迟（ms） */
export const INFINITE_SCROLL_LOAD_DELAY_MS = 450;

export interface MoodTagConfig {
  label: string;
  emoji: string;
}

export const MOOD_TAG_CONFIG: Record<MoodTag, MoodTagConfig> = {
  happy: { label: '开心', emoji: '😊' },
  calm: { label: '平淡', emoji: '😌' },
  sad: { label: '难过', emoji: '😢' },
  motivated: { label: '励志', emoji: '💪' },
};

export const MOOD_TAGS: MoodTag[] = ['happy', 'calm', 'sad', 'motivated'];
