'use client';
import Link from 'next/link';
import { useInfiniteQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { postService } from '@/lib/services';
import { Avatar } from '@/components/avatar';
import { FollowButton } from '@/features/users/follow-button';

type Props = { postId: number; onClose: () => void };

export function LikesDialog({ postId, onClose }: Props) {
  const q = useInfiniteQuery({
    queryKey: ['users', 'likers', postId],
    queryFn: ({ pageParam }) => postService.likers(postId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.pagination.page < last.pagination.totalPages
        ? last.pagination.page + 1
        : undefined,
  });
  const users = q.data?.pages.flatMap((p) => p.users) ?? [];

  return (
    <div
      onClick={onClose}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4'
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className='flex max-h-[80vh] w-full max-w-[548px] flex-col gap-5 overflow-y-auto rounded-2xl bg-neutral-950 p-5'
      >
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-bold'>Likes</h2>
          <button onClick={onClose} aria-label='Tutup'>
            <X />
          </button>
        </div>
        {q.isPending && <p className='text-neutral-400'>Loading...</p>}
        {!q.isPending && users.length === 0 && (
          <p className='text-neutral-400'>Belum ada yang menyukai post ini</p>
        )}
        {users.map((u) => (
          <div key={u.id} className='flex items-center gap-3'>
            <Link
              href={`/users/${u.username}`}
              onClick={onClose}
              className='flex flex-1 items-center gap-3'
            >
              <Avatar src={u.avatarUrl} alt={u.name} size={48} />
              <div>
                <p className='font-bold'>{u.name}</p>
                <p className='text-sm text-neutral-400'>{u.username}</p>
              </div>
            </Link>
            {!u.isMe && (
              <FollowButton
                username={u.username}
                following={u.isFollowedByMe}
              />
            )}
          </div>
        ))}
        {q.hasNextPage && (
          <button
            onClick={() => q.fetchNextPage()}
            className='text-primary-200'
          >
            Load more
          </button>
        )}
      </div>
    </div>
  );
}
