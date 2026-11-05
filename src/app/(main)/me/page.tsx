'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { meService, postService } from '@/lib/services';
import { ProfileHeader } from '@/features/profile/profile-header';
import { PostGrid } from '@/features/posts/post-grid';
import { cn } from '@/lib/utils';

function GalleryEmpty() {
  return (
    <div className='flex flex-col items-center gap-2 py-16 text-center'>
      <p className='text-md font-bold'>Your story starts here</p>
      <p className='max-w-100 text-neutral-400'>
        Share your first post and let the world see your moments, passions, and
        memories. Make this space truly yours.
      </p>
      <Link
        href='/posts/new'
        className='mt-4 rounded-full bg-primary-300 px-6 py-2 font-bold'
      >
        Upload My First Post
      </Link>
    </div>
  );
}

const TABS = [
  {
    key: 'gallery',
    label: 'Gallery',
    fetch: postService.myPosts,
    empty: <GalleryEmpty />,
  },
  {
    key: 'saved',
    label: 'Saved',
    fetch: (page: number) => postService.saved(page),
    empty: 'Belum ada post yang disimpan',
  },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function MyProfilePage() {
  const [tab, setTab] = useState<TabKey>('gallery');
  const me = useQuery({ queryKey: ['me'], queryFn: meService.get });

  if (me.isPending)
    return <p className='text-center text-neutral-400'>Loading...</p>;
  if (me.isError) return <p className='text-center'>Gagal memuat profil.</p>;

  const active = TABS.find((t) => t.key === tab)!;

  return (
    <div className='mx-auto flex max-w-[812px] flex-col gap-6'>
      <ProfileHeader
        {...me.data}
        actions={
          <Link
            href='/me/edit'
            className='flex-1 rounded-full border border-neutral-900 px-6 py-2 text-center font-bold'
          >
            Edit Profile
          </Link>
        }
      />

      <div className='grid grid-cols-2 border-b border-neutral-900'>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'py-3 font-bold',
              tab === t.key
                ? 'border-b-2 border-neutral-25'
                : 'text-neutral-400'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <PostGrid
        key={active.key}
        queryKey={['posts', 'me', active.key]}
        fetchPage={active.fetch}
        empty={
          typeof active.empty === 'string' ? (
            <p className='py-20 text-center text-neutral-400'>{active.empty}</p>
          ) : (
            active.empty
          )
        }
      />
    </div>
  );
}
