'use client';

import React from 'react';
import Icon from '../Icon';
import { cn } from '@/lib/cn';

export default function IconButton({ name, size = 'md', variant = 'ghost', onClick }: { name: string; size?: 'sm' | 'md' | 'lg'; variant?: 'ghost' | 'secondary'; onClick?: () => void }) {
  const px = size === 'sm' ? 'h-[30px] w-[30px]' : size === 'lg' ? 'h-[42px] w-[42px]' : 'h-9 w-9';
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('grid place-items-center rounded-md text-muted transition hover:text-text', px, variant === 'secondary' ? 'border border-border-strong bg-glass' : 'border border-transparent bg-transparent')}
    >
      <Icon name={name} size={size === 'sm' ? 14 : 16} />
    </button>
  );
}
