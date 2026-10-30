'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { SearchBox } from '@/features/users/search-box';
import { ProfileMenu } from './profile-menu';

export function Navbar() {
  const user = useAuthStore((s) => s.user);
  const [mobileSearch, setMobileSearch] = useState(false);

  return (
    <header className='sticky top-0 z-40 border-b border-neutral-900 bg-black'>
      <div className='mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4'>
        {mobileSearch ? (
          <div className='flex w-full items-center gap-3'>
            <div className='flex-1'>
              <SearchBox />
            </div>
            <button
              onClick={() => setMobileSearch(false)}
              aria-label='Tutup pencarian'
            >
              <X />
            </button>
          </div>
        ) : (
          <>
            <Link
              href='/'
              className='flex items-center gap-2 text-display-xs font-bold'
            >
              <Image src='/logo.svg' alt='' width={28} height={28} />
              Sociality
            </Link>

            <div className='hidden w-full max-w-[490px] md:block'>
              <SearchBox />
            </div>

            <div className='flex items-center gap-4'>
              <button
                onClick={() => setMobileSearch(true)}
                className='md:hidden'
                aria-label='Cari'
              >
                <Search />
              </button>
              {user ? (
                <ProfileMenu />
              ) : (
                <div className='flex gap-3'>
                  <Link
                    href='/login'
                    className='rounded-full border border-neutral-900 px-4 py-2 font-bold md:px-6'
                  >
                    Login
                  </Link>
                  <Link
                    href='/register'
                    className='rounded-full bg-primary-300 px-4 py-2 font-bold md:px-6'
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
