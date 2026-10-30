'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Navbar } from '@/components/navbar';
import { BottomNav } from '@/components/bottom-nav';

// Halaman yang boleh dibuka tanpa login
function isPublic(path: string) {
  if (path === '/posts/new') return false;
  return path.startsWith('/posts/') || path.startsWith('/users/');
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, hasHydrated } = useAuthStore();
  const blocked = hasHydrated && !token && !isPublic(pathname);

  useEffect(() => {
    if (blocked) router.replace('/login');
  }, [blocked, router]);

  if (!hasHydrated || blocked) return null;

  return (
    <>
      <Navbar />
      <main className='mx-auto w-full max-w-[1200px] px-4 pb-32 pt-6'>
        {children}
      </main>
      {token && <BottomNav />}
    </>
  );
}
