'use client';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import dayjs from '@/lib/dayjs';
import { postService } from '@/lib/services';
import { useAuthStore } from '@/store/auth-store';
import { Avatar } from '@/components/avatar';
import { PostActions } from '@/features/posts/post-actions';
import {
  useComments,
  useDeleteComment,
} from '@/features/comments/use-comments';
import { CommentForm } from '@/features/comments/comment-form';

export default function PostDetailPage() {
  const id = Number(useParams<{ id: string }>().id);
  const router = useRouter();
  const queryClient = useQueryClient();
  const me = useAuthStore((s) => s.user);

  const post = useQuery({
    queryKey: ['post', id],
    queryFn: () => postService.detail(id),
  });
  const comments = useComments(id);
  const deleteComment = useDeleteComment(id);

  const deletePost = useMutation({
    mutationFn: () => postService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      router.replace('/me');
    },
  });

  function handleDeletePost() {
    if (confirm('Hapus post ini?')) deletePost.mutate();
  }

  if (post.isPending)
    return <p className='text-center text-neutral-400'>Loading...</p>;
  if (post.isError) return <p className='text-center'>Post tidak ditemukan.</p>;

  const p = post.data;
  const isMyPost = me?.id === p.author.id;
  const list = comments.data?.pages.flatMap((page) => page.comments) ?? [];

  return (
    <div className='mx-auto grid max-w-[1200px] gap-6 md:grid-cols-2'>
      <div className='relative aspect-square overflow-hidden rounded-md'>
        <Image
          src={p.imageUrl}
          alt={p.caption ?? 'post'}
          fill
          sizes='(min-width: 768px) 600px, 100vw'
          className='object-cover'
        />
      </div>

      <section className='flex flex-col gap-4'>
        <header className='flex items-center gap-3'>
          <Avatar src={p.author.avatarUrl} alt={p.author.name} />
          <div className='flex-1'>
            <p className='font-bold'>{p.author.name}</p>
            <p className='text-sm text-neutral-400'>
              {dayjs(p.createdAt).fromNow()}
            </p>
          </div>
          {isMyPost && (
            <button
              aria-label='Hapus post'
              disabled={deletePost.isPending}
              onClick={handleDeletePost}
            >
              <Trash2 />
            </button>
          )}
        </header>

        {p.caption && <p>{p.caption}</p>}

        <h2 className='border-t border-neutral-900 pt-4 font-bold'>Comments</h2>
        <ul className='flex max-h-[400px] flex-col gap-4 overflow-y-auto'>
          {list.length === 0 && (
            <li className='py-10 text-center text-neutral-400'>
              <span className='block font-bold text-neutral-25'>
                No Comments yet
              </span>
              Start the conversation
            </li>
          )}

          {list.map((c) => (
            <li
              key={c.id}
              className='flex gap-3 border-b border-neutral-900 pb-4'
            >
              <Avatar src={c.author.avatarUrl} alt={c.author.name} />
              <div className='flex-1'>
                <p className='text-sm font-bold'>
                  {c.author.name}
                  <span className='ml-2 font-normal text-neutral-400'>
                    {dayjs(c.createdAt).fromNow()}
                  </span>
                </p>
                <p className='text-sm'>{c.text}</p>
              </div>
              {(me?.id === c.author.id || isMyPost) && (
                <button
                  aria-label='Hapus komentar'
                  onClick={() => deleteComment.mutate(c.id)}
                >
                  <Trash2 size={16} className='text-neutral-500' />
                </button>
              )}
            </li>
          ))}

          {comments.hasNextPage && (
            <li className='text-center'>
              <button
                onClick={() => comments.fetchNextPage()}
                className='text-sm text-primary-200'
              >
                Load more comments
              </button>
            </li>
          )}
        </ul>

        <PostActions post={p} />

        {me ? (
          <CommentForm postId={id} />
        ) : (
          <p className='text-sm text-neutral-400'>Login untuk berkomentar.</p>
        )}
      </section>
    </div>
  );
}
