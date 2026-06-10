import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout, layoutStyles } from '../components/Layout/AppLayout';
import { UserAvatar } from '../components/UserAvatar/UserAvatar';
import { getUserById } from '../api/authApi';
import { useAuth } from '../contexts/AuthContext';
import { useMoodWall } from '../contexts/MoodWallContext';
import { useToast } from '../contexts/ToastContext';
import type { ApiUser } from '../api/types';
import type { AvatarType, UserAvatar as UserAvatarType } from '../types/auth';
import styles from './ProfilePage.module.css';

const MAX_IMAGE_SIZE = 512 * 1024;

export function ProfilePage() {
  const { userId } = useParams<{ userId?: string }>();
  const { user, updateProfile } = useAuth();
  const { refreshPosts } = useMoodWall();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const isOwnProfile = !userId || userId === user?.id;

  const [otherUser, setOtherUser] = useState<ApiUser | null>(null);
  const [loadingOther, setLoadingOther] = useState(!isOwnProfile);

  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [avatarType, setAvatarType] = useState<AvatarType>(user?.avatar.type ?? 'text');
  const [avatarValue, setAvatarValue] = useState(user?.avatar.value ?? '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user && isOwnProfile) {
      setDisplayName(user.displayName);
      setAvatarType(user.avatar.type);
      setAvatarValue(user.avatar.value);
    }
  }, [user, isOwnProfile]);

  useEffect(() => {
    if (!isOwnProfile && userId) {
      setLoadingOther(true);
      getUserById(userId)
        .then(({ user: apiUser }) => setOtherUser(apiUser))
        .catch(() => showToast('用户不存在', 'error'))
        .finally(() => setLoadingOther(false));
    }
  }, [isOwnProfile, userId, showToast]);

  if (!user) {
    return null;
  }

  if (!isOwnProfile) {
    if (loadingOther) {
      return (
        <AppLayout>
          <p className={styles.loadingText}>加载中…</p>
        </AppLayout>
      );
    }

    const profileUser = otherUser;
    const name = profileUser?.displayName ?? '用户';
    const avatar = profileUser?.avatar ?? { type: 'text' as const, value: 'U' };

    return (
      <AppLayout>
        <header className={layoutStyles.pageHeader}>
          <h1 className={layoutStyles.pageTitle}>用户资料</h1>
        </header>
        <div className={styles.placeholderCard}>
          <UserAvatar avatar={avatar} displayName={name} size="lg" />
          <h2 className={styles.placeholderTitle}>{name}</h2>
          <p className={styles.placeholderText}>
            他人公开资料页（占位），可查看昵称与头像。
          </p>
        </div>
      </AppLayout>
    );
  }

  const previewAvatar: UserAvatarType = {
    type: avatarType,
    value: avatarType === 'text' ? avatarValue.trim() || displayName.charAt(0) : avatarValue,
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      showToast('请上传图片文件', 'error');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      showToast('图片大小不能超过 512KB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarType('image');
        setAvatarValue(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = displayName.trim();
    if (!trimmedName) {
      showToast('昵称不能为空', 'error');
      return;
    }

    const nextAvatar: UserAvatarType =
      avatarType === 'image'
        ? { type: 'image', value: avatarValue }
        : { type: 'text', value: (avatarValue.trim() || trimmedName.charAt(0)).slice(0, 2) };

    setIsSaving(true);
    try {
      await updateProfile({ displayName: trimmedName, avatar: nextAvatar });
      await refreshPosts();
      showToast('资料已保存');
      navigate('/wall');
    } catch {
      showToast('保存失败，请重试', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppLayout>
      <header className={layoutStyles.pageHeader}>
        <h1 className={layoutStyles.pageTitle}>个人资料</h1>
        <p className={layoutStyles.pageSubtitle}>
          修改昵称与头像，刷新后从服务器同步展示。
        </p>
      </header>

      <form className={styles.card} onSubmit={handleSubmit} noValidate>
        <div className={styles.preview}>
          <UserAvatar avatar={previewAvatar} displayName={displayName} size="lg" />
          <div className={styles.previewInfo}>
            <div className={styles.previewName}>{displayName || user.displayName}</div>
            <div className={styles.previewEmail}>{user.email}</div>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="profile-name">昵称</label>
          <input
            id="profile-name"
            className={styles.input}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="输入你的昵称"
            maxLength={32}
            required
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>头像设置</span>
          <div className={styles.avatarOptions}>
            <button
              type="button"
              className={`${styles.optionBtn} ${avatarType === 'text' ? styles.optionBtnActive : ''}`}
              onClick={() => setAvatarType('text')}
            >
              文字头像
            </button>
            <button
              type="button"
              className={`${styles.optionBtn} ${avatarType === 'image' ? styles.optionBtnActive : ''}`}
              onClick={() => setAvatarType('image')}
            >
              图片头像
            </button>
          </div>

          {avatarType === 'text' ? (
            <input
              className={styles.input}
              value={avatarValue}
              onChange={(e) => setAvatarValue(e.target.value.slice(0, 2))}
              placeholder="输入 1-2 个字符"
              maxLength={2}
              aria-label="文字头像字符"
            />
          ) : (
            <>
              <input
                type="file"
                accept="image/*"
                className={styles.fileInput}
                onChange={handleImageUpload}
                aria-label="上传头像图片"
              />
              <p className={styles.hint}>支持 JPG、PNG 等格式，最大 512KB</p>
            </>
          )}
        </div>

        <button type="submit" className={styles.submit} disabled={isSaving}>
          {isSaving ? '保存中…' : '保存资料'}
        </button>
      </form>
    </AppLayout>
  );
}
