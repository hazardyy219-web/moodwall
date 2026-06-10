import { useEffect, useRef, type RefObject } from 'react';

export interface UseInfiniteScrollOptions {
  /** 是否还有更多数据可加载 */
  hasMore: boolean;
  /** 当前是否正在加载 */
  isLoading: boolean;
  /** 触发加载下一页 */
  onLoadMore: () => void;
  /** 提前触发加载的距离（px） */
  rootMargin?: string;
}

/**
 * 使用 Intersection Observer 实现无限滚动
 * 当哨兵元素进入视口时自动触发 onLoadMore
 */
export function useInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  rootMargin = '120px',
}: UseInfiniteScrollOptions): RefObject<HTMLDivElement> {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !isLoading) {
          onLoadMore();
        }
      },
      { root: null, rootMargin, threshold: 0 },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, onLoadMore, rootMargin]);

  return sentinelRef;
}
