'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, X } from 'lucide-react';
import { userService } from '@/lib/services';
import { useDebounce } from '@/lib/use-debounce';
import { Avatar } from '@/components/avatar';

export function SearchBox() {
  const [text, setText] = useState('');
  const q = useDebounce(text.trim());
  const result = useQuery({
    queryKey: ['users', 'search', q],
    queryFn: () => userService.search(q),
    enabled: q.length > 0,
  });

  return (
    <div className='relative w-full'>
      <Search
        size={20}
        className='absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500'
      />
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Search'
        className='input rounded-full pl-11 pr-10'
      />
      {text && (
        <button
          onClick={() => setText('')}
          aria-label='Hapus pencarian'
          className='absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500'
        >
          <X size={18} />
        </button>
      )}

      {q && (
        <div className='absolute top-14 z-50 w-full rounded-2xl border border-neutral-900 bg-neutral-950 p-4'>
          {result.isFetching && (
            <p className='text-sm text-neutral-400'>Searching...</p>
          )}
          {result.data?.users.length === 0 && (
            <div className='py-6 text-center'>
              <p className='font-bold'>No results found</p>
              <p className='text-sm text-neutral-400'>Change your keyword</p>
            </div>
          )}
          {result.data?.users.map((u) => (
            <Link
              key={u.id}
              href={`/users/${u.username}`}
              onClick={() => setText('')}
              className='flex items-center gap-3 rounded-lg p-2 hover:bg-neutral-900'
            >
              <Avatar src={u.avatarUrl} alt={u.name} size={48} />
              <div>
                <p className='font-bold'>{u.name}</p>
                <p className='text-sm text-neutral-400'>{u.username}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
