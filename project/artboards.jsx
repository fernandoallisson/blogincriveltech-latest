// artboards.jsx — Sample composed views for the design system canvas
// Uses primitives + tokens. All artboards consume CSS vars.

// ─── Sample data ──────────────────────────────────────────────
const POSTS = [
  { id: 1, cat: 'Sorteios Legais', title: 'Como estruturar uma campanha promocional 100% regulamentada pela SUSEP em 2026', excerpt: 'Um guia completo para empreendedores que querem rodar sorteios com segurança jurídica e tecnologia de ponta.', author: 'Lara Vieira', role: 'Head of Compliance', date: '14 abr', read: '8 min', tone: 'brand' },
  { id: 2, cat: 'Tecnologia', title: 'Arquitetura serverless na AWS para escalar sorteios em tempo real', excerpt: 'Por dentro da stack que processa milhões de números em segundos durante uma live de sorteio.', author: 'Diego Marques', role: 'Staff Engineer', date: '11 abr', read: '12 min', tone: 'blue' },
  { id: 3, cat: 'Cases', title: 'Como o @lucas3x faturou R$ 2,1M em 30 dias com títulos de capitalização', excerpt: 'Estratégia, criativos, funil e o papel da transparência regulatória no resultado.', author: 'Mariana Costa', role: 'Content Lead', date: '08 abr', read: '6 min', tone: 'brand' },
  { id: 4, cat: 'Marketing', title: 'O playbook do creator: monetizar audiência com sorteios autorizados', excerpt: 'Frameworks, ganchos e exemplos reais para creators de 10k a 1M seguidores.', author: 'Rafa Tonin', role: 'Growth', date: '05 abr', read: '9 min', tone: 'blue' },
];

const CATEGORIES = [
  { name: 'Sorteios Legais', count: 42, icon: 'shield' },
  { name: 'Capitalização', count: 28, icon: 'file' },
  { name: 'Tecnologia', count: 36, icon: 'bolt' },
  { name: 'Marketing', count: 51, icon: 'rocket' },
  { name: 'Cases', count: 19, icon: 'sparkle' },
  { name: 'AWS & Infra', count: 14, icon: 'aws' },
];

// ═══════════════════════════════════════════════════════════════
// TOKENS — visual showcases
// ═══════════════════════════════════════════════════════════════

