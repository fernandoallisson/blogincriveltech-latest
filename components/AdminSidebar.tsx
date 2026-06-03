'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clearAuthSession, getStoredUser, type AuthUser } from '@/lib/auth';
import Logo from './Logo';
import Icon from './Icon';
import Avatar from './ui/Avatar';
import { cn } from '@/lib/cn';

export type SectionKey = 'dashboard' | 'posts' | 'cats' | 'tags' | 'promos' | 'comments' | 'media' | 'auth' | 'theme' | 'set';

interface AdminSidebarProps {
  active?: SectionKey;
}

const contentItems = [
  { icon: 'chart', label: 'Dashboard', key: 'dashboard' as SectionKey, href: '/admin/dashboard' },
  { icon: 'file', label: 'Posts', key: 'posts' as SectionKey, href: '/admin/posts' },
  { icon: 'folder', label: 'Categorias', key: 'cats' as SectionKey, href: '/admin/categories' },
  { icon: 'tag', label: 'Tags', key: 'tags' as SectionKey, href: '/admin/tags' },
  { icon: 'megaphone', label: 'Propagandas', key: 'promos' as SectionKey, href: '/admin/promo-cards' },
  { icon: 'inbox', label: 'Comentários', key: 'comments' as SectionKey, href: '/admin/comments' },
  { icon: 'image', label: 'Mídia', key: 'media' as SectionKey, href: '/admin/media' },
  { icon: 'user', label: 'Autores', key: 'auth' as SectionKey, href: '/admin/authors' },
];

const configItems = [
  { icon: 'sparkle', label: 'Aparência', key: 'theme' as SectionKey, href: '/admin/theming' },
  { icon: 'settings', label: 'Geral', key: 'set' as SectionKey, href: '/admin/settings' },
];

function NavItem({ item, active }: { item: (typeof contentItems)[number]; active: SectionKey }) {
  const isActive = item.key === active;
  return (
    <Link className={cn('flex items-center gap-2.5 rounded-sm px-2.5 py-2 text-[13px] font-medium transition', isActive ? 'bg-brand/15 text-brand' : 'text-muted hover:bg-glass hover:text-text')} href={item.href}>
      <Icon name={item.icon} size={15} />
      <span className="flex-1">{item.label}</span>
    </Link>
  );
}

export default function AdminSidebar({ active = 'dashboard' }: AdminSidebarProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  function handleLogout() {
    clearAuthSession();
    router.replace('/admin/login');
  }

  const displayName = user?.name || user?.email || 'Administrador';
  const displayRole = user?.role === 'admin' ? 'Admin' : user?.role || 'Editor';
  const isAdmin = user?.role === 'admin';
  const visibleContentItems = isAdmin ? contentItems : contentItems.filter((item) => item.key !== 'auth');
  const visibleConfigItems = isAdmin ? configItems : [];

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col gap-1 border-r border-border bg-surface px-3 py-5">
      <div className="px-2 pb-4"><Logo /></div>
      <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-subtle">Conteúdo</div>
      {visibleContentItems.map((item) => <NavItem key={item.key} item={item} active={active} />)}
      {visibleConfigItems.length > 0 && <div className="px-2.5 pb-1.5 pt-3.5 text-[10px] font-bold uppercase tracking-widest text-subtle">Configurar</div>}
      {visibleConfigItems.map((item) => <NavItem key={item.key} item={item} active={active} />)}
      <div className="flex-1" />
      <div className="flex items-center gap-2.5 rounded-md border border-border bg-surface-2 p-2.5">
        <Avatar name={displayName} size={28} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-semibold text-text">{displayName}</div>
          <div className="text-[11px] capitalize text-subtle">{displayRole}</div>
        </div>
        <button type="button" onClick={handleLogout} aria-label="Sair" title="Sair" className="grid h-[26px] w-[26px] place-items-center rounded-sm border border-border bg-glass text-subtle hover:text-text">
          <Icon name="x" size={12} />
        </button>
      </div>
    </aside>
  );
}
