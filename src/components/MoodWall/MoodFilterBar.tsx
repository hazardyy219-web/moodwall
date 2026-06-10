import type { MoodFilter } from '../../types/moodWall';
import styles from './MoodFilterBar.module.css';

interface MoodFilterBarProps {
  filter: MoodFilter;
  onChange: (filter: MoodFilter) => void;
}

const FILTERS: { value: MoodFilter; label: string }[] = [
  { value: 'all', label: '全部留言' },
  { value: 'mine', label: '我的留言' },
];

export function MoodFilterBar({ filter, onChange }: MoodFilterBarProps) {
  return (
    <div className={styles.bar} role="tablist" aria-label="留言筛选">
      {FILTERS.map((item) => (
        <button
          key={item.value}
          type="button"
          role="tab"
          aria-selected={filter === item.value}
          className={`${styles.tab} ${filter === item.value ? styles.tabActive : ''}`}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
