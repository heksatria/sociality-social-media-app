'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/lib/services';
import { getErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { PasswordInput } from '@/components/password-input';

type Errors = { email?: string; password?: string };

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const login = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      router.replace('/');
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Errors = {};
    if (!email.includes('@')) newErrors.email = 'Email tidak valid';
    if (password.length < 6) newErrors.password = 'Minimal 6 karakter';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    login.mutate({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
      <h1 className='text-center text-display-xs font-bold'>Welcome Back!</h1>

      <label className='flex flex-col gap-1 text-sm font-bold'>
        Email
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter your email'
          className='input font-normal'
        />
        {errors.email && (
          <span className='font-normal text-accent-red'>{errors.email}</span>
        )}
      </label>

      <label className='flex flex-col gap-1 text-sm font-bold'>
        Password
        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder='Enter your password'
        />
        {errors.password && (
          <span className='font-normal text-accent-red'>{errors.password}</span>
        )}
      </label>

      {login.isError && (
        <p className='text-sm text-accent-red'>
          {getErrorMessage(login.error)}
        </p>
      )}

      <button
        disabled={login.isPending}
        className='h-12 rounded-full bg-primary-300 font-bold disabled:opacity-60'
      >
        {login.isPending ? 'Loading...' : 'Login'}
      </button>

      <p className='text-center font-semibold'>
        Don&apos;t have an account?{' '}
        <Link href='/register' className='text-primary-200'>
          Register
        </Link>
      </p>
    </form>
  );
}
