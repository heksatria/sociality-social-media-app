'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { meService } from '@/lib/services';
import { getErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { Avatar } from '@/components/avatar';
import type { MyProfile } from '@/types/api';

// Halaman: ambil data dulu, baru tampilkan form
export default function EditProfilePage() {
  const me = useQuery({ queryKey: ['me'], queryFn: meService.get });

  if (me.isPending)
    return <p className='text-center text-neutral-400'>Loading...</p>;
  if (me.isError) return <p className='text-center'>Gagal memuat profil.</p>;

  return <EditProfileForm me={me.data} />;
}

// Form: nilai awal diambil dari props, jadi tidak perlu useEffect
function EditProfileForm({ me }: { me: MyProfile }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  const [form, setForm] = useState({
    name: me.name,
    username: me.username,
    phone: me.phone ?? '',
    bio: me.bio ?? '',
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function pickAvatar(f: File | undefined) {
    if (!f) return;
    if (preview) URL.revokeObjectURL(preview);
    setAvatar(f);
    setPreview(URL.createObjectURL(f));
  }

  const save = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('username', form.username);
      fd.append('phone', form.phone);
      fd.append('bio', form.bio);
      if (avatar) fd.append('avatar', avatar);
      return meService.update(fd);
    },
    onSuccess: (updated) => {
      setUser({
        id: updated.id,
        name: updated.name,
        username: updated.username,
        email: updated.email,
        avatarUrl: updated.avatarUrl,
      });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Profile Success Update');
      router.push('/me');
    },
  });

  function field(key: keyof typeof form) {
    return {
      value: form[key],
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => setForm({ ...form, [key]: e.target.value }),
    };
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate();
      }}
      className='mx-auto flex max-w-[800px] flex-col gap-6 md:flex-row'
    >
      <div className='flex flex-col items-center gap-4'>
        <Avatar src={preview ?? me.avatarUrl} alt='avatar' size={130} />
        <label className='cursor-pointer rounded-full border border-neutral-900 px-6 py-2 font-bold'>
          Change Photo
          <input
            type='file'
            accept='image/png,image/jpeg,image/webp'
            hidden
            onChange={(e) => pickAvatar(e.target.files?.[0])}
          />
        </label>
      </div>

      <div className='flex flex-1 flex-col gap-4'>
        <label className='flex flex-col gap-1 text-sm font-bold'>
          Name
          <input className='input font-normal' {...field('name')} />
        </label>
        <label className='flex flex-col gap-1 text-sm font-bold'>
          Username
          <input className='input font-normal' {...field('username')} />
        </label>
        <label className='flex flex-col gap-1 text-sm font-bold'>
          Email
          <input
            className='input font-normal opacity-60'
            value={me.email}
            disabled
          />
        </label>
        <label className='flex flex-col gap-1 text-sm font-bold'>
          Number Phone
          <input className='input font-normal' {...field('phone')} />
        </label>
        <label className='flex flex-col gap-1 text-sm font-bold'>
          Bio
          <textarea
            rows={4}
            placeholder='Create your bio'
            className='input h-auto py-3 font-normal'
            {...field('bio')}
          />
        </label>

        {save.isError && (
          <p className='text-sm text-accent-red'>
            {getErrorMessage(save.error)}
          </p>
        )}

        <button
          disabled={save.isPending}
          className='h-12 rounded-full bg-primary-300 font-bold disabled:opacity-60'
        >
          {save.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
