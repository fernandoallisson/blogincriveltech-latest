'use client';

import React from 'react';
import Icon from '../Icon';
import { cn } from '@/lib/cn';

type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'error' | 'info';
type Size = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  tone?: Tone;
  soft?: boolean;
  dot?: boolean;
  icon?: string;
  size?: Size;
  className?: string;
}

const tones: Record<Tone, string> = {
  neutral: 'border-border-strong text-muted bg-glass',
  brand: 'border-brand/35 text-brand bg-brand/15',
  success: 'border-success/30 text-success bg-success/10',
  warning: 'border-warning/30 text-warning bg-warning/10',
  error: 'border-error/30 text-error bg-error/10',
  info: 'border-info/30 text-info bg-info/10',
};

const sizes: Record<Size, string> = {
  sm: 'h-5 px-2 text-[11px]',
  md: 'h-6 px-2.5 text-xs',
  lg: 'h-7 px-3 text-[13px]',
};

export default function Badge({ children, tone = 'neutral', dot, icon, size = 'md', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border font-semibold', tones[tone], sizes[size], className)}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {icon && <Icon name={icon} size={size === 'sm' ? 11 : 13} />}
      {children}
    </span>
  );
}
