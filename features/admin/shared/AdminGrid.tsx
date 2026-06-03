'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export function AdminGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]', className)}>{children}</div>;
}

export function AdminRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('grid gap-3 border-b border-border p-3.5 last:border-b-0 md:items-center', className)}>{children}</div>;
}
