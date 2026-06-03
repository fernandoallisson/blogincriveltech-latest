# Design System Blog Admin

_Started 2026-04-29 12:35 UTC_

---

## User



## Assistant

I'll create a complete Design System for the "Blog Incrível Tech" — an original design inspired by modern tech aesthetics (dark mode, cyan/neon accents, glassmorphism), without copying any specific copyrighted UI from the actual incrivel.tech site. The design will be original and tailored for a tech blog with admin panel.

Let me ask a few quick questions before diving in to make sure I build the right thing.

_[tool: questions_v2]_

## User

Questions answered:
- scope: Tokens (cores, tipografia, espaçamento, sombras), Componentes base (botões, inputs, badges, cards, tags), Layouts do Blog (home, post, categoria, busca), Painel Administrativo (dashboard, lista de posts, editor), Sistema de personalização visual pelo admin (theming)
- modes: Sim — claro e escuro, ambos completos
- format: Design canvas com todos os componentes lado a lado (estilo Figma)
- mood: 2
- accent: Ciano neon (#5CE1E6) — sugerido no brief
- components_priority: Botões (primário, secundário, ghost, ícone), Cards de post (lista, destaque, featured), Inputs e formulários (search, textarea, select), Badges e tags (categorias, status), Navegação (header, sidebar, breadcrumb), Editor de post (rich text, upload de mídia), Tabelas (admin de posts), Modais e toasts
- admin_depth: Visão completa: dashboard, lista, editor, configurações, theming
- tweaks: Sim — cores, tipografia, raio de borda, intensidade do glass
- typography: Sans moderna (Geist, Manrope, Plus Jakarta) + mono para código
- variations: 1 versão final bem polida
- content_lang: Português (BR)

## Assistant

I'll build the complete Design System on a design canvas with all the requested sections. Let me set up the project.

_[tool: update_todos]_

_[tool: copy_starter_component]_

_[tool: copy_starter_component]_

_[tool: read_file]_

_[tool: read_file]_

I have what I need. Let me check the artboard API briefly and then build everything.

_[tool: grep]_

Now I'll build the design system. I'll split it into logical files to keep them small.

**System decisions** (out loud):
- **Direction**: Dark-mode first (with full light mode), gradient-tinted backgrounds, glassmorphism cards, cyan neon accent (#5CE1E6) — Option 2 from the mood selector.
- **Type**: Plus Jakarta Sans (display/UI) + JetBrains Mono (code).
- **Radii**: medium (10–14px) base.
- **Spacing**: 4px base, scale 4/8/12/16/20/24/32/40/48/64.
- **Layout system**: 12-col grid for blog, 8px micro-grid for components.

Starting with the main HTML and tokens file.

_[tool: write_file]_

Now the primitive components (buttons, inputs, badges, etc.):

_[tool: write_file]_

_[tool: snip]_

Now the artboards file (sample post cards, blog layouts, admin views):

_[tool: write_file]_

_[tool: snip]_

Now the main HTML file that wires everything up:

_[tool: write_file]_

_[tool: snip]_

_[tool: done]_

_[tool: fork_verifier_agent]_

_[tool: snip]_

Pronto! Entreguei o Design System completo do **Blog Incrível Tech** em um único design canvas com 5 seções:

**01 · Tokens** — paleta de cores (rampa ciano completa + semânticas), tipografia (Plus Jakarta Sans + JetBrains Mono), espaçamento, raios e sombras.

**02 · Componentes base** — botões (primary com glow, secondary glass, ghost, danger, outline), icon buttons, inputs/textareas/selects com glassmorphism, badges, tags filtráveis, cards de post (Featured / Grid / List), header sticky, breadcrumb, sidebar admin, modais e toasts.

**03 · Layouts do blog** — Home (hero + featured + grid), Post individual (artigo editorial com code block e quote) e Categoria com busca/filtros + sidebar.

**04 · Painel administrativo** — Dashboard com stats e gráfico, Lista de posts (tabela com status, autor, views), Editor full-screen com bloco contentEditable + painel de SEO/opções, e a tela de Aparência (theming) com preview ao vivo.

**Tweaks** (canto inferior direito) — alterne modo claro/escuro, cor de destaque, família tipográfica, escala de raio e intensidade do glassmorphism em tempo real.

Tudo é original (sem reproduzir UI proprietária), 100% pt-BR, e os arquivos estão modulados (`tokens.jsx`, `primitives.jsx`, `artboards.jsx`) prontos para virar React + TS + Tailwind.

## User

Save this design as a PDF: the current design

