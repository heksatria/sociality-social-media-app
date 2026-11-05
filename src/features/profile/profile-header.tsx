import Link from 'next/link';
import { Avatar } from '@/components/avatar';
import type { Counts } from '@/types/api';

type Props = {
  name: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  counts: Counts;
  actions: React.ReactNode;
};

export function ProfileHeader({
  name,
  username,
  avatarUrl,
  bio,
  counts,
  actions,
}: Props) {
  const stats = [
    { label: 'Post', value: counts.post },
    {
      label: 'Followers',
      value: counts.followers,
      href: `/users/${username}/followers`,
    },
    {
      label: 'Following',
      value: counts.following,
      href: `/users/${username}/following`,
    },
    { label: 'Likes', value: counts.likes },
  ];

  return (
    <section className='flex flex-col gap-4'>
      <div className='flex flex-wrap items-center gap-4'>
        <Avatar src={avatarUrl} alt={name} size={64} />
        <div className='flex-1'>
          <p className='font-bold'>{name}</p>
          <p className='text-neutral-25'>{username}</p>
        </div>
        <div className='flex w-full gap-3 md:w-auto'>{actions}</div>
      </div>
      {bio && <p>{bio}</p>}
      <div className='grid grid-cols-4 divide-x divide-neutral-900'>
        {stats.map((s) => {
          const body = (
            <div className='flex flex-col items-center'>
              <span className='text-xl font-bold'>{s.value}</span>
              <span className='text-neutral-400'>{s.label}</span>
            </div>
          );
          return s.href ? (
            <Link key={s.label} href={s.href}>
              {body}
            </Link>
          ) : (
            <div key={s.label}>{body}</div>
          );
        })}
      </div>
    </section>
  );
}
