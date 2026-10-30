'use client';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function PasswordInput({ value, onChange, placeholder }: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className='relative'>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className='input pr-12'
      />
      <button
        type='button'
        onClick={() => setShow(!show)}
        aria-label='Tampilkan atau sembunyikan password'
        className='absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400'
      >
        {show ? <Eye size={20} /> : <EyeOff size={20} />}
      </button>
    </div>
  );
}
