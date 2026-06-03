// primitives.jsx — base UI primitives for Blog Incrível Tech DS
// All consume CSS vars set by the theme/tokens layer.

// ─── Helpers ──────────────────────────────────────────────────
const cx = (...a) => a.filter(Boolean).join(' ');

// ─── Icon (lightweight inline lucide-ish set) ─────────────────
function Icon({ name, size = 16, stroke = 1.6, color = 'currentColor', style }) {
  const paths = {
    search:    <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
    arrow:     <><path d="M5 12h14"/><path d="m13 5 7 7-7 7"/></>,
    chevdown:  <path d="m6 9 6 6 6-6"/>,
    chevright: <path d="m9 6 6 6-6 6"/>,
    chevleft:  <path d="m15 6-6 6 6 6"/>,
    plus:      <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    check:     <path d="m5 12 5 5L20 7"/>,
    x:         <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
    bolt:      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/>,
    shield:    <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></>,
    sparkle:   <><path d="M12 3v4"/><path d="M12 17v4"/><path d="M3 12h4"/><path d="M17 12h4"/><path d="m5.5 5.5 2.8 2.8"/><path d="m15.7 15.7 2.8 2.8"/><path d="m18.5 5.5-2.8 2.8"/><path d="m8.3 15.7-2.8 2.8"/></>,
    eye:       <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
    heart:     <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
    bookmark:  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>,
    share:     <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4"/><path d="m15.4 6.5-6.8 4"/></>,
    user:      <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    bell:      <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    settings:  <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></>,
    edit:      <><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></>,
    trash:     <><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="m19 6-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></>,
    image:     <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></>,
    home:      <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/></>,
    file:      <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></>,
    chart:     <><path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 5-5"/></>,
    tag:       <><path d="m20.6 13.4-7.2 7.2a2 2 0 0 1-2.8 0l-8.6-8.6V3h9l8.6 8.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1.2"/></>,
    folder:    <path d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>,
    moon:      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>,
    sun:       <><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M5 12H3M21 12h-2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></>,
    menu:      <><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></>,
    bold:      <><path d="M6 4h7a4 4 0 0 1 0 8H6z"/><path d="M6 12h8a4 4 0 0 1 0 8H6z"/></>,
    italic:    <><path d="M19 4h-9"/><path d="M14 20H5"/><path d="m15 4-6 16"/></>,
    code:      <><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/></>,
    link:      <><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></>,
    quote:     <><path d="M3 21V12a4 4 0 0 1 4-4"/><path d="M14 21V12a4 4 0 0 1 4-4"/></>,
    list:      <><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/></>,
    upload:    <><path d="M12 3v12"/><path d="m7 8 5-5 5 5"/><path d="M5 21h14"/></>,
    play:      <path d="m6 4 14 8-14 8z"/>,
    lock:      <><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/></>,
    rocket:    <><path d="M5 13c-1 5 4 6 4 6s1 5 6 4l4-4-2-9-9-2-3 5z"/><circle cx="14" cy="9" r="1.5"/></>,
    inbox:     <><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5 7h14l3 5v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7z"/></>,
    grid:      <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    aws:       <><path d="M3 17c4 3 14 3 18 0"/><path d="M3 14c4 2 14 2 18 0"/><circle cx="6" cy="9" r="2"/><circle cx="12" cy="9" r="2"/><circle cx="18" cy="9" r="2"/></>,
    flame:     <path d="M12 2s5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 1-3s-1-1-1-3 5-4 5-4z"/>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
         style={{ flexShrink: 0, ...style }}>{paths[name] || null}</svg>
  );
}

// ─── Logo ─────────────────────────────────────────────────────
function Logo({ size = 28, color = 'var(--brand)', mark = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <rect x="1" y="1" width="30" height="30" rx="8" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4"/>
        <path d="M9 22V10l7 8 7-8v12" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="16" cy="16" r="1.6" fill={color}/>
      </svg>
      {!mark && (
        <span style={{ fontWeight: 700, letterSpacing: '-0.01em', fontSize: 15, color: 'var(--text)' }}>
          Incrível<span style={{ color: 'var(--brand)' }}>.</span>tech<span style={{ opacity: 0.5, marginLeft: 6, fontWeight: 500 }}>blog</span>
        </span>
      )}
    </div>
  );
}

