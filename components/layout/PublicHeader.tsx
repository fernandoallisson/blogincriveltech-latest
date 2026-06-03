'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import Button from '@/components/ui/Button';

export default function PublicHeader({ backHref }: { backHref?: string }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/88 backdrop-blur-xl">
      <div className="mx-auto grid max-w-[1180px] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:px-6 md:py-4">
        <Link href="/" aria-label="Início" className="min-w-0 justify-self-start"><Logo size={34} /></Link>
        <nav className="order-3 col-span-2 flex items-center justify-center gap-5 text-[13px] font-semibold text-muted sm:order-none sm:col-span-1 sm:gap-7">
          <HeaderLink href="/">Início</HeaderLink>
          <HeaderLink href="/#posts">Posts</HeaderLink>
          <HeaderLink href="/#categorias">Categorias</HeaderLink>
        </nav>
        <div className="justify-self-end">
          {backHref ? (
            <Link href={backHref}><Button variant="secondary" size="sm" icon="chevleft">Voltar</Button></Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function HeaderLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="group relative py-1.5 transition hover:text-text" href={href}>
      {children}
      <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-brand transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </Link>
  );
}
