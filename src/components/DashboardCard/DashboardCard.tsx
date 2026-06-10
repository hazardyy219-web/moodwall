import type { ReactNode } from 'react';
import styles from './DashboardCard.module.css';

interface DashboardCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function DashboardCard({ title, icon, children }: DashboardCardProps) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        {icon && <span className={styles.iconWrap} aria-hidden="true">{icon}</span>}
        <h2 className={styles.title}>{title}</h2>
      </header>
      <div className={styles.body}>{children}</div>
    </article>
  );
}
