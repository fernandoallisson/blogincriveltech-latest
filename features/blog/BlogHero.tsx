'use client';

import Icon from '@/components/Icon';

export default function BlogHero() {
  return (
    <section className="relative isolate mx-auto grid max-w-[1180px] items-end gap-7 overflow-hidden px-4 pb-8 pt-9 md:grid-cols-[minmax(0,1fr)_360px] md:px-6 md:pb-12 md:pt-14">
      <TechLines />
      <div className="relative z-10 max-w-[820px]">
        <h1 className="max-w-[860px] text-[38px] font-extrabold leading-[1.04] tracking-normal text-text md:text-[64px]">
          A tecnologia por trás dos sorteios que mais crescem.
        </h1>
        <p className="mt-5 max-w-[680px] text-base leading-7 text-muted md:text-lg md:leading-8">
          Guias práticos sobre tecnologia, criação digital e crescimento seguro, organizados para você achar o melhor próximo passo sem perder contexto.
        </p>
      </div>
      <aside className="relative z-10 rounded-lg border border-border-strong bg-surface/75 p-5 shadow-lg backdrop-blur">
        <div className="text-xs font-extrabold uppercase tracking-normal text-brand">Roteiro de leitura</div>
        <p className="mt-3 text-sm leading-6 text-muted">
          Navegue por temas, encontre um guia direto ao ponto e aprofunde quando o assunto pedir mais contexto.
        </p>
        <div className="mt-5 grid gap-3">
          <HeroGuide icon="folder" title="Escolha o tema" text="Categorias funcionam como filtros da própria página." />
          <HeroGuide icon="search" title="Busque com intenção" text="Use título, assunto ou autor para chegar mais rápido ao post certo." />
          <HeroGuide icon="file" title="Leia sem fricção" text="Os cards priorizam resumo, contexto e continuidade." />
        </div>
      </aside>
    </section>
  );
}

function TechLines() {
  return (
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(93,214,218,0.08)_34%,transparent_58%),linear-gradient(180deg,rgba(5,10,18,0)_0%,rgba(5,10,18,0.88)_100%)]" />
      <div className="animate-tech-line absolute left-[-12%] top-8 h-px w-[72%] bg-gradient-to-r from-transparent via-brand/45 to-transparent [--line-rotate:12deg] [--line-speed:11s]" />
      <div className="animate-tech-line-reverse absolute right-[-18%] top-24 h-px w-[78%] bg-gradient-to-r from-transparent via-brand-2/35 to-transparent [--line-rotate:-18deg] [--line-speed:15s]" />
      <div className="animate-tech-line-reverse absolute bottom-16 left-[8%] h-px w-[62%] bg-gradient-to-r from-transparent via-muted/25 to-transparent [--line-rotate:-8deg] [--line-speed:13s]" />
      <div className="animate-tech-line absolute bottom-5 right-[4%] h-px w-[42%] bg-gradient-to-r from-transparent via-brand/30 to-transparent [--line-rotate:10deg] [--line-speed:17s]" />
      <div className="animate-tech-line absolute left-[62%] top-0 h-[78%] w-px bg-gradient-to-b from-transparent via-brand/25 to-transparent [--line-rotate:21deg] [--line-speed:16s]" />
      <div className="animate-tech-line-reverse absolute left-[24%] top-10 h-[64%] w-px bg-gradient-to-b from-transparent via-brand-2/25 to-transparent [--line-rotate:-16deg] [--line-speed:12s]" />
      <div className="animate-tech-node absolute right-[18%] top-20 h-[7px] w-[7px] rounded-full border border-brand/60 bg-bg [--node-speed:3.8s]" />
      <div className="animate-tech-node absolute bottom-24 left-[38%] h-[6px] w-[6px] rounded-full border border-brand-2/50 bg-bg [--node-speed:5.2s]" />
      <div className="animate-tech-node absolute bottom-10 right-[36%] h-[5px] w-[5px] rounded-full border border-muted/35 bg-bg [--node-speed:4.6s]" />
      <div className="animate-tech-grid absolute inset-x-0 top-0 h-full opacity-[0.16] [background-image:linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:88px_88px]" />
    </div>
  );
}

function HeroGuide({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="grid grid-cols-[34px_minmax(0,1fr)] gap-3">
      <span className="grid h-[34px] w-[34px] place-items-center rounded-md border border-border bg-glass text-brand">
        <Icon name={icon} size={16} />
      </span>
      <div>
        <div className="text-sm font-extrabold text-text">{title}</div>
        <p className="mt-1 text-xs leading-5 text-muted">{text}</p>
      </div>
    </div>
  );
}
