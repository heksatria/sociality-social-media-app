'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CloudUpload } from 'lucide-react';
import { toast } from 'sonner';
import { postService } from '@/lib/services';
import { getErrorMessage } from '@/lib/api';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export default function CreatePostPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');

  function pick(f: File | undefined) {
    if (!f) return;
    if (!TYPES.includes(f.type))
      return setError('Format harus PNG, JPG, atau WEBP');
    if (f.size > MAX_SIZE) return setError('Ukuran maksimal 5MB');
    setError('');
    if (preview) URL.revokeObjectURL(preview); // buang URL pratinjau lama
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function removeImage() {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
  }

  const create = useMutation({
    mutationFn: () => {
      const form = new FormData();
      form.append('image', file!);
      form.append('caption', caption);
      return postService.create(form);
    },
    onSuccess: () => {
      toast.success('Success Post');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      router.push('/');
    },
  });

  return (
    <div className='mx-auto flex max-w-[452px] flex-col gap-6'>
      <button
        onClick={() => router.back()}
        className='flex items-center gap-3 text-display-xs font-bold'
      >
        <ArrowLeft /> Add Post
      </button>

      <div className='flex flex-col gap-1'>
        <p className='text-sm font-bold'>Photo</p>
        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            pick(e.dataTransfer.files[0]);
          }}
          className='flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-900 bg-neutral-950 p-6 text-center'
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt='Pratinjau'
              className='max-h-[400px] rounded-md object-contain'
            />
          ) : (
            <>
              <CloudUpload className='text-neutral-400' />
              <p>
                <span className='font-bold text-primary-200'>
                  Click to upload
                </span>{' '}
                or drag and drop
              </p>
              <p className='text-sm text-neutral-600'>PNG or JPG (max. 5mb)</p>
            </>
          )}
          <input
            type='file'
            accept={TYPES.join(',')}
            hidden
            onChange={(e) => pick(e.target.files?.[0])}
          />
        </label>

        {preview && (
          <div className='mt-2 flex justify-center gap-3'>
            <label className='cursor-pointer rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold'>
              Change Image
              <input
                type='file'
                accept={TYPES.join(',')}
                hidden
                onChange={(e) => pick(e.target.files?.[0])}
              />
            </label>
            <button
              type='button'
              onClick={removeImage}
              className='rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-accent-red'
            >
              Delete Image
            </button>
          </div>
        )}
        {error && <p className='text-sm text-accent-red'>{error}</p>}
      </div>

      <label className='flex flex-col gap-1 text-sm font-bold'>
        Caption
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={4}
          placeholder='Create your caption'
          className='input h-auto py-3 font-normal'
        />
      </label>

      {create.isError && (
        <p className='text-sm text-accent-red'>
          {getErrorMessage(create.error)}
        </p>
      )}

      <button
        disabled={!file || create.isPending}
        onClick={() => create.mutate()}
        className='h-12 rounded-full bg-primary-300 font-bold disabled:opacity-50'
      >
        {create.isPending ? 'Uploading...' : 'Share'}
      </button>
    </div>
  );
}
