'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut, User } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { Avatar } from './avatar';

export function ProfileMenu() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);

  if (!user) return null;

  function handleLogout() {
    setOpen(false);
    logout();
    queryClient.clear();
    router.replace('/login');
  }

  return (
    <div className='relative'>
      <button
        onClick={() => setOpen(!open)}
        className='flex items-center gap-3 font-bold'
      >
        <Avatar src={user.avatarUrl} alt={user.name} />
        <span className='hidden md:inline'>{user.name}</span>
      </button>

      {open && (
        <>
          <div className='fixed inset-0 z-40' onClick={() => setOpen(false)} />
          <div className='absolute right-0 top-14 z-50 flex w-48 flex-col rounded-xl border border-neutral-900 bg-neutral-950 p-2'>
            <Link
              href='/me'
              onClick={() => setOpen(false)}
              className='flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-neutral-900'
            >
              <User size={18} /> Profile
            </Link>
            <button
              onClick={handleLogout}
              className='flex items-center gap-2 rounded-lg px-3 py-2 text-accent-red hover:bg-neutral-900'
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
