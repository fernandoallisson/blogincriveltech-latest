'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { Camera, ExternalLink, Mail, MapPin, MessageCircle } from 'lucide-react';
import Logo from '@/components/Logo';

const whatsappHref = 'https://wa.me/5581991818090?text=Ol%C3%A1%2C+gostaria+de+falar+com+um+especialista+da+Incr%C3%ADvel+Tech!';

const footerGroups = [
  {
    title: 'Blog',
    links: [
      { label: 'Início', href: '/' },
      { label: 'Posts', href: '/#posts' },
      { label: 'Categorias', href: '/#categorias' },
    ],
  },
  {
    title: 'Soluções',
    links: [
      { label: 'Estrutura de campanhas', href: whatsappHref, external: true },
      { label: 'Organização operacional', href: whatsappHref, external: true },
      { label: 'Conversão comercial', href: whatsappHref, external: true },
    ],
  },
  {
    title: 'Institucional',
    links: [
      { label: 'Sobre a Incrível Tech', href: 'https://incrivel.tech/#/sobre', external: true },
      { label: 'Termos de Uso', href: 'https://incrivel.tech/#/termos', external: true },
      { label: 'Política de Privacidade', href: 'https://incrivel.tech/#/privacidade', external: true },
      { label: 'Trabalhe conosco', href: 'https://vagas.alidigitalapp.com', external: true },
    ],
  },
];

export default function PublicFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-bg-soft/88">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent" />
      <div className="mx-auto max-w-[1180px] px-4 py-12 md:px-6 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.65fr)]">
          <div>
            <Link href="/" aria-label="Início" className="inline-flex">
              <Logo size={36} />
            </Link>
            <p className="mt-4 max-w-[440px] text-sm leading-7 text-muted">
              A Incrível Tech ajuda influenciadores, artistas e empreendedores a lançarem campanhas com mais estrutura, profissionalismo e potencial de conversão.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[38px] items-center gap-2 rounded-md border border-brand bg-brand px-4 text-sm font-bold text-inverse shadow-glow transition hover:brightness-110"
              >
                <MessageCircle size={16} strokeWidth={1.9} aria-hidden="true" />
                Falar com especialista
              </a>
              <a
                href="https://instagram.com.br/incriveltechoficial"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Incrível Tech"
                className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-md border border-border-strong bg-glass text-muted transition hover:border-brand/60 hover:text-text"
              >
                <Camera size={17} strokeWidth={1.9} aria-hidden="true" />
              </a>
            </div>

            <div className="mt-7 grid gap-3 text-sm text-muted">
              <ContactLine icon={<Mail size={16} strokeWidth={1.8} aria-hidden="true" />}>
                <a href="mailto:marketing@incrivelpay.com" className="transition hover:text-text">marketing@incrivelpay.com</a>
              </ContactLine>
              <ContactLine icon={<MapPin size={16} strokeWidth={1.8} aria-hidden="true" />}>
                R. Carlos Lindenberg, 801, sala 103 - Cristóvão Colombo, Vila Velha/ES - CEP 29106-405
              </ContactLine>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2 className="text-xs font-extrabold uppercase tracking-normal text-brand">{group.title}</h2>
                <nav className="mt-4 grid gap-2.5" aria-label={group.title}>
                  {group.links.map((link) => (
                    <FooterLink key={link.label} {...link} />
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs leading-5 text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>Incrível Pay Ltda. CNPJ: 45.014.714/0001-97</p>
          <p>&copy; 2026 Incrível Tech. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

function ContactLine({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[20px_minmax(0,1fr)] gap-2.5 leading-6">
      <span className="mt-1 text-brand">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

function FooterLink({ label, href, external }: { label: string; href: string; external?: boolean }) {
  const className = 'group inline-flex items-center gap-1.5 text-sm leading-6 text-muted transition hover:text-text';

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
        <ExternalLink className="opacity-0 transition group-hover:opacity-70" size={13} strokeWidth={1.8} aria-hidden="true" />
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}
