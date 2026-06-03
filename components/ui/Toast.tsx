'use client';

import React from 'react';

export default function Toast({ children }: { children: React.ReactNode }) {
  return <div className="rounded-md border border-border bg-surface p-3 text-text">{children}</div>;
}
