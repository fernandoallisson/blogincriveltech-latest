'use client';

import React from 'react';
import Image from 'next/image';
import logoImage from '@/images/logo.png';
import { cn } from '@/lib/cn';

interface LogoProps {
  size?: number;
  mark?: boolean;
  className?: string;
}

export default function Logo({ size = 28, mark = false, className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <Image
        src={logoImage}
        alt="Incrível Tech"
        width={size}
        height={size}
        priority
        className="shrink-0 rounded-sm object-cover ring-1 ring-brand/25"
      />
      {!mark && (
        <span className="text-[15px] font-extrabold tracking-normal text-text">
          Incrível<span className="text-brand">.</span>tech
          <span className="ml-1.5 font-semibold text-muted">blog</span>
        </span>
      )}
    </div>
  );
}
