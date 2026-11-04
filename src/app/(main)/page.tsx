'use client';
import Link from 'next/link';
import { PostList } from '@/features/posts/post-list';
import { postService } from '@/lib/services';

export default function HomePage() {
  return (
    <PostList
      queryKey={['posts', 'feed']}
      fetchPage={postService.feed}
      empty={
        <div className='py-20 text-center'>
          <p className='font-bold'>Timeline kamu masih kosong</p>
          <p className='text-neutral-400'>
            Follow orang lain atau lihat post terbaru.
          </p>
          <Link
            href='/explore'
            className='mt-4 inline-block rounded-full bg-primary-300 px-6 py-2 font-bold'
          >
            Explore
          </Link>
        </div>
      }
    />
  );
}
