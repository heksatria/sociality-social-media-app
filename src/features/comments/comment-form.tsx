'use client';
import { useState } from 'react';
import { Smile } from 'lucide-react';
import { useAddComment } from './use-comments';

const EMOJIS = [
  '😀',
  '😅',
  '🥰',
  '😇',
  '🙂',
  '😋',
  '🤪',
  '🤐',
  '😏',
  '🤗',
  '😪',
  '🙄',
  '🤫',
  '😴',
  '🥵',
  '😫',
  '😭',
  '😱',
];

export function CommentForm({ postId }: { postId: number }) {
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const add = useAddComment(postId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    add.mutate(text.trim(), { onSuccess: () => setText('') });
  }

  return (
    <form onSubmit={handleSubmit} className='relative flex items-center gap-2'>
      <button
        type='button'
        onClick={() => setShowEmoji(!showEmoji)}
        aria-label='Pilih emoji'
        className='flex size-12 shrink-0 items-center justify-center rounded-xl border border-neutral-900'
      >
        <Smile />
      </button>

      {showEmoji && (
        <div className='absolute bottom-14 left-0 z-10 grid grid-cols-6 gap-2 rounded-xl border border-neutral-900 bg-neutral-950 p-3'>
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type='button'
              className='text-xl'
              onClick={() => {
                setText(text + emoji);
                setShowEmoji(false);
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Add Comment'
        className='input'
      />
      <button
        disabled={!text.trim() || add.isPending}
        className='font-bold text-primary-200 disabled:text-neutral-600'
      >
        Post
      </button>
    </form>
  );
}