// ─── Button ───────────────────────────────────────────────────
function Button({ children, variant = 'primary', size = 'md', icon, iconRight, full, style, onClick, disabled }) {
  const sizes = {
    sm: { h: 30, px: 12, fs: 13, gap: 6 },
    md: { h: 38, px: 16, fs: 14, gap: 8 },
    lg: { h: 46, px: 22, fs: 15, gap: 10 },
  };
  const s = sizes[size];
  const variants = {
    primary: {
      background: 'linear-gradient(180deg, var(--brand) 0%, color-mix(in oklab, var(--brand) 80%, var(--brand-2)) 100%)',
      color: '#02161A',
      border: '1px solid color-mix(in oklab, var(--brand) 60%, white 40%)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), var(--shadow-glow-soft)',
      fontWeight: 600,
    },
    secondary: {
      background: 'var(--glass)',
      color: 'var(--text)',
      border: '1px solid var(--border-strong)',
      backdropFilter: 'blur(12px)',
      fontWeight: 500,
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text)',
      border: '1px solid transparent',
      fontWeight: 500,
    },
    danger: {
      background: 'color-mix(in oklab, var(--error) 18%, transparent)',
      color: 'var(--error)',
      border: '1px solid color-mix(in oklab, var(--error) 35%, transparent)',
      fontWeight: 500,
    },
    outline: {
      background: 'transparent',
      color: 'var(--brand)',
      border: '1px solid var(--brand)',
      fontWeight: 500,
    },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        height: s.h, padding: `0 ${s.px}px`, fontSize: s.fs, gap: s.gap,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 'var(--radius-md)', cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit', letterSpacing: '-0.005em',
        width: full ? '100%' : 'auto',
        transition: 'transform 120ms, filter 120ms, box-shadow 120ms',
        opacity: disabled ? 0.5 : 1,
        ...variants[variant], ...style,
      }}
      onMouseDown={e => e.currentTarget.style.transform = 'translateY(1px)'}
      onMouseUp={e => e.currentTarget.style.transform = ''}
      onMouseLeave={e => e.currentTarget.style.transform = ''}
    >
      {icon && <Icon name={icon} size={s.fs + 2}/>}
      {children}
      {iconRight && <Icon name={iconRight} size={s.fs + 2}/>}
    </button>
  );
}

// ─── IconButton ───────────────────────────────────────────────
function IconButton({ name, size = 'md', variant = 'ghost', onClick, badge }) {
  const sz = size === 'sm' ? 30 : size === 'lg' ? 44 : 36;
  const vstyles = {
    ghost: { background: 'transparent', color: 'var(--text-muted)', border: '1px solid transparent' },
    secondary: { background: 'var(--glass)', color: 'var(--text)', border: '1px solid var(--border-strong)', backdropFilter: 'blur(8px)' },
    primary: { background: 'var(--brand)', color: '#02161A', border: 'none' },
  };
  return (
    <button onClick={onClick} style={{
      width: sz, height: sz, borderRadius: 'var(--radius-md)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', position: 'relative', transition: 'background 120ms',
      ...vstyles[variant],
    }}>
      <Icon name={name} size={sz === 30 ? 14 : sz === 44 ? 20 : 16}/>
      {badge != null && (
        <span style={{
          position: 'absolute', top: 4, right: 4, minWidth: 16, height: 16, padding: '0 4px',
          borderRadius: 999, background: 'var(--brand)', color: '#02161A',
          fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>{badge}</span>
      )}
    </button>
  );
}

// ─── Badge ────────────────────────────────────────────────────
function Badge({ children, tone = 'neutral', soft, dot, icon, size = 'md' }) {
  const tones = {
    neutral: { fg: 'var(--text-muted)', bg: 'var(--glass)', bd: 'var(--border-strong)' },
    brand:   { fg: 'var(--brand)', bg: 'var(--brand-soft)', bd: 'color-mix(in oklab, var(--brand) 35%, transparent)' },
    success: { fg: 'var(--success)', bg: 'color-mix(in oklab, var(--success) 14%, transparent)', bd: 'color-mix(in oklab, var(--success) 30%, transparent)' },
    warning: { fg: 'var(--warning)', bg: 'color-mix(in oklab, var(--warning) 14%, transparent)', bd: 'color-mix(in oklab, var(--warning) 30%, transparent)' },
    error:   { fg: 'var(--error)', bg: 'color-mix(in oklab, var(--error) 14%, transparent)', bd: 'color-mix(in oklab, var(--error) 30%, transparent)' },
    info:    { fg: 'var(--info)', bg: 'color-mix(in oklab, var(--info) 14%, transparent)', bd: 'color-mix(in oklab, var(--info) 30%, transparent)' },
  };
  const t = tones[tone];
  const h = size === 'sm' ? 20 : size === 'lg' ? 28 : 24;
  const fs = size === 'sm' ? 11 : size === 'lg' ? 13 : 12;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, height: h, padding: `0 ${size==='sm'?8:10}px`,
      borderRadius: 999, fontSize: fs, fontWeight: 600, letterSpacing: '0.005em',
      color: t.fg, background: soft ? t.bg : 'transparent',
      border: `1px solid ${t.bd}`,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 999, background: t.fg }}/>}
      {icon && <Icon name={icon} size={fs}/>}
      {children}
    </span>
  );
}

