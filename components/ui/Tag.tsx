'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export default function Tag({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('h-[30px] rounded-full border px-3 text-xs font-semibold transition', active ? 'border-brand bg-brand/15 text-brand' : 'border-border bg-glass text-muted hover:text-text')}
    >
      {children}
    </button>
  );
}