function ColorPalette() {
  const ramp = ['50','100','200','300','400','500','600','700','800','900'];
  const Swatch = ({ hex, name, fg }) => (
    <div style={{ flex: 1, height: 64, background: hex, borderRadius: 0, position: 'relative', display: 'flex', alignItems: 'flex-end', padding: 8, color: fg, fontSize: 10, fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.04em' }}>
      <div>
        <div style={{ fontWeight: 700, opacity: 0.85 }}>{name}</div>
        <div style={{ opacity: 0.7 }}>{hex}</div>
      </div>
    </div>
  );
  const brand = { 50:'#EAFEFF', 100:'#CFFAFE', 200:'#A7F8FF', 300:'#67EEF7', 400:'#5CE1E6', 500:'#22C7CF', 600:'#0EA5AD', 700:'#0B7F86', 800:'#0C5F66', 900:'#0A4347' };
  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 28 }}>
      <SectionLabel kicker="Cores" title="Paleta da marca" desc="Ciano neon como cor de destaque, com rampa completa para uso em estados, fundos e dados."/>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Brand · Cyan</div>
        <div style={{ display: 'flex', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
          {ramp.map(k => <Swatch key={k} hex={brand[k]} name={k} fg={parseInt(k) >= 500 ? '#fff' : '#02161A'}/>)}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { l: 'Background', v: 'var(--bg)', t: '--bg' },
          { l: 'Surface', v: 'var(--surface)', t: '--surface' },
          { l: 'Surface 2', v: 'var(--surface-2)', t: '--surface-2' },
          { l: 'Glass', v: 'var(--glass)', t: '--glass' },
        ].map(s => (
          <div key={s.t} style={{ padding: 16, background: s.v, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backdropFilter: 'blur(12px)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{s.l}</div>
            <div style={{ fontSize: 11, color: 'var(--text-subtle)', fontFamily: 'var(--font-mono, monospace)', marginTop: 4 }}>{s.t}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { l: 'Success', v: 'var(--success)' },
          { l: 'Warning', v: 'var(--warning)' },
          { l: 'Error',   v: 'var(--error)' },
          { l: 'Info',    v: 'var(--info)' },
        ].map(s => (
          <div key={s.l} style={{ padding: 14, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)' }}>
            <div style={{ width: '100%', height: 36, background: s.v, borderRadius: 'var(--radius-sm)' }}/>
            <div style={{ fontSize: 12, marginTop: 8, color: 'var(--text)', fontWeight: 600 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TypeScale() {
  const items = [
    { l: 'Display / 56', s: 56, w: 700, t: 'O futuro dos sorteios' },
    { l: 'H1 / 40',      s: 40, w: 700, t: 'Plataforma legal, segura, escalável' },
    { l: 'H2 / 30',      s: 30, w: 700, t: 'Tecnologia que move o mercado' },
    { l: 'H3 / 22',      s: 22, w: 600, t: 'Sorteios em tempo real, validados pela SUSEP' },
    { l: 'Body Lg / 18', s: 18, w: 400, t: 'Conteúdo editorial extenso e legível, com leading generoso para sessões longas de leitura.' },
    { l: 'Body / 15',    s: 15, w: 400, t: 'Texto padrão para parágrafos de blog, descrições de cards e UI densa.' },
    { l: 'Caption / 12', s: 12, w: 500, t: '14 ABR · 8 MIN DE LEITURA · COMPLIANCE' },
  ];
  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <SectionLabel kicker="Tipografia" title="Plus Jakarta Sans + JetBrains Mono" desc="Hierarquia clara, tracking apertado em títulos, generoso em micro-copy. Mono apenas para código e tokens."/>
      {items.map(i => (
        <div key={i.l} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 24, alignItems: 'baseline', paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, color: 'var(--text-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{i.l}</div>
          <div style={{ fontSize: i.s, fontWeight: i.w, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>{i.t}</div>
        </div>
      ))}
      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 24, alignItems: 'baseline' }}>
        <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, color: 'var(--text-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Code · Mono / 13</div>
        <code style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 13, color: 'var(--brand)', background: 'var(--brand-soft)', padding: '4px 10px', borderRadius: 6 }}>const sorteio = await susep.validate(payload)</code>
      </div>
    </div>
  );
}

function SpacingShadows() {
  const sp = [4, 8, 12, 16, 24, 32, 48, 64];
  const radii = [{l:'xs',v:4},{l:'sm',v:6},{l:'md',v:10},{l:'lg',v:14},{l:'xl',v:20}];
  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 28 }}>
      <SectionLabel kicker="Espaço & Forma" title="Spacing, Radii e Shadows" desc="Escala 4px. Sombras compostas para profundidade discreta. Glow específico para destaques da marca."/>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Spacing scale (4px base)</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          {sp.map(s => (
            <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ width: s, height: s, background: 'var(--brand)', borderRadius: 2 }}/>
              <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, color: 'var(--text-subtle)' }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Radii</div>
        <div style={{ display: 'flex', gap: 16 }}>
          {radii.map(r => (
            <div key={r.l} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 64, height: 64, background: 'var(--glass)', border: '1px solid var(--brand)', borderRadius: r.v, backdropFilter: 'blur(8px)' }}/>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{r.l}</div>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 10, color: 'var(--text-subtle)' }}>{r.v}px</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Shadows</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
          {[
            { l: 'sm', v: 'var(--shadow-sm)' },
            { l: 'md', v: 'var(--shadow-md)' },
            { l: 'lg', v: 'var(--shadow-lg)' },
            { l: 'xl', v: 'var(--shadow-xl)' },
            { l: 'glow', v: 'var(--shadow-glow)' },
          ].map(s => (
            <div key={s.l} style={{ height: 80, borderRadius: 'var(--radius-md)', background: 'var(--surface)', boxShadow: s.v, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
              <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, color: 'var(--text-muted)' }}>{s.l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTS — showcases
// ═══════════════════════════════════════════════════════════════

function ButtonsShowcase() {
  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SectionLabel kicker="Componentes" title="Buttons & IconButtons" desc="Primary com gradiente sutil + glow. Secondary glassmorphism. Ghost para ações terciárias."/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="primary" icon="rocket">Publicar post</Button>
          <Button variant="secondary" icon="eye">Pré-visualizar</Button>
          <Button variant="outline">Ver mais</Button>
          <Button variant="ghost" iconRight="arrow">Saiba mais</Button>
          <Button variant="danger" icon="trash">Excluir</Button>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Button size="sm" variant="primary">Small</Button>
          <Button size="md" variant="primary">Medium</Button>
          <Button size="lg" variant="primary" iconRight="arrow">Large com seta</Button>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <IconButton name="search"/>
          <IconButton name="bell" badge={3}/>
          <IconButton name="bookmark" variant="secondary"/>
          <IconButton name="plus" variant="primary"/>
          <IconButton name="settings" size="lg" variant="secondary"/>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="secondary" disabled>Disabled</Button>
        </div>
      </div>
    </div>
  );
}

function FormsShowcase() {
  const [s, setS] = React.useState('');
  const [t, setT] = React.useState('Em produtos de tecnologia, a confiança é construída no detalhe.');
  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 540 }}>
      <SectionLabel kicker="Componentes" title="Inputs & Forms" desc="Campos com glassmorphism, focus ring suave em ciano, hints e errors integrados."/>
      <Input label="Buscar no blog" icon="search" placeholder="Sorteios, AWS, capitalização..." value={s} onChange={e => setS(e.target.value)}/>
      <Input label="Email do autor" type="email" placeholder="autor@incrivel.tech" hint="Use o email corporativo."/>
      <Input label="Slug do post" placeholder="meu-novo-post" error="Slug já existe."/>
      <Select label="Categoria" options={['Sorteios Legais','Tecnologia','Marketing','Cases']}/>
      <Textarea label="Resumo (excerpt)" rows={3} value={t} onChange={e => setT(e.target.value)}/>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', paddingTop: 8 }}>
        <Switch checked={true} label="Publicar imediatamente"/>
        <Switch checked={false} label="Marcar como destaque"/>
      </div>
    </div>
  );
}

function BadgesTagsShowcase() {
  const [active, setActive] = React.useState('Sorteios Legais');
  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <SectionLabel kicker="Componentes" title="Badges & Tags" desc="Badges para status; Tags clicáveis para filtros e categorias."/>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Badges (status)</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone="brand" soft dot>Publicado</Badge>
          <Badge tone="success" soft dot>Aprovado</Badge>
          <Badge tone="warning" soft dot>Em revisão</Badge>
          <Badge tone="error" soft dot>Rejeitado</Badge>
          <Badge tone="info" soft icon="sparkle">Novo</Badge>
          <Badge tone="neutral" soft icon="lock">Privado</Badge>
        </div>
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Filter tags</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['Sorteios Legais','Capitalização','Tecnologia','AWS & Infra','Cases','Marketing'].map(t => (
            <Tag key={t} active={active === t} onClick={() => setActive(t)}>{t}</Tag>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Toasts</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Toast tone="success" title="Post publicado" desc="Visível em incrivel.tech/blog em alguns segundos." icon="check"/>
          <Toast tone="warning" title="Imagem otimizada" desc="Reduzida em 64% para melhor performance." icon="image"/>
        </div>
      </div>
    </div>
  );
}

// ─── Post card variants ───────────────────────────────────────
function PostCardListItem({ post }) {
  return (
    <Card padding={0} hover onClick={()=>{}} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 0, overflow: 'hidden' }}>
      <ImgPlaceholder w="180px" h={130} radius="0" label="cover" tone={post.tone}/>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Badge tone="brand" soft size="sm">{post.cat}</Badge>
          <span style={{ fontSize: 11, color: 'var(--text-subtle)', fontFamily: 'var(--font-mono, monospace)' }}>{post.date} · {post.read}</span>
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em', lineHeight: 1.25 }}>{post.title}</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.excerpt}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto' }}>
          <Avatar name={post.author} size={22}/>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{post.author}</span>
        </div>
      </div>
    </Card>
  );
}

function PostCardGrid({ post }) {
  return (
    <Card padding={0} hover onClick={()=>{}} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <ImgPlaceholder h={160} radius="0" label="cover" tone={post.tone}/>
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Badge tone="brand" soft size="sm">{post.cat}</Badge>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.015em', lineHeight: 1.25 }}>{post.title}</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.excerpt}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
          <Avatar name={post.author} size={26}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>{post.author}</div>
            <div style={{ fontSize: 11, color: 'var(--text-subtle)', fontFamily: 'var(--font-mono, monospace)' }}>{post.date} · {post.read}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function PostCardFeatured({ post }) {
  return (
    <Card padding={0} hover onClick={()=>{}} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', overflow: 'hidden', minHeight: 320 }} glow>
      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Badge tone="brand" soft icon="flame">Destaque</Badge>
            <Badge tone="neutral" soft size="sm">{post.cat}</Badge>
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.025em', lineHeight: 1.1 }}>{post.title}</div>
          <div style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.55 }}>{post.excerpt}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar name={post.author} size={36}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>{post.author}</div>
            <div style={{ fontSize: 11, color: 'var(--text-subtle)', fontFamily: 'var(--font-mono, monospace)' }}>{post.role} · {post.date} · {post.read}</div>
          </div>
          <Button variant="primary" size="sm" iconRight="arrow">Ler agora</Button>
        </div>
      </div>
      <ImgPlaceholder h="100%" radius="0" label="hero · 1600×900" tone="brand"/>
    </Card>
  );
}

function PostCardsShowcase() {
  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SectionLabel kicker="Componentes" title="Cards de post" desc="Três variações: Featured (hero), Grid (home), List (categoria/busca)."/>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Featured</div>
        <PostCardFeatured post={POSTS[0]}/>
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Grid</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <PostCardGrid post={POSTS[1]}/>
          <PostCardGrid post={POSTS[2]}/>
          <PostCardGrid post={POSTS[3]}/>
        </div>
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, letterSpacing: '0.04em', textTransform: 'uppercase' }}>List</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <PostCardListItem post={POSTS[1]}/>
          <PostCardListItem post={POSTS[2]}/>
        </div>
      </div>
    </div>
  );
}