// ─── Tag (clickable, pill) ────────────────────────────────────
function Tag({ children, active, onClick, icon }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 12px',
      borderRadius: 999, fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
      cursor: 'pointer', transition: 'all 160ms',
      color: active ? '#02161A' : 'var(--text-muted)',
      background: active ? 'var(--brand)' : 'var(--glass)',
      border: `1px solid ${active ? 'var(--brand)' : 'var(--border)'}`,
    }}>
      {icon && <Icon name={icon} size={13}/>}
      {children}
    </button>
  );
}

// ─── Input ────────────────────────────────────────────────────
function Input({ icon, iconRight, placeholder, value, onChange, type = 'text', size = 'md', error, hint, label, full = true }) {
  const h = size === 'sm' ? 32 : size === 'lg' ? 44 : 38;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: full ? '100%' : 'auto' }}>
      {label && <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>{label}</label>}
      <div style={{
        display: 'flex', alignItems: 'center', height: h, gap: 8,
        padding: `0 ${icon ? 10 : 12}px`,
        background: 'var(--glass)', backdropFilter: 'blur(8px)',
        border: `1px solid ${error ? 'var(--error)' : 'var(--border-strong)'}`,
        borderRadius: 'var(--radius-md)',
        transition: 'border-color 160ms, box-shadow 160ms',
      }}
      onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 3px var(--brand-soft)'}
      onBlur={e => e.currentTarget.style.boxShadow = 'none'}
      >
        {icon && <Icon name={icon} size={15} color="var(--text-subtle)"/>}
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          style={{
            flex: 1, height: '100%', background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--text)', fontSize: size === 'sm' ? 13 : 14, fontFamily: 'inherit',
          }}/>
        {iconRight && <Icon name={iconRight} size={15} color="var(--text-subtle)"/>}
      </div>
      {(error || hint) && <span style={{ fontSize: 12, color: error ? 'var(--error)' : 'var(--text-subtle)' }}>{error || hint}</span>}
    </div>
  );
}

// ─── Textarea ─────────────────────────────────────────────────
function Textarea({ value, onChange, placeholder, rows = 4, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>{label}</label>}
      <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={{
        background: 'var(--glass)', backdropFilter: 'blur(8px)',
        border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)',
        padding: '12px 14px', color: 'var(--text)', fontSize: 14, fontFamily: 'inherit',
        outline: 'none', resize: 'vertical', lineHeight: 1.5,
      }}/>
    </div>
  );
}

// ─── Select (styled) ──────────────────────────────────────────
function Select({ value, onChange, options, label, size = 'md' }) {
  const h = size === 'sm' ? 32 : size === 'lg' ? 44 : 38;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>{label}</label>}
      <div style={{
        display: 'flex', alignItems: 'center', height: h, gap: 8, padding: '0 12px',
        background: 'var(--glass)', backdropFilter: 'blur(8px)',
        border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)',
        position: 'relative', cursor: 'pointer',
      }}>
        <select value={value} onChange={onChange}
          style={{
            flex: 1, height: '100%', background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--text)', fontSize: 14, fontFamily: 'inherit', appearance: 'none', cursor: 'pointer',
          }}>
          {options.map(o => <option key={o.value || o} value={o.value || o} style={{ background: 'var(--surface)', color: 'var(--text)' }}>{o.label || o}</option>)}
        </select>
        <Icon name="chevdown" size={14} color="var(--text-subtle)"/>
      </div>
    </div>
  );
}

