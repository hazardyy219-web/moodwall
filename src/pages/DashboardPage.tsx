import { AppLayout, layoutStyles } from '../components/Layout/AppLayout';
import { DashboardCard } from '../components/DashboardCard/DashboardCard';
import { useAuth } from '../contexts/AuthContext';
import styles from './DashboardPage.module.css';

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2l1.5 5.5L17 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 19h16M6 16l3-4 3 2 4-6 3 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MoodIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s-7-4.5-9.5-8.5C.5 8.5 2.5 5 6 5c2 0 3.5 1.5 4 2.5C10.5 6.5 12 5 14 5c3.5 0 5.5 3.5 3.5 7.5C19 16.5 12 21 12 21z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <AppLayout wide>
      <header className={layoutStyles.pageHeader}>
        <h1 className={layoutStyles.pageTitle}>首页</h1>
        <p className={layoutStyles.pageSubtitle}>
          欢迎回来，{user.displayName}。这是你的个人工作台。
        </p>
      </header>

      <div className={styles.grid}>
        <DashboardCard title="欢迎面板" icon={<SparkIcon />}>
          <p>
            你已成功登录 Apex。这里是你的个人中心，可以查看概览、管理项目并与社区互动。
          </p>
          <p>
            当前会话{user.rememberMe ? '已记住本设备' : '为临时会话'}。
          </p>
        </DashboardCard>

        <DashboardCard title="心情墙" icon={<MoodIcon />}>
          <p>记录与浏览社区心情：</p>
          <ul className={styles.list}>
            <li>在「发布心情」写下带标签的留言</li>
            <li>在「心情墙」浏览瀑布流卡片</li>
            <li>点赞、评论，编辑个人资料</li>
          </ul>
        </DashboardCard>

        <DashboardCard title="功能介绍" icon={<GridIcon />}>
          <p>探索为现代团队设计的强大工具：</p>
          <ul className={styles.list}>
            <li>实时协作工作区</li>
            <li>智能任务自动化</li>
            <li>集成分析与报表</li>
            <li>安全云文档存储</li>
          </ul>
        </DashboardCard>

        <DashboardCard title="最近活动" icon={<ActivityIcon />}>
          <ul className={styles.activityList}>
            <li className={styles.activityItem}>
              <span className={styles.activityDot} aria-hidden="true" />
              <div>
                <span className={styles.activityText}>登录成功</span>
                <span className={styles.activityTime}>刚刚</span>
              </div>
            </li>
            <li className={styles.activityItem}>
              <span className={styles.activityDot} aria-hidden="true" />
              <div>
                <span className={styles.activityText}>账户已同步 {user.email}</span>
                <span className={styles.activityTime}>今天</span>
              </div>
            </li>
            <li className={styles.activityItem}>
              <span className={styles.activityDot} aria-hidden="true" />
              <div>
                <span className={styles.activityText}>心情墙已开放，快去分享心情吧</span>
                <span className={styles.activityTime}>本周</span>
              </div>
            </li>
          </ul>
        </DashboardCard>
      </div>
    </AppLayout>
  );
}
