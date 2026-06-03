'use client';

import React from 'react';
import AdminSidebar, { type SectionKey } from '@/components/AdminSidebar';

type AdminPageShellProps = {
  active: SectionKey;
  title: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export default function AdminPageShell({ active, title, eyebrow, actions, children }: AdminPageShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-app">
      <AdminSidebar active={active} />
      <div className="flex-1 overflow-auto px-6 py-6 md:px-8">
        <div className="mb-5 flex items-center gap-4">
          <div>
            {eyebrow && <div className="font-mono text-xs uppercase tracking-wider text-subtle">{eyebrow}</div>}
            <h1 className="mt-1 text-[26px] font-bold leading-tight tracking-normal text-text">{title}</h1>
          </div>
          <div className="flex-1" />
          {actions}
        </div>
        {children}
      </div>
    </div>
  );
}
