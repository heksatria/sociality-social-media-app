'use client';
import { useRouter } from 'next/navigation';
import { CircleCheck } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useToggleFollow } from './use-follow';
import { cn } from '@/lib/utils';

type Props = { username: string; following: boolean; className?: string };

export function FollowButton({ username, following, className }: Props) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const toggle = useToggleFollow();

  function handleClick() {
    if (!token) return router.push('/login');
    toggle.mutate({ username, following });
  }

  return (
    <button
      disabled={toggle.isPending}
      onClick={handleClick}
      className={cn(
        'flex items-center justify-center gap-2 rounded-full px-6 py-2 font-bold disabled:opacity-60',
        following ? 'border border-neutral-900' : 'bg-primary-300',
        className
      )}
    >
      {following && <CircleCheck size={18} />}
      {following ? 'Following' : 'Follow'}
    </button>
  );
}
