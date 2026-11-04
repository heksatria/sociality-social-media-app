'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { PostCard } from './post-card';
import type { PostPage } from '@/types/api';

type Props = {
  queryKey: unknown[];
  fetchPage: (page: number) => Promise<PostPage>;
  empty: React.ReactNode;
};

export function PostList({ queryKey, fetchPage, empty }: Props) {
  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchPage(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
  });

  if (query.isPending)
    return <p className='text-center text-neutral-400'>Loading...</p>;
  if (query.isError)
    return <p className='text-center text-accent-red'>Gagal memuat post.</p>;

  const posts = query.data.pages.flatMap((page) => page.posts);
  if (posts.length === 0) return <>{empty}</>;

  return (
    <div className='flex flex-col gap-6'>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {query.hasNextPage && (
        <button
          onClick={() => query.fetchNextPage()}
          disabled={query.isFetchingNextPage}
          className='mx-auto rounded-full border border-neutral-900 px-6 py-2 font-bold'
        >
          {query.isFetchingNextPage ? 'Loading...' : 'Load more'}
        </button>
      )}
    </div>
  );
}
