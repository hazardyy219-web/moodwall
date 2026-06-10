import { useToast } from '../../contexts/ToastContext';
import styles from './ToastContainer.module.css';

function SuccessIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M8 1a7 7 0 100 14A7 7 0 008 1zm3.7 4.3a1 1 0 00-1.4-1.4L7 9.59 5.7 8.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M8 1a7 7 0 100 14A7 7 0 008 1zM7 4a1 1 0 112 0v4a1 1 0 11-2 0V4zm1 8a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function ToastContainer() {
  const { toasts } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className={styles.container} aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type]}`}
          role="status"
        >
          {toast.type === 'error' ? <ErrorIcon /> : <SuccessIcon />}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
