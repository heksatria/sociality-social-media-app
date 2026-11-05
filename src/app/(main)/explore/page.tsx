'use client';
import { PostList } from '@/features/posts/post-list';
import { postService } from '@/lib/services';

export default function ExplorePage() {
  return (
    <PostList
      queryKey={['posts', 'explore']}
      fetchPage={postService.explore}
      empty={
        <p className='py-20 text-center text-neutral-400'>Belum ada post</p>
      }
    />
  );
}