function NavShowcase() {
  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionLabel kicker="Componentes" title="Navegação" desc="Header sticky com glass, breadcrumb, sidebar admin."/>
      {/* Header */}
      <div style={{ borderRadius: 'var(--radius-lg)', background: 'var(--glass)', backdropFilter: 'blur(20px)', border: '1px solid var(--glass-border)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 24 }}>
        <Logo/>
        <nav style={{ display: 'flex', gap: 6, marginLeft: 16 }}>
          {['Home','Sorteios','Tecnologia','Cases','Sobre'].map((l, i) => (
            <a key={l} style={{ padding: '8px 12px', fontSize: 14, fontWeight: i === 0 ? 600 : 500, color: i === 0 ? 'var(--brand)' : 'var(--text-muted)', textDecoration: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', position: 'relative' }}>
              {l}
              {i === 0 && <span style={{ position: 'absolute', bottom: 0, left: 12, right: 12, height: 2, background: 'var(--brand)', borderRadius: 2 }}/>}
            </a>
          ))}
        </nav>
        <div style={{ flex: 1 }}/>
        <div style={{ width: 240 }}><Input size="sm" icon="search" placeholder="Buscar..."/></div>
        <IconButton name="bell" badge={2}/>
        <Button variant="primary" size="sm" icon="user">Entrar</Button>
      </div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13 }}>
        <Icon name="home" size={14}/>
        <span style={{ cursor: 'pointer' }}>Home</span>
        <Icon name="chevright" size={12} color="var(--text-subtle)"/>
        <span style={{ cursor: 'pointer' }}>Tecnologia</span>
        <Icon name="chevright" size={12} color="var(--text-subtle)"/>
        <span style={{ color: 'var(--text)' }}>Arquitetura serverless na AWS para escalar sorteios</span>
      </div>
      {/* Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 16, height: 320 }}>
        <div style={{ borderRadius: 'var(--radius-lg)', background: 'var(--surface)', border: '1px solid var(--border)', padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-subtle)', padding: '6px 10px' }}>Conteúdo</div>
          {[
            { i: 'chart', l: 'Dashboard', a: false },
            { i: 'file',  l: 'Posts',     a: true,  badge: 12 },
            { i: 'folder',l: 'Categorias',a: false },
            { i: 'tag',   l: 'Tags',      a: false },
            { i: 'image', l: 'Mídia',     a: false },
          ].map(it => (
            <a key={it.l} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              color: it.a ? 'var(--brand)' : 'var(--text-muted)',
              background: it.a ? 'var(--brand-soft)' : 'transparent',
            }}>
              <Icon name={it.i} size={15}/>
              <span style={{ flex: 1 }}>{it.l}</span>
              {it.badge && <Badge tone="brand" soft size="sm">{it.badge}</Badge>}
            </a>
          ))}
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-subtle)', padding: '14px 10px 6px' }}>Configurar</div>
          {[
            { i: 'sparkle',  l: 'Aparência' },
            { i: 'user',     l: 'Autores' },
            { i: 'settings', l: 'Geral' },
          ].map(it => (
            <a key={it.l} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: 'var(--text-muted)' }}>
              <Icon name={it.i} size={15}/>{it.l}
            </a>
          ))}
        </div>
        <div style={{ borderRadius: 'var(--radius-lg)', background: 'var(--surface)', border: '1px solid var(--border)', padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono, monospace)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>◇ conteúdo do painel</div>
      </div>
    </div>
  );
}

function ModalShowcase() {
  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionLabel kicker="Componentes" title="Modais" desc="Confirmação destrutiva e diálogo de publicação."/>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Confirm */}
        <div style={{ position: 'relative', height: 280, borderRadius: 'var(--radius-lg)', background: 'var(--overlay)', backdropFilter: 'blur(8px)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card padding={24} style={{ width: 360 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'color-mix(in oklab, var(--error) 18%, transparent)', color: 'var(--error)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="trash" size={16}/></div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Excluir post?</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.5 }}>Esta ação não pode ser desfeita. O post será removido permanentemente.</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button size="sm" variant="ghost">Cancelar</Button>
              <Button size="sm" variant="danger" icon="trash">Excluir</Button>
            </div>
          </Card>
        </div>
        {/* Publish */}
        <div style={{ position: 'relative', height: 280, borderRadius: 'var(--radius-lg)', background: 'var(--overlay)', backdropFilter: 'blur(8px)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card padding={24} style={{ width: 360 }} glow>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Publicar post</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Defina visibilidade e agendamento.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Select size="sm" options={['Publicar agora','Agendar para depois','Salvar como rascunho']}/>
              <Switch checked={true} label="Notificar assinantes por email"/>
              <Switch checked={false} label="Publicar no LinkedIn"/>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
              <Button size="sm" variant="ghost">Cancelar</Button>
              <Button size="sm" variant="primary" icon="rocket">Publicar</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LAYOUTS — Blog
// ═══════════════════════════════════════════════════════════════

function BlogHome() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', background: 'var(--bg-gradient)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 24, borderBottom: '1px solid var(--border)', background: 'var(--glass)', backdropFilter: 'blur(20px)' }}>
        <Logo/>
        <nav style={{ display: 'flex', gap: 4, marginLeft: 12 }}>
          {['Home','Sorteios','Tecnologia','Cases','Sobre'].map((l, i) => (
            <a key={l} style={{ padding: '6px 10px', fontSize: 13, fontWeight: 500, color: i === 0 ? 'var(--brand)' : 'var(--text-muted)', cursor: 'pointer' }}>{l}</a>
          ))}
        </nav>
        <div style={{ flex: 1 }}/>
        <div style={{ width: 220 }}><Input size="sm" icon="search" placeholder="Buscar..."/></div>
        <IconButton name="moon" size="sm" variant="secondary"/>
        <Button size="sm" variant="primary">Assinar</Button>
      </div>
      {/* Hero */}
      <div style={{ padding: '40px 48px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Badge tone="brand" soft icon="sparkle">Edição #128 · Abril 2026</Badge>
        <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text)', lineHeight: 1.05, maxWidth: 720 }}>
          Tecnologia, legalidade e crescimento em <span style={{ color: 'var(--brand)' }}>sorteios digitais</span>.
        </div>
        <div style={{ fontSize: 17, color: 'var(--text-muted)', maxWidth: 640, lineHeight: 1.55 }}>
          Conteúdo prático para empreendedores, creators e times técnicos que querem operar sorteios e títulos de capitalização com segurança e escala.
        </div>
      </div>
      {/* Featured + sidebar */}
      <div style={{ padding: '8px 48px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <PostCardFeatured post={POSTS[0]}/>
        <Card padding={20} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>Mais lidos</div>
          {POSTS.slice(1, 4).map((p, i) => (
            <div key={p.id} style={{ display: 'flex', gap: 12, paddingBottom: 12, borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--brand)', fontFamily: 'var(--font-mono, monospace)', minWidth: 28 }}>0{i+1}</div>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.005em' }}>{p.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 4, fontFamily: 'var(--font-mono, monospace)' }}>{p.cat} · {p.read}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
      {/* Categories */}
      <div style={{ padding: '32px 48px 16px', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-subtle)', marginRight: 8 }}>Categorias</span>
        <Tag active>Todos</Tag>
        {CATEGORIES.map(c => <Tag key={c.name} icon={c.icon}>{c.name}</Tag>)}
      </div>
      {/* Grid */}
      <div style={{ padding: '8px 48px 40px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, overflow: 'auto', flex: 1 }}>
        {POSTS.slice(1).concat(POSTS).map((p, i) => <PostCardGrid key={i} post={p}/>)}
      </div>
    </div>
  );
}

function BlogPost() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto', background: 'var(--bg-gradient)' }}>
      <div style={{ padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 24, borderBottom: '1px solid var(--border)', background: 'var(--glass)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <Logo/>
        <div style={{ flex: 1 }}/>
        <IconButton name="bookmark" size="sm" variant="secondary"/>
        <IconButton name="share" size="sm" variant="secondary"/>
        <Button size="sm" variant="primary">Assinar</Button>
      </div>
      <article style={{ maxWidth: 760, margin: '0 auto', padding: '48px 32px 64px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 12 }}>
          <Icon name="home" size={12}/><span>Home</span><Icon name="chevright" size={11}/><span>Tecnologia</span>
        </div>
        <Badge tone="brand" soft icon="bolt">Tecnologia</Badge>
        <h1 style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text)', lineHeight: 1.08, margin: 0 }}>
          Arquitetura serverless na AWS para escalar sorteios em tempo real
        </h1>
        <p style={{ fontSize: 19, color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
          Por dentro da stack que processa milhões de números em segundos durante uma live de sorteio — Lambda, DynamoDB, EventBridge e o que aprendemos escalando para 8 dígitos de participantes.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <Avatar name="Diego Marques" size={40}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 600 }}>Diego Marques</div>
            <div style={{ fontSize: 12, color: 'var(--text-subtle)', fontFamily: 'var(--font-mono, monospace)' }}>Staff Engineer · 11 abr 2026 · 12 min</div>
          </div>
          <IconButton name="heart" size="sm" variant="secondary"/>
          <IconButton name="bookmark" size="sm" variant="secondary"/>
        </div>
        <ImgPlaceholder h={360} label="hero · 1600×900" tone="brand"/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, fontSize: 17, color: 'var(--text)', lineHeight: 1.7 }}>
          <p style={{ margin: 0 }}>Quando começamos a operar sorteios com mais de 2 milhões de participantes simultâneos, o primeiro instinto foi escalar verticalmente. Spoiler: foi o caminho errado.</p>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', margin: '12px 0 0' }}>O problema dos picos</h2>
          <p style={{ margin: 0 }}>Em uma live de sorteio, 80% do tráfego acontece em janelas de 90 segundos. Provisionar para o pico significa pagar 24/7 por capacidade ociosa.</p>
          {/* Code block */}
          <pre style={{ margin: 0, padding: 18, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono, monospace)', fontSize: 13, color: 'var(--text-muted)', overflow: 'auto', lineHeight: 1.6 }}>
{`export const handler = async (event) => {
  const { numero, sorteioId } = event.body;
  await dynamo.put({
    TableName: 'participantes',
    Item: { sorteioId, numero, ts: Date.now() }
  });
  return { statusCode: 201 };
};`}
          </pre>
          <blockquote style={{ margin: 0, padding: '12px 18px', borderLeft: '3px solid var(--brand)', background: 'var(--brand-soft)', borderRadius: '0 var(--radius-md) var(--radius-md) 0', color: 'var(--text)', fontSize: 18, fontStyle: 'italic', lineHeight: 1.5 }}>
            "Confiabilidade não é o oposto de velocidade — é o pré-requisito para ela operar em escala."
          </blockquote>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 12 }}>
          <Tag>AWS</Tag><Tag>Serverless</Tag><Tag>DynamoDB</Tag><Tag>Performance</Tag>
        </div>
      </article>
    </div>
  );
}

function BlogCategory() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', background: 'var(--bg-gradient)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 24, borderBottom: '1px solid var(--border)', background: 'var(--glass)', backdropFilter: 'blur(20px)' }}>
        <Logo/>
        <div style={{ flex: 1 }}/>
        <Button size="sm" variant="primary">Assinar</Button>
      </div>
      <div style={{ padding: '36px 48px 24px', display: 'flex', flexDirection: 'column', gap: 12, borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 12 }}>
          <Icon name="home" size={12}/><span>Home</span><Icon name="chevright" size={11}/><span>Categorias</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <h1 style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text)', margin: 0, lineHeight: 1 }}>Sorteios Legais</h1>
          <Badge tone="brand" soft>42 posts</Badge>
        </div>
        <div style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 580, lineHeight: 1.5 }}>
          Tudo sobre regulamentação SUSEP, capitalização e como rodar campanhas seguras.
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, padding: '24px 48px', flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflow: 'auto' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
            <Tag active>Mais recentes</Tag>
            <Tag>Mais lidos</Tag>
            <Tag>Em alta</Tag>
            <div style={{ flex: 1 }}/>
            <span style={{ fontSize: 12, color: 'var(--text-subtle)', fontFamily: 'var(--font-mono, monospace)' }}>42 resultados</span>
          </div>
          {[...POSTS, ...POSTS].map((p, i) => <PostCardListItem key={i} post={p}/>)}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card padding={18}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: 12 }}>Categorias</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {CATEGORIES.map(c => (
                <a key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: 13, color: c.name === 'Sorteios Legais' ? 'var(--brand)' : 'var(--text-muted)', background: c.name === 'Sorteios Legais' ? 'var(--brand-soft)' : 'transparent', cursor: 'pointer', fontWeight: 500 }}>
                  <Icon name={c.icon} size={14}/>
                  <span style={{ flex: 1 }}>{c.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-subtle)', fontFamily: 'var(--font-mono, monospace)' }}>{c.count}</span>
                </a>
              ))}
            </div>
          </Card>
          <Card padding={18} glow>
            <Badge tone="brand" soft icon="bell">Newsletter</Badge>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginTop: 10, letterSpacing: '-0.01em', lineHeight: 1.3 }}>Receba semanalmente o melhor sobre sorteios e tech</div>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Input size="sm" placeholder="seu@email.com" icon="inbox"/>
              <Button size="sm" variant="primary" full>Assinar grátis</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ADMIN
