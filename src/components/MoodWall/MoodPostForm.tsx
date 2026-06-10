import { useState, type FormEvent } from 'react';
import type { MoodTag } from '../../types/moodWall';
import { MOOD_TAG_CONFIG, MOOD_TAGS, MAX_POST_LENGTH } from '../../constants/moodWall';
import styles from './MoodPostForm.module.css';

interface MoodPostFormProps {
  onSubmit: (content: string, mood: MoodTag) => Promise<void>;
}

export function MoodPostForm({ onSubmit }: MoodPostFormProps) {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodTag>('calm');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmed = content.trim();
  const canSubmit = trimmed.length > 0 && !isSubmitting;
  const isNearLimit = content.length >= MAX_POST_LENGTH - 20;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(trimmed, mood);
      setContent('');
      setMood('calm');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <label className={styles.label} htmlFor="mood-post-content">
        分享你的心情
      </label>
      <textarea
        id="mood-post-content"
        className={styles.textarea}
        value={content}
        onChange={(e) => {
          if (e.target.value.length <= MAX_POST_LENGTH) {
            setContent(e.target.value);
          }
        }}
        placeholder="写下此刻的想法…"
        rows={3}
        disabled={isSubmitting}
        aria-describedby="mood-post-char-count"
      />
      <div className={styles.meta}>
        <span
          id="mood-post-char-count"
          className={`${styles.charCount} ${isNearLimit ? styles.charCountWarn : ''}`}
        >
          {content.length} / {MAX_POST_LENGTH}
        </span>
      </div>

      <div className={styles.tagSection}>
        <span className={styles.tagLabel}>选择心情标签</span>
        <div className={styles.tagRow} role="group" aria-label="心情标签">
          {MOOD_TAGS.map((tag) => {
            const config = MOOD_TAG_CONFIG[tag];
            const isActive = mood === tag;
            return (
              <button
                key={tag}
                type="button"
                className={`${styles.tagBtn} ${isActive ? styles.tagBtnActive : ''}`}
                onClick={() => setMood(tag)}
                aria-pressed={isActive}
                disabled={isSubmitting}
              >
                <span aria-hidden="true">{config.emoji}</span>
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.footer}>
        <button
          type="submit"
          className={`${styles.submit} ${isSubmitting ? styles.submitLoading : ''}`}
          disabled={!canSubmit}
          aria-busy={isSubmitting}
        >
          {isSubmitting && <span className={styles.spinner} aria-hidden="true" />}
          {isSubmitting ? '发布中…' : '发布留言'}
        </button>
      </div>
    </form>
  );
}
