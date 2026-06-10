import styles from './ScrollLoader.module.css';

interface ScrollLoaderProps {
  text?: string;
}

export function ScrollLoader({ text = '加载中…' }: ScrollLoaderProps) {
  return (
    <div className={styles.loader} role="status" aria-live="polite" aria-busy="true">
      <div className={styles.dots} aria-hidden="true">
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
      <span className={styles.text}>{text}</span>
    </div>
  );
}
