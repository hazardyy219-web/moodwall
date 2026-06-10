import { Link, useNavigate } from 'react-router-dom';
import { AppLayout, layoutStyles } from '../components/Layout/AppLayout';
import { WallGridCard } from '../components/Wall/WallGridCard';
import { ScrollLoader } from '../components/MessageWall/ScrollLoader';
import { EmptyState } from '../components/EmptyState/EmptyState';
import { useAuth } from '../contexts/AuthContext';
import { useMoodWall } from '../contexts/MoodWallContext';
import { useToast } from '../contexts/ToastContext';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import styles from './WallPage.module.css';

export function WallPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    posts,
    isLoading,
    isLoadingMore,
    hasMore,
    deletePost,
    toggleLike,
    isPostLikedByUser,
    addComment,
    deleteComment,
    loadMorePosts,
  } = useMoodWall();
  const { showToast } = useToast();

  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingMore,
    onLoadMore: loadMorePosts,
  });

  const handleAuthorClick = (authorId: string) => {
    if (!user) {
      return;
    }
    if (authorId === user.id) {
      navigate('/profile');
    } else {
      navigate(`/profile/${authorId}`);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <AppLayout wide>
      <header className={layoutStyles.pageHeader}>
        <h1 className={layoutStyles.pageTitle}>心情墙</h1>
        <p className={layoutStyles.pageSubtitle}>
          浏览所有人的心情留言，向下滚动自动加载更多。
        </p>
      </header>

      {isLoading ? (
        <div className={styles.initialLoader}>
          <ScrollLoader text="正在加载留言…" />
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          title="心情墙还是空的"
          description="还没有人发布心情，快来写下第一条吧。"
          action={<Link to="/post">去发布心情</Link>}
        />
      ) : (
        <div className={styles.grid}>
          {posts.map((post, index) => (
            <WallGridCard
              key={post.id}
              post={post}
              isOwner={post.authorId === user.id}
              isLiked={isPostLikedByUser(post.id)}
              currentUserId={user.id}
              animationDelay={Math.min(index * 35, 200)}
              onToggleLike={async () => {
                const wasLiked = isPostLikedByUser(post.id);
                await toggleLike(post.id);
                showToast(wasLiked ? '已取消点赞' : '点赞成功', 'info');
              }}
              onDelete={async () => {
                await deletePost(post.id);
                showToast('留言已删除');
              }}
              onAddComment={async (content) => {
                await addComment(post.id, content);
                showToast('评论发布成功');
              }}
              onDeleteComment={async (commentId) => {
                await deleteComment(post.id, commentId);
                showToast('评论已删除');
              }}
              onAuthorClick={handleAuthorClick}
            />
          ))}

          {isLoadingMore && (
            <div className={styles.loaderWrap}>
              <ScrollLoader />
            </div>
          )}

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
