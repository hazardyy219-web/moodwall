import { Link, NavLink } from 'react-router-dom';
import { BrandLogo } from '../LoginPage/Icons';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { UserAvatar } from '../UserAvatar/UserAvatar';
import type { User } from '../../types/auth';
import styles from './Navbar.module.css';

interface NavbarProps {
  siteName: string;
  user: User;
  onLogout: () => void;
}

export function Navbar({ siteName, user, onLogout }: NavbarProps) {
  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <div className={styles.brand}>
            <div className={styles.logoWrap}>
              <BrandLogo className={styles.logoIcon} />
            </div>
            <span className={styles.siteName}>{siteName}</span>
          </div>

          <nav className={styles.nav} aria-label="主导航">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
              end
            >
              首页
            </NavLink>
            <NavLink
              to="/post"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              发布心情
            </NavLink>
            <NavLink
              to="/wall"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              心情墙
            </NavLink>
          </nav>
        </div>

        <div className={styles.actions}>
          <ThemeToggle />

          <Link to="/profile" className={styles.user} aria-label="个人资料设置">
            <UserAvatar avatar={user.avatar} displayName={user.displayName} size="sm" />
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.displayName}</span>
              <span className={styles.userEmail}>{user.email}</span>
            </div>
          </Link>

          <button type="button" className={styles.logoutBtn} onClick={onLogout}>
            退出登录
          </button>
        </div>
      </div>
    </header>
  );
}
