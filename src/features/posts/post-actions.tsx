'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark, Heart, MessageSquareMore, Send } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { useToggleLike } from './use-toggle-like';
import { useSavedIds, useToggleSave } from './use-saved';
import { LikesDialog } from './likes-dialog';
import type { Post } from '@/types/api';

export function PostActions({ post }: { post: Post }) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [showLikes, setShowLikes] = useState(false);

  const like = useToggleLike();
  const savedIds = useSavedIds();
  const toggleSave = useToggleSave();
  const saved = savedIds.data?.includes(post.id) ?? false;

  function handleLike() {
    if (!token) return router.push('/login');
    like.mutate(post);
  }

  function handleShowLikes() {
    if (!token) return router.push('/login');
    setShowLikes(true);
  }

  function handleSave() {
    if (!token) return router.push('/login');
    toggleSave.mutate({ id: post.id, saved });
  }

  async function handleShare() {
    await navigator.clipboard.writeText(
      `${window.location.origin}/posts/${post.id}`
    );
    toast.success('Link disalin');
  }

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-1.5'>
            <button
              onClick={handleLike}
              disabled={like.isPending}
              aria-label='Like'
            >
              <Heart
                className={cn(
                  post.likedByMe && 'fill-accent-red text-accent-red'
                )}
              />
            </button>
            <button
              onClick={handleShowLikes}
              className='font-semibold'
              aria-label='Lihat yang menyukai'
            >
              {post.likeCount}
            </button>
          </div>
          <Link
            href={`/posts/${post.id}`}
            className='flex items-center gap-1.5 font-semibold'
          >
            <MessageSquareMore /> {post.commentCount}
          </Link>
          <button onClick={handleShare} aria-label='Share'>
            <Send />
          </button>
        </div>
        <button
          onClick={handleSave}
          disabled={toggleSave.isPending}
          aria-label='Bookmark'
        >
          <Bookmark className={cn(saved && 'fill-neutral-25')} />
        </button>
      </div>

      {showLikes && (
        <LikesDialog postId={post.id} onClose={() => setShowLikes(false)} />
      )}
    </>
  );
}
