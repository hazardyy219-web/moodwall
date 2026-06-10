import type { UserAvatar as UserAvatarType } from '../../types/auth';
import styles from './UserAvatar.module.css';

export type AvatarSize = 'sm' | 'md' | 'lg';

interface UserAvatarProps {
  avatar: UserAvatarType;
  displayName: string;
  size?: AvatarSize;
  onClick?: () => void;
  className?: string;
}

const SIZE_CLASS: Record<AvatarSize, string | undefined> = {
  sm: styles.avatarSm,
  md: undefined,
  lg: styles.avatarLg,
};

export function UserAvatar({
  avatar,
  displayName,
  size = 'md',
  onClick,
  className,
}: UserAvatarProps) {
  const fallbackLetter = displayName.charAt(0).toUpperCase() || 'U';
  const sizeClass = SIZE_CLASS[size];

  const content =
    avatar.type === 'image' && avatar.value ? (
      <img src={avatar.value} alt="" className={styles.image} />
    ) : (
      (avatar.value || fallbackLetter).slice(0, 2)
    );

  if (onClick) {
    return (
      <button
        type="button"
        className={`${styles.avatar} ${sizeClass ?? ''} ${styles.clickable} ${className ?? ''}`}
        onClick={onClick}
        aria-label={`查看 ${displayName} 的资料`}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={`${styles.avatar} ${sizeClass ?? ''} ${className ?? ''}`}
      aria-hidden={avatar.type === 'text'}
    >
      {content}
    </div>
  );
}