// ─── Card (glass) ─────────────────────────────────────────────
function Card({ children, padding = 20, glow, style, onClick, hover }) {
  return (
    <div onClick={onClick} style={{
      background: 'var(--glass)',
      border: '1px solid var(--glass-border)',
      borderRadius: 'var(--radius-lg)',
      backdropFilter: 'blur(20px) saturate(140%)',
      WebkitBackdropFilter: 'blur(20px) saturate(140%)',
      padding,
      boxShadow: glow ? 'var(--shadow-glow-soft), var(--shadow-md)' : 'var(--shadow-md)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 200ms, box-shadow 200ms, border-color 200ms',
      ...style,
    }}
    onMouseEnter={hover ? e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg), var(--shadow-glow-soft)'; e.currentTarget.style.borderColor = 'color-mix(in oklab, var(--brand) 40%, var(--glass-border))'; } : undefined}
    onMouseLeave={hover ? e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = glow ? 'var(--shadow-glow-soft), var(--shadow-md)' : 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; } : undefined}
    >{children}</div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────
function Avatar({ name, size = 32, color = 'var(--brand)', src }) {
  const initials = (name || '?').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: 999,
      background: src ? `url(${src}) center/cover` : `linear-gradient(135deg, ${color}, color-mix(in oklab, ${color} 50%, var(--brand-2)))`,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      color: '#02161A', fontSize: size * 0.38, fontWeight: 700, letterSpacing: '-0.01em',
      border: '1px solid var(--border)',
      flexShrink: 0,
    }}>{!src && initials}</div>
  );
}

// ─── Toggle / Switch ──────────────────────────────────────────
function Switch({ checked, onChange, label }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <span style={{
        width: 36, height: 20, borderRadius: 999,
        background: checked ? 'var(--brand)' : 'var(--surface-2)',
        border: '1px solid var(--border-strong)',
        position: 'relative', transition: 'background 160ms',
      }}>
        <span style={{
          position: 'absolute', top: 1, left: checked ? 17 : 1, width: 16, height: 16,
          background: '#fff', borderRadius: 999,
          transition: 'left 160ms', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }}/>
      </span>
      {label && <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</span>}
    </label>
  );
}

// ─── Image Placeholder ────────────────────────────────────────
function ImgPlaceholder({ w = '100%', h = 200, label = 'image', radius = 'var(--radius-md)', tone = 'brand' }) {
  const grad = tone === 'brand'
    ? 'linear-gradient(135deg, color-mix(in oklab, var(--brand) 22%, var(--surface)) 0%, color-mix(in oklab, var(--brand-2) 18%, var(--surface)) 100%)'
    : 'linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)';
  return (
    <div style={{
      width: w, height: h, borderRadius: radius,
      background: `${grad}, repeating-linear-gradient(135deg, transparent 0 8px, rgba(255,255,255,0.03) 8px 9px)`,
      backgroundBlendMode: 'normal',
      border: '1px solid var(--glass-border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      <span style={{
        fontFamily: 'var(--font-mono, ui-monospace)', fontSize: 11, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'var(--text-subtle)', opacity: 0.7,
      }}>◇ {label}</span>
    </div>
  );
}

// ─── Section header (for the canvas) ──────────────────────────
function SectionLabel({ kicker, title, desc }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {kicker && <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand)', marginBottom: 6 }}>{kicker}</div>}
      <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)' }}>{title}</div>
      {desc && <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6, maxWidth: 600, lineHeight: 1.5 }}>{desc}</div>}
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────
function Toast({ tone = 'brand', title, desc, icon }) {
  const tones = {
    brand:   { c: 'var(--brand)' },
    success: { c: 'var(--success)' },
    warning: { c: 'var(--warning)' },
    error:   { c: 'var(--error)' },
  };
  return (
    <div style={{
      display: 'flex', gap: 12, alignItems: 'flex-start',
      padding: 14, borderRadius: 'var(--radius-md)',
      background: 'var(--surface)', backdropFilter: 'blur(20px)',
      border: '1px solid var(--border-strong)',
      boxShadow: 'var(--shadow-lg)',
      borderLeft: `3px solid ${tones[tone].c}`,
      width: 320,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        background: `color-mix(in oklab, ${tones[tone].c} 18%, transparent)`,
        color: tones[tone].c, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}><Icon name={icon || 'bolt'} size={15}/></div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{title}</div>
        {desc && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>}
      </div>
      <button style={{ background: 'transparent', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', padding: 4 }}>
        <Icon name="x" size={14}/>
      </button>
    </div>
  );
}

Object.assign(window, {
  cx, Icon, Logo, Button, IconButton, Badge, Tag, Input, Textarea, Select,
  Card, Avatar, Switch, ImgPlaceholder, SectionLabel, Toast,
});
