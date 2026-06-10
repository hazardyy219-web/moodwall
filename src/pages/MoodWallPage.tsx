import { useMemo, useState } from 'react';
import { AppLayout, layoutStyles } from '../components/Layout/AppLayout';
import { MoodPostForm } from '../components/MoodWall/MoodPostForm';
import { MoodFilterBar } from '../components/MoodWall/MoodFilterBar';
import { MoodPostCard } from '../components/MoodWall/MoodPostCard';
import { EmptyState } from '../components/EmptyState/EmptyState';
import { useAuth } from '../contexts/AuthContext';
import { useMoodWall } from '../contexts/MoodWallContext';
import { useToast } from '../contexts/ToastContext';
import type { MoodFilter, MoodTag } from '../types/moodWall';
import { POSTS_PAGE_SIZE } from '../constants/moodWall';
import styles from './MoodWallPage.module.css';

export function MoodWallPage() {
  const { user } = useAuth();
  const {
    posts,
    isLoading,
    addPost,
    deletePost,
    toggleLike,
    isPostLikedByUser,
    addComment,
    deleteComment,
  } = useMoodWall();
  const { showToast } = useToast();

  const [filter, setFilter] = useState<MoodFilter>('all');
  const [visibleCount, setVisibleCount] = useState(POSTS_PAGE_SIZE);

  const filteredPosts = useMemo(() => {
    if (filter === 'mine' && user) {
      return posts.filter((p) => p.authorEmail === user.email);
    }
    return posts;
  }, [posts, filter, user]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const handleFilterChange = (next: MoodFilter) => {
    setFilter(next);
    setVisibleCount(POSTS_PAGE_SIZE);
  };

  const handlePublish = async (content: string, mood: MoodTag) => {
    await addPost(content, mood);
    showToast('留言发布成功');
    setVisibleCount(POSTS_PAGE_SIZE);
  };

  const handleDelete = (postId: string) => {
    deletePost(postId);
    showToast('留言已删除');
  };

  const handleToggleLike = (postId: string) => {
    const wasLiked = isPostLikedByUser(postId);
    toggleLike(postId);
    showToast(wasLiked ? '已取消点赞' : '点赞成功', 'info');
  };

  const handleAddComment = (postId: string, content: string) => {
    addComment(postId, content);
    showToast('评论发布成功');
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    deleteComment(postId, commentId);
    showToast('评论已删除');
  };

  if (!user) {
    return null;
  }

  return (
    <AppLayout>
      <header className={layoutStyles.pageHeader}>
        <h1 className={layoutStyles.pageTitle}>心情墙</h1>
        <p className={layoutStyles.pageSubtitle}>
          记录此刻心情，与社区一起分享生活中的点滴。
        </p>
      </header>

      <MoodPostForm onSubmit={handlePublish} />

      <div style={{ marginTop: '1.5rem' }}>
        <MoodFilterBar filter={filter} onChange={handleFilterChange} />

        {isLoading ? null : filteredPosts.length === 0 ? (
          <EmptyState
            title={filter === 'mine' ? '还没有你的留言' : '心情墙还是空的'}
            description={
              filter === 'mine'
                ? '发布第一条留言，记录你的心情吧。'
                : '成为第一个分享心情的人，写下你的想法。'
            }
          />
        ) : (
          <div className={styles.feed}>
            {visiblePosts.map((post, index) => (
              <MoodPostCard
                key={post.id}
                post={post}
                isOwner={post.authorEmail === user.email}
                isLiked={isPostLikedByUser(post.id)}
                currentUserEmail={user.email}
                animationDelay={index * 50}
                onToggleLike={() => handleToggleLike(post.id)}
                onDelete={() => handleDelete(post.id)}
                onAddComment={(content) => handleAddComment(post.id, content)}
                onDeleteComment={(commentId) => handleDeleteComment(post.id, commentId)}
              />
            ))}

            {hasMore && (
              <div className={styles.loadMore}>
                <button
                  type="button"
                  className={styles.loadMoreBtn}
                  onClick={() => setVisibleCount((c) => c + POSTS_PAGE_SIZE)}
                >
                  加载更多
                </button>
              </div>
            )}

            {!hasMore && filteredPosts.length > POSTS_PAGE_SIZE && (
              <p className={styles.endHint}>已显示全部留言</p>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
