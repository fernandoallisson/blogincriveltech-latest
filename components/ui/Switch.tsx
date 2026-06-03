'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export default function Switch({ checked, label, onChange }: { checked?: boolean; label?: string; onChange?: (checked: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-muted">
      <button
        type="button"
        onClick={() => onChange?.(!checked)}
        className={cn('h-5 w-9 rounded-full border border-border p-0.5 transition', checked ? 'bg-brand' : 'bg-surface-2')}
      >
        <span className={cn('block h-3.5 w-3.5 rounded-full transition', checked ? 'translate-x-3.5 bg-inverse' : 'translate-x-0 bg-subtle')} />
      </button>
      {label}
    </label>
  );
}