// ═══════════════════════════════════════════════════════════════

function AdminSidebar({ active = 'posts' }) {
  const items = [
    { i: 'chart',    l: 'Dashboard', k: 'dashboard' },
    { i: 'file',     l: 'Posts',     k: 'posts', badge: 12 },
    { i: 'folder',   l: 'Categorias',k: 'cats' },
    { i: 'tag',      l: 'Tags',      k: 'tags' },
    { i: 'image',    l: 'Mídia',     k: 'media' },
    { i: 'user',     l: 'Autores',   k: 'auth' },
  ];
  const config = [
    { i: 'sparkle',  l: 'Aparência', k: 'theme' },
    { i: 'settings', l: 'Geral',     k: 'set' },
  ];
  return (
    <div style={{ width: 220, padding: '20px 12px', background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 4, height: '100%' }}>
      <div style={{ padding: '0 8px 16px' }}><Logo/></div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-subtle)', padding: '6px 10px' }}>Conteúdo</div>
      {items.map(it => (
        <a key={it.k} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
          color: it.k === active ? 'var(--brand)' : 'var(--text-muted)',
          background: it.k === active ? 'var(--brand-soft)' : 'transparent',
        }}>
          <Icon name={it.i} size={15}/>
          <span style={{ flex: 1 }}>{it.l}</span>
          {it.badge && <Badge tone="brand" soft size="sm">{it.badge}</Badge>}
        </a>
      ))}
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-subtle)', padding: '14px 10px 6px' }}>Configurar</div>
      {config.map(it => (
        <a key={it.k} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
          color: it.k === active ? 'var(--brand)' : 'var(--text-muted)',
          background: it.k === active ? 'var(--brand-soft)' : 'transparent',
        }}>
          <Icon name={it.i} size={15}/>{it.l}
        </a>
      ))}
      <div style={{ flex: 1 }}/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: 'var(--radius-md)', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        <Avatar name="Lara Vieira" size={28}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, color: 'var(--text)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Lara Vieira</div>
          <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>Editor-Chefe</div>
        </div>
        <Icon name="chevright" size={12} color="var(--text-subtle)"/>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const stats = [
    { l: 'Posts publicados', v: '128', d: '+8 esse mês', tone: 'brand' },
    { l: 'Visualizações',     v: '342k', d: '+18% vs. mês anterior', tone: 'success' },
    { l: 'Tempo médio',       v: '4:52', d: 'leitura por post', tone: 'info' },
    { l: 'Novos assinantes',  v: '1.284', d: '+342 esta semana', tone: 'warning' },
  ];
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', background: 'var(--bg-gradient)', overflow: 'hidden' }}>
      <AdminSidebar active="dashboard"/>
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-subtle)', fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.06em' }}>SEG, 27 ABRIL 2026</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)', margin: '4px 0 0' }}>Olá, Lara <span style={{ opacity: 0.5 }}>👋</span></h1>
          </div>
          <div style={{ flex: 1 }}/>
          <Button variant="secondary" icon="upload">Importar</Button>
          <Button variant="primary" icon="plus">Novo post</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
          {stats.map(s => (
            <Card key={s.l} padding={18}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{s.l}</div>
              <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em', marginTop: 4 }}>{s.v}</div>
              <div style={{ fontSize: 12, color: `var(--${s.tone === 'brand' ? 'brand' : s.tone})`, marginTop: 6, fontWeight: 500 }}>{s.d}</div>
            </Card>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          <Card padding={20}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Tráfego (últimos 30 dias)</div>
              <div style={{ flex: 1 }}/>
              <Tag active>30d</Tag>
              <span style={{ width: 6 }}/>
              <Tag>90d</Tag>
            </div>
            {/* Mini chart */}
            <svg viewBox="0 0 600 180" style={{ width: '100%', height: 180 }}>
              <defs>
                <linearGradient id="chartG" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="var(--brand)" stopOpacity="0.4"/>
                  <stop offset="1" stopColor="var(--brand)" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {[40, 80, 120, 160].map(y => <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="var(--border)" strokeDasharray="2 4"/>)}
              <path d="M0,140 L40,120 L80,130 L120,90 L160,100 L200,70 L240,80 L280,50 L320,60 L360,40 L400,55 L440,30 L480,45 L520,25 L560,35 L600,20 L600,180 L0,180 Z" fill="url(#chartG)"/>
              <path d="M0,140 L40,120 L80,130 L120,90 L160,100 L200,70 L240,80 L280,50 L320,60 L360,40 L400,55 L440,30 L480,45 L520,25 L560,35 L600,20" fill="none" stroke="var(--brand)" strokeWidth="2"/>
            </svg>
          </Card>
          <Card padding={20}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>Top posts da semana</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {POSTS.slice(0, 4).map((p, i) => (
                <div key={p.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand)', fontFamily: 'var(--font-mono, monospace)', minWidth: 22 }}>0{i+1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-subtle)', fontFamily: 'var(--font-mono, monospace)', marginTop: 2 }}>{(12 - i * 2)}.{i*3}k views</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AdminPostsList() {
  const rows = [
    { t: 'Como estruturar uma campanha promocional 100% regulamentada', s: 'published', cat: 'Sorteios Legais', author: 'Lara V.', date: '14 abr', views: '12.4k' },
    { t: 'Arquitetura serverless na AWS para escalar sorteios em tempo real', s: 'published', cat: 'Tecnologia', author: 'Diego M.', date: '11 abr', views: '8.9k' },
    { t: 'Como o @lucas3x faturou R$ 2,1M em 30 dias com capitalização', s: 'review', cat: 'Cases', author: 'Mariana C.', date: '08 abr', views: '—' },
    { t: 'O playbook do creator: monetizar audiência com sorteios', s: 'draft', cat: 'Marketing', author: 'Rafa T.', date: '05 abr', views: '—' },
    { t: 'Compliance e LGPD em campanhas promocionais — o guia 2026', s: 'scheduled', cat: 'Sorteios Legais', author: 'Lara V.', date: '02 mai', views: '—' },
  ];
  const status = {
    published: { tone: 'success', label: 'Publicado' },
    review:    { tone: 'warning', label: 'Em revisão' },
    draft:     { tone: 'neutral', label: 'Rascunho' },
    scheduled: { tone: 'info',    label: 'Agendado' },
  };
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', background: 'var(--bg-gradient)', overflow: 'hidden' }}>
      <AdminSidebar active="posts"/>
      <div style={{ flex: 1, overflow: 'hidden', padding: '24px 32px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)', margin: 0 }}>Posts</h1>
          <Badge tone="neutral" soft>128 total</Badge>
          <div style={{ flex: 1 }}/>
          <div style={{ width: 240 }}><Input size="sm" icon="search" placeholder="Buscar posts..."/></div>
          <Button variant="secondary" size="sm" icon="folder">Filtros</Button>
          <Button variant="primary" size="sm" icon="plus">Novo post</Button>
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {['Todos','Publicados','Rascunhos','Em revisão','Agendados','Lixeira'].map((l, i) => (
            <Tag key={l} active={i === 0}>{l}</Tag>
          ))}
        </div>
        <Card padding={0} style={{ overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 130px 120px 80px 70px 36px', gap: 16, padding: '12px 18px', fontSize: 11, fontWeight: 700, color: 'var(--text-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>
            <div>Título</div><div>Categoria</div><div>Autor</div><div>Status</div><div>Data</div><div style={{ textAlign: 'right' }}>Views</div><div/>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {rows.map((r, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 140px 130px 120px 80px 70px 36px', gap: 16, padding: '14px 18px', alignItems: 'center', borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', transition: 'background 120ms' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <div style={{ width: 36, height: 28, borderRadius: 6, background: 'linear-gradient(135deg, var(--brand-soft), var(--surface-2))', border: '1px solid var(--border)', flexShrink: 0 }}/>
                  <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.t}</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.cat}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Avatar name={r.author} size={20}/>{r.author}
                </div>
                <div><Badge tone={status[r.s].tone} soft dot size="sm">{status[r.s].label}</Badge></div>
                <div style={{ fontSize: 12, color: 'var(--text-subtle)', fontFamily: 'var(--font-mono, monospace)' }}>{r.date}</div>
                <div style={{ fontSize: 12, color: 'var(--text)', fontFamily: 'var(--font-mono, monospace)', textAlign: 'right', fontWeight: 500 }}>{r.views}</div>
                <IconButton name="settings" size="sm"/>
              </div>
            ))}
          </div>
          <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--text-subtle)' }}>Mostrando 1–5 de 128</span>
            <div style={{ flex: 1 }}/>
            <IconButton name="chevleft" size="sm" variant="secondary"/>
            <span style={{ fontSize: 12, color: 'var(--text)' }}>1 / 26</span>
            <IconButton name="chevright" size="sm" variant="secondary"/>
          </div>
        </Card>
      </div>
    </div>
  );
}

function AdminEditor() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', background: 'var(--bg-gradient)', overflow: 'hidden' }}>
      <AdminSidebar active="posts"/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--border)', background: 'var(--glass)', backdropFilter: 'blur(20px)' }}>
          <IconButton name="chevleft" size="sm"/>
          <div style={{ fontSize: 12, color: 'var(--text-subtle)' }}>Posts /</div>
          <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>Arquitetura serverless na AWS...</div>
          <Badge tone="neutral" soft dot size="sm">Rascunho</Badge>
          <span style={{ fontSize: 11, color: 'var(--text-subtle)', fontFamily: 'var(--font-mono, monospace)', marginLeft: 4 }}>Salvo há 2 min</span>
          <div style={{ flex: 1 }}/>
          <Button variant="ghost" size="sm" icon="eye">Pré-visualizar</Button>
          <Button variant="secondary" size="sm">Salvar rascunho</Button>
          <Button variant="primary" size="sm" icon="rocket">Publicar</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', flex: 1, overflow: 'hidden' }}>
          {/* Editor */}
          <div style={{ overflow: 'auto', padding: '32px 64px' }}>
            {/* Format toolbar */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2, padding: 4, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: 24 }}>
              {['bold','italic','link','quote','list','code','image'].map(n => <IconButton key={n} name={n} size="sm"/>)}
            </div>
            <div contentEditable suppressContentEditableWarning style={{ outline: 'none', fontSize: 36, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text)', lineHeight: 1.1, marginBottom: 16 }}>
              Arquitetura serverless na AWS para escalar sorteios em tempo real
            </div>
            <div contentEditable suppressContentEditableWarning style={{ outline: 'none', fontSize: 17, color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: 32 }}>
              Por dentro da stack que processa milhões de números em segundos durante uma live de sorteio.
            </div>
            <ImgPlaceholder h={240} label="hero · arraste e solte" tone="brand"/>
            <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 18, fontSize: 16, color: 'var(--text)', lineHeight: 1.7 }}>
              <p style={{ margin: 0 }} contentEditable suppressContentEditableWarning>Quando começamos a operar sorteios com mais de 2 milhões de participantes simultâneos, o primeiro instinto foi escalar verticalmente. Spoiler: foi o caminho errado.</p>
              <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', margin: '8px 0 0' }} contentEditable suppressContentEditableWarning>O problema dos picos</h2>
              <p style={{ margin: 0 }} contentEditable suppressContentEditableWarning>Em uma live de sorteio, 80% do tráfego acontece em janelas de 90 segundos.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 14, border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', color: 'var(--text-subtle)', fontSize: 13, cursor: 'pointer' }}>
                <Icon name="plus" size={14}/> Adicionar bloco — texto, código, imagem, citação...
              </div>
            </div>
          </div>
          {/* Right panel */}
          <div style={{ borderLeft: '1px solid var(--border)', background: 'var(--surface)', padding: 20, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: 10 }}>Capa</div>
              <ImgPlaceholder h={120} label="cover" tone="brand"/>
              <Button variant="secondary" size="sm" icon="upload" full style={{ marginTop: 8 }}>Trocar imagem</Button>
            </div>
            <Input label="Slug" value="aws-serverless-sorteios" onChange={()=>{}} size="sm"/>
            <Select label="Categoria" options={CATEGORIES.map(c => c.name)} size="sm"/>
            <Input label="Tags" placeholder="aws, serverless..." size="sm" icon="tag"/>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: 8 }}>SEO</div>
              <Input label="Meta título" value="Arquitetura serverless..." size="sm"/>
              <div style={{ height: 10 }}/>
              <Textarea label="Meta descrição" rows={3} value="Por dentro da stack..."/>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: 8 }}>Opções</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Switch checked={true} label="Permitir comentários"/>
                <Switch checked={false} label="Marcar como destaque"/>
                <Switch checked={true} label="Indexar no Google"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminTheming() {
  const [color, setColor] = React.useState('#5CE1E6');
  const presets = ['#5CE1E6','#00A7F9','#A78BFA','#22C55E','#FACC15','#EF4444'];
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', background: 'var(--bg-gradient)', overflow: 'hidden' }}>
      <AdminSidebar active="theme"/>
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px' }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)', margin: 0 }}>Aparência do blog</h1>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Personalize cores, tipografia, raios e modo escuro — preview ao vivo.</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card padding={18}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: 12 }}>Cor de destaque</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {presets.map(p => (
                  <button key={p} onClick={() => setColor(p)} style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-md)', background: p,
                    border: color === p ? `2px solid var(--text)` : '1px solid var(--border)',
                    cursor: 'pointer', position: 'relative',
                  }}>
                    {color === p && <Icon name="check" size={14} color="#02161A" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}/>}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: color, border: '1px solid var(--border)' }}/>
                <code style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 13, color: 'var(--text)' }}>{color}</code>
              </div>
            </Card>
            <Card padding={18}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: 12 }}>Tipografia</div>
              <Select size="sm" options={['Plus Jakarta Sans','Manrope','Geist','Inter']}/>
              <div style={{ height: 10 }}/>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Tamanho base · 15px</div>
              <input type="range" min={14} max={18} defaultValue={15} style={{ width: '100%', accentColor: 'var(--brand)' }}/>
            </Card>
            <Card padding={18}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: 12 }}>Raio de borda</div>
              <input type="range" min={0} max={20} defaultValue={10} style={{ width: '100%', accentColor: 'var(--brand)' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-subtle)', fontFamily: 'var(--font-mono, monospace)', marginTop: 4 }}>
                <span>0</span><span>10px</span><span>20</span>
              </div>
            </Card>
            <Card padding={18}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: 12 }}>Tema</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Switch checked={true} label="Modo escuro padrão"/>
                <Switch checked={true} label="Permitir alternar (toggle)"/>
                <Switch checked={false} label="Glassmorphism intenso"/>
              </div>
            </Card>
          </div>
          {/* Preview */}
          <Card padding={0} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-subtle)', fontFamily: 'var(--font-mono, monospace)' }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--error)' }}/>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--warning)' }}/>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--success)' }}/>
              <span style={{ marginLeft: 12 }}>incrivel.tech/blog · preview ao vivo</span>
            </div>
            <div style={{ padding: 24 }}>
              <Badge tone="brand" soft icon="sparkle">Edição #128</Badge>
              <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text)', lineHeight: 1.1, marginTop: 12 }}>
                Tecnologia, legalidade e crescimento em <span style={{ color }}>sorteios digitais</span>.
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.55 }}>Conteúdo prático para empreendedores e times técnicos.</div>
              <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                <button style={{ height: 38, padding: '0 18px', borderRadius: 'var(--radius-md)', background: color, color: '#02161A', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Assinar agora</button>
                <Button variant="secondary">Ver últimos posts</Button>
              </div>
              <div style={{ height: 1, background: 'var(--border)', margin: '24px 0' }}/>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <PostCardGrid post={POSTS[1]}/>
                <PostCardGrid post={POSTS[2]}/>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ColorPalette, TypeScale, SpacingShadows,
  ButtonsShowcase, FormsShowcase, BadgesTagsShowcase, PostCardsShowcase,
  NavShowcase, ModalShowcase,
  BlogHome, BlogPost, BlogCategory,
  AdminDashboard, AdminPostsList, AdminEditor, AdminTheming,
});
