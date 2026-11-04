'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import dayjs from '@/lib/dayjs';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/avatar';
import { PostActions } from './post-actions';
import type { Post } from '@/types/api';

export function PostCard({ post }: { post: Post }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className='mx-auto flex w-full max-w-[600px] flex-col gap-3 border-b border-neutral-900 pb-6'>
      <Link
        href={`/users/${post.author.username}`}
        className='flex items-center gap-3'
      >
        <Avatar src={post.author.avatarUrl} alt={post.author.name} size={64} />
        <div>
          <p className='text-md font-bold'>{post.author.name}</p>
          <p className='text-sm text-neutral-400'>
            {dayjs(post.createdAt).fromNow()}
          </p>
        </div>
      </Link>

      <Link
        href={`/posts/${post.id}`}
        className='relative aspect-square overflow-hidden rounded-md'
      >
        <Image
          src={post.imageUrl}
          alt={post.caption ?? 'post'}
          fill
          sizes='600px'
          className='object-cover'
        />
      </Link>

      <PostActions post={post} />

      <div>
        <p className='font-bold'>{post.author.name}</p>
        {post.caption && (
          <>
            <p className={cn(!expanded && 'line-clamp-2')}>{post.caption}</p>
            {post.caption.length > 100 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className='font-semibold text-primary-200'
              >
                {expanded ? 'Show Less' : 'Show More'}
              </button>
            )}
          </>
        )}
      </div>
    </article>
  );
}
