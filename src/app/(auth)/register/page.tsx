'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/lib/services';
import { getErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { PasswordInput } from '@/components/password-input';
import type { AuthData } from '@/types/api';

const emptyForm = {
  name: '',
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};
type Form = typeof emptyForm;
type Errors = Partial<Record<keyof Form, string>>;

const textFields = [
  { key: 'name', label: 'Name', placeholder: 'Enter your name' },
  { key: 'username', label: 'Username', placeholder: 'Enter your username' },
  { key: 'email', label: 'Email', placeholder: 'Enter your email' },
  {
    key: 'phone',
    label: 'Number Phone',
    placeholder: 'Enter your number phone',
  },
] as const;

function validate(form: Form): Errors {
  const errors: Errors = {};
  if (!form.name) errors.name = 'Nama wajib diisi';
  if (form.username.length < 3) errors.username = 'Minimal 3 karakter';
  if (!form.email.includes('@')) errors.email = 'Email tidak valid';
  if (form.phone.length < 8) errors.phone = 'Nomor tidak valid';
  if (form.password.length < 6) errors.password = 'Minimal 6 karakter';
  if (form.password !== form.confirmPassword)
    errors.confirmPassword = 'Password tidak sama';
  return errors;
}

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState<Form>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});

  function update(key: keyof Form, value: string) {
    setForm({ ...form, [key]: value });
  }

  const register = useMutation({
    mutationFn: async (): Promise<AuthData> => {
      const body = {
        name: form.name,
        username: form.username,
        email: form.email,
        phone: form.phone,
        password: form.password,
      };
      const data = await authService.register(body);
      // kalau register sudah mengembalikan token, langsung pakai
      if (data?.token && data.user)
        return { token: data.token, user: data.user };
      // kalau tidak, login otomatis
      return authService.login({ email: form.email, password: form.password });
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      router.replace('/');
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors = validate(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    register.mutate();
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
      <h1 className='text-center text-display-xs font-bold'>Register</h1>

      {textFields.map((f) => (
        <label key={f.key} className='flex flex-col gap-1 text-sm font-bold'>
          {f.label}
          <input
            value={form[f.key]}
            onChange={(e) => update(f.key, e.target.value)}
            placeholder={f.placeholder}
            className='input font-normal'
          />
          {errors[f.key] && (
            <span className='font-normal text-accent-red'>{errors[f.key]}</span>
          )}
        </label>
      ))}

      <label className='flex flex-col gap-1 text-sm font-bold'>
        Password
        <PasswordInput
          value={form.password}
          onChange={(v) => update('password', v)}
          placeholder='Enter your password'
        />
        {errors.password && (
          <span className='font-normal text-accent-red'>{errors.password}</span>
        )}
      </label>

      <label className='flex flex-col gap-1 text-sm font-bold'>
        Confirm Password
        <PasswordInput
          value={form.confirmPassword}
          onChange={(v) => update('confirmPassword', v)}
          placeholder='Enter your confirm password'
        />
        {errors.confirmPassword && (
          <span className='font-normal text-accent-red'>
            {errors.confirmPassword}
          </span>
        )}
      </label>

      {register.isError && (
        <p className='text-sm text-accent-red'>
          {getErrorMessage(register.error)}
        </p>
      )}

      <button
        disabled={register.isPending}
        className='h-12 rounded-full bg-primary-300 font-bold disabled:opacity-60'
      >
        {register.isPending ? 'Loading...' : 'Submit'}
      </button>

      <p className='text-center font-semibold'>
        Already have an account?{' '}
        <Link href='/login' className='text-primary-200'>
          Log in
        </Link>
      </p>
    </form>
  );
}
