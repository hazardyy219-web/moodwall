import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../Navbar/Navbar';
import { PageTransition } from '../PageTransition/PageTransition';
import { useAuth } from '../../contexts/AuthContext';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  children: ReactNode;
  wide?: boolean;
}

export function AppLayout({ children, wide = false }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <PageTransition>
      <div className={styles.page}>
        <Navbar siteName="Apex" user={user} onLogout={handleLogout} />
        <main className={styles.main} id="main-content">
          <div className={wide ? styles.containerWide : styles.container}>
            {children}
          </div>
        </main>
      </div>
    </PageTransition>
  );
}

export const layoutStyles = styles;
