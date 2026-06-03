'use client';

import React from 'react';

export default function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || '?';
  return (
    <div
      className="grid shrink-0 place-items-center rounded-full border border-border bg-brand/15 font-bold text-brand"
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.36) }}
    >
      {initials}
    </div>
  );
}
