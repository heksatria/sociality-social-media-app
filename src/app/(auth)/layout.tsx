'use client';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token, hasHydrated } = useAuthStore();

  // Sudah login? Jangan biarkan buka halaman login/register lagi
  useEffect(() => {
    if (hasHydrated && token) router.replace('/');
  }, [hasHydrated, token, router]);

  return (
    <main className='flex min-h-dvh items-center justify-center bg-[radial-gradient(ellipse_at_bottom,#6936f2_0%,#000_60%)] px-4 py-10'>
      <div className='w-full max-w-[446px] rounded-2xl border border-neutral-900 bg-black/20 p-6 backdrop-blur-xl md:p-8'>
        <div className='mb-6 flex items-center justify-center gap-2 text-display-xs font-bold'>
          <Image src='/logo.svg' alt='' width={30} height={30} />
          Sociality
        </div>
        {children}
      </div>
    </main>
  );
}
