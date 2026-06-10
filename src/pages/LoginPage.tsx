import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LoginPage as LoginForm } from '../components/LoginPage';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { PageTransition } from '../components/PageTransition/PageTransition';
import { ApiError } from '../api/client';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const { isAuthenticated, isLoading, login, register } = useAuth();
  const { showToast } = useToast();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (values: Parameters<typeof login>[0]) => {
    try {
      if (mode === 'login') {
        await login(values);
        showToast('登录成功');
      } else {
        await register(values);
        showToast('注册成功');
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : '操作失败，请重试';
      showToast(message, 'error');
      throw err;
    }
  };

  return (
    <PageTransition>
      <div className={styles.wrap}>
        <LoginForm
          brandName="Apex"
          title={mode === 'login' ? 'Welcome back' : 'Create account'}
          subtitle={
            mode === 'login'
              ? 'Sign in to continue to your workspace'
              : 'Register to join the mood wall community'
          }
          onSubmit={handleSubmit}
        />
        <p className={styles.switch}>
          {mode === 'login' ? '还没有账号？' : '已有账号？'}
          <button
            type="button"
            className={styles.switchBtn}
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? '立即注册' : '去登录'}
          </button>
        </p>
      </div>
    </PageTransition>
  );
}
