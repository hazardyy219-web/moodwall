import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as postsApi from '../api/postsApi';
import type { MoodPost, MoodTag } from '../types/moodWall';
import { INFINITE_SCROLL_PAGE_SIZE } from '../constants/moodWall';
import { useAuth } from './AuthContext';

interface MoodWallContextValue {
  posts: MoodPost[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  addPost: (content: string, mood: MoodTag) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  isPostLikedByUser: (postId: string) => boolean;
  addComment: (postId: string, content: string) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
  loadMorePosts: () => Promise<void>;
  refreshPosts: () => Promise<void>;
}

const MoodWallContext = createContext<MoodWallContextValue | null>(null);

export function MoodWallProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<MoodPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);

  const fetchPage = useCallback(async (pageNum: number, append: boolean) => {
    const data = await postsApi.fetchPosts(pageNum, INFINITE_SCROLL_PAGE_SIZE);
    setPosts((prev) => (append ? [...prev, ...data.posts] : data.posts));
    setHasMore(data.hasMore);
    setPage(pageNum);
  }, []);

  const refreshPosts = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }
    setIsLoading(true);
    try {
      await fetchPage(1, false);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchPage]);

  useEffect(() => {
    if (!isAuthenticated) {
      setPosts([]);
      setHasMore(false);
      setPage(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetchPage(1, false).finally(() => setIsLoading(false));
  }, [isAuthenticated, fetchPage]);

  const loadMorePosts = useCallback(async () => {
    if (!hasMore || isLoadingMore) {
      return;
    }
    setIsLoadingMore(true);
    try {
      await fetchPage(page + 1, true);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, page, fetchPage]);

  const addPost = useCallback(async (content: string, mood: MoodTag) => {
    const { post } = await postsApi.createPost(content, mood);
    setPosts((prev) => [post, ...prev]);
  }, []);

  const deletePost = useCallback(async (postId: string) => {
    await postsApi.deletePost(postId);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }, []);

  const toggleLike = useCallback(async (postId: string) => {
    const result = await postsApi.toggleLike(postId);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, isLiked: result.isLiked, likeCount: result.likeCount }
          : p,
      ),
    );
  }, []);

  const isPostLikedByUser = useCallback(
    (postId: string) => {
      const post = posts.find((p) => p.id === postId);
      return post?.isLiked ?? false;
    },
    [posts],
  );

  const addComment = useCallback(async (postId: string, content: string) => {
    const { comment } = await postsApi.addComment(postId, content);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, comment] } : p,
      ),
    );
  }, []);

  const deleteComment = useCallback(async (postId: string, commentId: string) => {
    await postsApi.deleteComment(postId, commentId);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) }
          : p,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({
      posts,
      isLoading,
      isLoadingMore,
      hasMore,
      addPost,
      deletePost,
      toggleLike,
      isPostLikedByUser,
      addComment,
      deleteComment,
      loadMorePosts,
      refreshPosts,
    }),
    [
      posts,
      isLoading,
      isLoadingMore,
      hasMore,
      addPost,
      deletePost,
      toggleLike,
      isPostLikedByUser,
      addComment,
      deleteComment,
      loadMorePosts,
      refreshPosts,
    ],
  );

  return <MoodWallContext.Provider value={value}>{children}</MoodWallContext.Provider>;
}

export function useMoodWall(): MoodWallContextValue {
  const context = useContext(MoodWallContext);
  if (!context) {
    throw new Error('useMoodWall must be used within MoodWallProvider');
  }
  return context;
}
