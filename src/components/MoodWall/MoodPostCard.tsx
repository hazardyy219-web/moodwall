import { useState, type FormEvent } from 'react';
import type { MoodPost } from '../../types/moodWall';
import { MOOD_TAG_CONFIG, MAX_COMMENT_LENGTH } from '../../constants/moodWall';
import { formatTime } from '../../utils/formatTime';
import styles from './MoodPostCard.module.css';

interface MoodPostCardProps {
  post: MoodPost;
  isOwner: boolean;
  isLiked: boolean;
  currentUserEmail: string;
  animationDelay?: number;
  onToggleLike: () => void;
  onDelete: () => void;
  onAddComment: (content: string) => void;
  onDeleteComment: (commentId: string) => void;
}

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

export function MoodPostCard({
  post,
  isOwner,
  isLiked,
  currentUserEmail,
  animationDelay = 0,
  onToggleLike,
  onDelete,
  onAddComment,
  onDeleteComment,
}: MoodPostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const moodConfig = MOOD_TAG_CONFIG[post.mood];
  const avatarLetter = post.authorName.charAt(0).toUpperCase();

  const handleCommentSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) {
      return;
    }
    onAddComment(trimmed);
    setCommentText('');
  };

  return (
    <article
      className={styles.card}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <header className={styles.header}>
        <div className={styles.authorBlock}>
          <div className={styles.avatar} aria-hidden="true">{avatarLetter}</div>
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{post.authorName}</span>
            <time className={styles.time} dateTime={new Date(post.createdAt).toISOString()}>
              {formatTime(post.createdAt)}
            </time>
          </div>
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
          className={styles.actionBtn}
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

      {showComments && (
        <div className={styles.comments}>
          <form className={styles.commentForm} onSubmit={handleCommentSubmit}>
            <input
              type="text"
              className={styles.commentInput}
              value={commentText}
              onChange={(e) => {
                if (e.target.value.length <= MAX_COMMENT_LENGTH) {
                  setCommentText(e.target.value);
                }
              }}
              placeholder="写下简短评论…"
              aria-label="评论内容"
              maxLength={MAX_COMMENT_LENGTH}
            />
            <button
              type="submit"
              className={styles.commentSubmit}
              disabled={!commentText.trim()}
            >
              发送
            </button>
          </form>

          {post.comments.length === 0 ? (
            <p className={styles.noComments}>暂无评论，来抢沙发吧</p>
          ) : (
            <ul className={styles.commentList}>
              {post.comments.map((comment) => (
                <li key={comment.id} className={styles.commentItem}>
                  <div className={styles.commentBody}>
                    <span className={styles.commentAuthor}>{comment.authorName}</span>
                    <p className={styles.commentText}>{comment.content}</p>
                    <span className={styles.commentMeta}>{formatTime(comment.createdAt)}</span>
                  </div>
                  {comment.authorEmail === currentUserEmail && (
                    <button
                      type="button"
                      className={styles.commentDelete}
                      onClick={() => onDeleteComment(comment.id)}
                      aria-label="删除评论"
                    >
                      删除
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </article>
  );
}
