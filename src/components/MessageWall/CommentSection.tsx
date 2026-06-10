import { useMemo, useState, type FormEvent } from 'react';
import type { CommentSectionProps } from '../../types/moodWall';
import { MAX_COMMENT_LENGTH } from '../../constants/moodWall';
import { formatTime } from '../../utils/formatTime';
import { UserAvatar } from '../UserAvatar/UserAvatar';
import styles from './CommentSection.module.css';

export function CommentSection({
  postId,
  comments,
  currentUserId,
  isExpanded,
  onSubmit,
  onDelete,
}: CommentSectionProps) {
  const [text, setText] = useState('');

  const sortedComments = useMemo(
    () => [...comments].sort((a, b) => b.createdAt - a.createdAt),
    [comments],
  );

  const trimmed = text.trim();
  const canSubmit = trimmed.length > 0;
  const isNearLimit = text.length >= MAX_COMMENT_LENGTH - 15;
  const charCountId = `comment-char-count-${postId}`;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      return;
    }
    onSubmit(trimmed);
    setText('');
  };

  return (
    <div
      className={`${styles.wrapper} ${isExpanded ? styles.wrapperOpen : ''}`}
      aria-hidden={!isExpanded}
    >
      <div className={styles.inner}>
        <section className={styles.section} aria-label="评论区">
          {sortedComments.length === 0 ? (
            <p className={styles.noComments}>暂无评论，快来抢沙发吧！</p>
          ) : (
            <ul className={styles.commentList}>
              {sortedComments.map((comment) => (
                <li key={comment.id} className={styles.commentItem}>
                  <UserAvatar
                    avatar={comment.authorAvatar}
                    displayName={comment.authorName}
                    size="sm"
                  />
                  <div className={styles.commentBody}>
                    <span className={styles.commentAuthor}>{comment.authorName}</span>
                    <p className={styles.commentText}>{comment.content}</p>
                    <time
                      className={styles.commentTime}
                      dateTime={new Date(comment.createdAt).toISOString()}
                    >
                      {formatTime(comment.createdAt)}
                    </time>
                  </div>
                  {comment.authorId === currentUserId && (
                    <button
                      type="button"
                      className={styles.commentDelete}
                      onClick={() => onDelete(comment.id)}
                      aria-label="删除评论"
                    >
                      删除
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          <form className={styles.commentForm} onSubmit={handleSubmit} noValidate>
            <textarea
              className={styles.textarea}
              value={text}
              onChange={(e) => {
                if (e.target.value.length <= MAX_COMMENT_LENGTH) {
                  setText(e.target.value);
                }
              }}
              placeholder="写下你的评论…"
              rows={2}
              aria-label="评论内容"
              aria-describedby={charCountId}
            />
            <div className={styles.formFooter}>
              <span
                id={charCountId}
                className={`${styles.charCount} ${isNearLimit ? styles.charCountWarn : ''}`}
              >
                {text.length} / {MAX_COMMENT_LENGTH}
              </span>
              <button type="submit" className={styles.submitBtn} disabled={!canSubmit}>
                发布评论
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
