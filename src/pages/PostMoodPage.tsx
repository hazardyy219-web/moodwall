import { useNavigate } from 'react-router-dom';
import { AppLayout, layoutStyles } from '../components/Layout/AppLayout';
import { MoodPostForm } from '../components/MoodWall/MoodPostForm';
import { useMoodWall } from '../contexts/MoodWallContext';
import { useToast } from '../contexts/ToastContext';
import { ApiError } from '../api/client';
import type { MoodTag } from '../types/moodWall';

export function PostMoodPage() {
  const navigate = useNavigate();
  const { addPost } = useMoodWall();
  const { showToast } = useToast();

  const handleSubmit = async (content: string, mood: MoodTag) => {
    try {
      await addPost(content, mood);
      showToast('心情发布成功');
      navigate('/wall');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : '发布失败，请重试';
      showToast(message, 'error');
      throw err;
    }
  };

  return (
    <AppLayout>
      <header className={layoutStyles.pageHeader}>
        <h1 className={layoutStyles.pageTitle}>发布心情</h1>
        <p className={layoutStyles.pageSubtitle}>
          记录此刻的感受，选择心情标签，与社区一起分享。
        </p>
      </header>

      <MoodPostForm onSubmit={handleSubmit} />
    </AppLayout>
  );
}
