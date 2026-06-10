import { useState } from 'react';
import type { WallGridCardProps } from '../../types/moodWall';
import { MOOD_TAG_CONFIG } from '../../constants/moodWall';
import { formatTime } from '../../utils/formatTime';
import { UserAvatar } from '../UserAvatar/UserAvatar';
import { CommentSection } from '../MessageWall/CommentSection';
import styles from './WallGridCard.module.css';

function LikeIcon({ filled }: { filled: boolean }) {
  return (
    <svg className={styles.actionIcon} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} aria-hidden="true">
      <path
        d="M12 21s-7-4.5-9.5-8.5C.5 8.5 2.5 5 6 5c2 0 3.5 1.5 4 2.5C10.5 6.5 12 5 14 5c3.5 0 5.5 3.5 3.5 7.5C19 16.5 12 21 12 21z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg className={styles.actionIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 11.5a8.4 8.4 0 01-1.9 5.4 8.5 8.5 0 01-6.6 3.1 8.4 8.4 0 01-4.2-1.1L3 19l1.9-5.5a8.4 8.4 0 01-1.1-4.2 8.5 8.5 0 013.1-6.6A8.4 8.4 0 0111.5 3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WallGridCard({
  post,
  isOwner,
  isLiked,
  currentUserId,
  animationDelay = 0,
  onToggleLike,
  onDelete,
  onAddComment,
  onDeleteComment,
  onAuthorClick,
}: WallGridCardProps) {
  const [showComments, setShowComments] = useState(false);
  const moodConfig = MOOD_TAG_CONFIG[post.mood];

  return (
    <article className={styles.card} style={{ animationDelay: `${animationDelay}ms` }}>
      <header className={styles.header}>
        <UserAvatar
          avatar={post.authorAvatar}
          displayName={post.authorName}
          size="sm"
          onClick={() => onAuthorClick(post.authorId)}
        />
        <div className={styles.authorInfo}>
          <button
            type="button"
            className={styles.authorName}
            onClick={() => onAuthorClick(post.authorId)}
          >
            {post.authorName}
          </button>
          <time className={styles.time} dateTime={new Date(post.createdAt).toISOString()}>
            {formatTime(post.createdAt)}
          </time>
        </div>
        <span className={styles.moodTag}>
          <span aria-hidden="true">{moodConfig.emoji}</span>
          {moodConfig.label}
        </span>
      </header>

      <p className={styles.content}>{post.content}</p>

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.actionBtn} ${isLiked ? styles.actionBtnActive : ''}`}
          onClick={onToggleLike}
          aria-pressed={isLiked}
          aria-label={isLiked ? '取消点赞' : '点赞'}
        >
          <LikeIcon filled={isLiked} />
          <span>{post.likeCount}</span>
        </button>

        <button
          type="button"
          className={`${styles.actionBtn} ${showComments ? styles.actionBtnActive : ''}`}
          onClick={() => setShowComments((prev) => !prev)}
          aria-expanded={showComments}
          aria-label={showComments ? '收起评论' : '展开评论'}
        >
          <CommentIcon />
          <span>{post.comments.length}</span>
        </button>

        {isOwner && (
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
            onClick={onDelete}
            aria-label="删除留言"
          >
            删除
          </button>
        )}
      </div>

      <CommentSection
        postId={post.id}
        comments={post.comments}
        currentUserId={currentUserId}
        isExpanded={showComments}
        onSubmit={onAddComment}
        onDelete={onDeleteComment}
      />
    </article>
  );
}
