'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, Plus, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();
  const item = (active: boolean) =>
    cn(
      'flex flex-col items-center gap-1 text-sm font-bold',
      active ? 'text-primary-200' : 'text-neutral-25'
    );

  return (
    <nav className='fixed bottom-6 left-1/2 z-40 flex h-16 w-[300px] -translate-x-1/2 items-center justify-around rounded-full border border-neutral-900 bg-neutral-950/80 backdrop-blur-md'>
      <Link href='/' className={item(pathname === '/')}>
        <House size={22} /> Home
      </Link>
      <Link
        href='/posts/new'
        aria-label='Buat post'
        className='flex size-12 items-center justify-center rounded-full bg-primary-300'
      >
        <Plus size={24} />
      </Link>
      <Link href='/me' className={item(pathname.startsWith('/me'))}>
        <User size={22} /> Profile
      </Link>
    </nav>
  );
}
