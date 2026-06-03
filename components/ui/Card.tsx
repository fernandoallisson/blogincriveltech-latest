'use client';

import React from 'react';
import { cn } from '@/lib/cn';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  padding?: number;
  glow?: boolean;
  hover?: boolean;
};

export default function Card({ children, padding, className, glow, hover, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        'rounded-md border border-border bg-glass shadow-sm',
        glow && 'shadow-glow',
        hover && 'transition hover:-translate-y-0.5 hover:border-border-strong',
        className,
      )}
      style={padding !== undefined ? { padding } : undefined}
    >
      {children}
    </div>
  );
}
