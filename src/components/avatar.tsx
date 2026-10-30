import Image from 'next/image';
import { cn } from '@/lib/utils';

type Props = {
  src: string | null;
  alt: string;
  size?: number;
  className?: string;
};

export function Avatar({ src, alt, size = 40, className }: Props) {
  return (
    <Image
      src={src || '/avatar-placeholder.svg'}
      alt={alt}
      width={size}
      height={size}
      className={cn('shrink-0 rounded-full object-cover', className)}
      style={{ width: size, height: size }}
    />
  );
}
