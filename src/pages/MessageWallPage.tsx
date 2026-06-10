import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppLayout, layoutStyles } from '../components/Layout/AppLayout';
import { MessageCard } from '../components/MessageWall/MessageCard';
import { ScrollLoader } from '../components/MessageWall/ScrollLoader';
import { MoodPostForm } from '../components/MoodWall/MoodPostForm';
import { EmptyState } from '../components/EmptyState/EmptyState';
import type { MoodTag } from '../types/moodWall';
import { useAuth } from '../contexts/AuthContext';
import { useMoodWall } from '../contexts/MoodWallContext';
import { useToast } from '../contexts/ToastContext';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import {
  INFINITE_SCROLL_LOAD_DELAY_MS,
  INFINITE_SCROLL_PAGE_SIZE,
} from '../constants/moodWall';
import styles from './MessageWallPage.module.css';

export function MessageWallPage() {
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

  const [visibleCount, setVisibleCount] = useState(INFINITE_SCROLL_PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 留言总数变化时（如删除），确保可见数量不超出范围
  useEffect(() => {
    setVisibleCount((prev) => Math.min(prev, posts.length) || INFINITE_SCROLL_PAGE_SIZE);
  }, [posts.length]);

  const visiblePosts = useMemo(
    () => posts.slice(0, visibleCount),
    [posts, visibleCount],
  );

  const hasMore = visibleCount < posts.length;

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) {
      return;
    }

    setIsLoadingMore(true);
    await new Promise((resolve) => setTimeout(resolve, INFINITE_SCROLL_LOAD_DELAY_MS));
    setVisibleCount((prev) => Math.min(prev + INFINITE_SCROLL_PAGE_SIZE, posts.length));
    setIsLoadingMore(false);
  }, [isLoadingMore, hasMore, posts.length]);

  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingMore,
    onLoadMore: loadMore,
  });

  const handleToggleLike = (postId: string) => {
    const wasLiked = isPostLikedByUser(postId);
    toggleLike(postId);
    showToast(wasLiked ? '已取消点赞' : '点赞成功', 'info');
  };

  const handleDelete = (postId: string) => {
    deletePost(postId);
    showToast('留言已删除');
  };

  const handlePublish = async (content: string, mood: MoodTag) => {
    await addPost(content, mood);
    showToast('留言发布成功');
    setVisibleCount(INFINITE_SCROLL_PAGE_SIZE);
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
          浏览所有人的心情留言，向下滚动自动加载更多。
        </p>
      </header>

      <MoodPostForm onSubmit={handlePublish} />

      {isLoading ? (
        <div className={styles.initialLoader}>
          <ScrollLoader text="正在加载留言…" />
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          title="还没有留言"
          description="在上方写下第一条心情留言，与大家分享此刻的感受。"
        />
      ) : (
        <div className={styles.feed}>
          {visiblePosts.map((post, index) => (
            <MessageCard
              key={post.id}
              post={post}
              isOwner={post.authorEmail === user.email}
              isLiked={isPostLikedByUser(post.id)}
              currentUserEmail={user.email}
              animationDelay={Math.min(index * 40, 200)}
              onToggleLike={() => handleToggleLike(post.id)}
              onDelete={() => handleDelete(post.id)}
              onAddComment={(content) => handleAddComment(post.id, content)}
              onDeleteComment={(commentId) => handleDeleteComment(post.id, commentId)}
            />
          ))}

          {isLoadingMore && <ScrollLoader />}

          {hasMore && !isLoadingMore && (
            <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
          )}

          {!hasMore && posts.length > 0 && (
            <p className={styles.endHint} role="status">已加载全部</p>
          )}
        </div>
      )}
    </AppLayout>
  );
}
