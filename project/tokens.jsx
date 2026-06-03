// tokens.jsx — Design tokens for Blog Incrível Tech
// Exports a `tokens` object + helpers for both dark and light themes.

const tokens = {
  // ── COLORS ─────────────────────────────────────────────────
  color: {
    // Brand — cyan neon ladder
    brand: {
      50:  '#EAFEFF',
      100: '#CFFAFE',
      200: '#A7F8FF',
      300: '#67EEF7',
      400: '#5CE1E6', // primary
      500: '#22C7CF',
      600: '#0EA5AD',
      700: '#0B7F86',
      800: '#0C5F66',
      900: '#0A4347',
    },
    // Accent — electric blue
    blue: {
      400: '#38BDF8',
      500: '#00A7F9',
      600: '#0284C7',
      700: '#0369A1',
    },
    // Semantic
    success: '#22C55E',
    warning: '#FACC15',
    error:   '#EF4444',
    info:    '#38BDF8',
  },

  // ── TYPOGRAPHY ─────────────────────────────────────────────
  font: {
    sans: '"Plus Jakarta Sans", "Manrope", ui-sans-serif, system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
  },
  type: {
    // Display + headings
    display: { size: 56, line: 1.05, weight: 700, track: '-0.025em' },
    h1:      { size: 40, line: 1.1,  weight: 700, track: '-0.02em' },
    h2:      { size: 30, line: 1.15, weight: 700, track: '-0.015em' },
    h3:      { size: 22, line: 1.25, weight: 600, track: '-0.01em' },
    h4:      { size: 18, line: 1.3,  weight: 600, track: '-0.005em' },
    // Body
    bodyLg:  { size: 18, line: 1.6,  weight: 400, track: '0' },
    body:    { size: 15, line: 1.6,  weight: 400, track: '0' },
    bodySm:  { size: 13, line: 1.5,  weight: 400, track: '0' },
    // Labels
    label:   { size: 13, line: 1.3,  weight: 500, track: '0.005em' },
    caption: { size: 12, line: 1.35, weight: 500, track: '0.01em' },
    micro:   { size: 11, line: 1.25, weight: 600, track: '0.08em', upper: true },
    // Code
    code:    { size: 13, line: 1.55, weight: 400, track: '0' },
  },

  // ── SPACING ────────────────────────────────────────────────
  space: { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 32, 8: 40, 9: 48, 10: 64, 11: 80, 12: 96 },

  // ── RADII ──────────────────────────────────────────────────
  radius: { none: 0, xs: 4, sm: 6, md: 10, lg: 14, xl: 20, '2xl': 28, full: 9999 },

  // ── SHADOWS ────────────────────────────────────────────────
  shadow: {
    sm:    '0 1px 2px rgba(2,8,20,0.32)',
    md:    '0 6px 20px -8px rgba(2,8,20,0.55), 0 2px 4px rgba(2,8,20,0.24)',
    lg:    '0 18px 48px -16px rgba(2,8,20,0.65), 0 4px 12px rgba(2,8,20,0.28)',
    xl:    '0 32px 64px -20px rgba(2,8,20,0.75), 0 8px 24px rgba(2,8,20,0.35)',
    glow:  '0 0 0 1px rgba(92,225,230,0.45), 0 0 24px rgba(92,225,230,0.35)',
    glowSoft: '0 0 32px rgba(92,225,230,0.18)',
  },

  // ── MOTION ─────────────────────────────────────────────────
  motion: {
    fast:   '120ms cubic-bezier(.2,.7,.3,1)',
    base:   '200ms cubic-bezier(.2,.7,.3,1)',
    slow:   '320ms cubic-bezier(.2,.7,.3,1)',
  },

  // ── Z-INDEX ────────────────────────────────────────────────
  z: { base: 1, raised: 10, sticky: 100, drawer: 200, modal: 300, toast: 400, tooltip: 500 },
};

// Theme palettes — surface + text. Brand is constant.
const themes = {
  dark: {
    bg:        '#050A12',
    bgSoft:    '#0A1220',
    surface:   '#0F1A2C',
    surface2:  '#152238',
    glass:     'rgba(255,255,255,0.05)',
    glassBorder: 'rgba(255,255,255,0.10)',
    border:    'rgba(255,255,255,0.10)',
    borderStrong: 'rgba(255,255,255,0.18)',
    text:      '#F6F9FC',
    textMuted: '#B8C5D6',
    textSubtle:'#7C8AA0',
    inverse:   '#050A12',
    overlay:   'rgba(2,6,18,0.65)',
    bgGradient: 'radial-gradient(1200px 600px at 100% -10%, rgba(92,225,230,0.10), transparent 60%), radial-gradient(900px 500px at -10% 30%, rgba(0,167,249,0.08), transparent 65%), linear-gradient(180deg,#050A12 0%, #07101F 100%)',
  },
  light: {
    bg:        '#F7FAFC',
    bgSoft:    '#FFFFFF',
    surface:   '#FFFFFF',
    surface2:  '#F1F5F9',
    glass:     'rgba(255,255,255,0.7)',
    glassBorder: 'rgba(15,23,42,0.08)',
    border:    'rgba(15,23,42,0.10)',
    borderStrong: 'rgba(15,23,42,0.18)',
    text:      '#0B1220',
    textMuted: '#475569',
    textSubtle:'#94A3B8',
    inverse:   '#FFFFFF',
    overlay:   'rgba(15,23,42,0.45)',
    bgGradient: 'radial-gradient(900px 500px at 100% -10%, rgba(34,199,207,0.10), transparent 60%), radial-gradient(800px 400px at -10% 20%, rgba(0,167,249,0.06), transparent 65%), #F7FAFC',
  },
};

// Build a CSS variable string for a theme + brand color override.
function themeVars(mode, accent, radiusScale = 1, glassOpacity = 0.05) {
  const t = themes[mode];
  const accentHex = accent || tokens.color.brand[400];
  return {
    '--bg': t.bg,
    '--bg-soft': t.bgSoft,
    '--bg-gradient': t.bgGradient,
    '--surface': t.surface,
    '--surface-2': t.surface2,
    '--glass': mode === 'dark' ? `rgba(255,255,255,${glassOpacity})` : `rgba(255,255,255,${0.55 + glassOpacity})`,
    '--glass-border': t.glassBorder,
    '--border': t.border,
    '--border-strong': t.borderStrong,
    '--text': t.text,
    '--text-muted': t.textMuted,
    '--text-subtle': t.textSubtle,
    '--inverse': t.inverse,
    '--overlay': t.overlay,
    '--brand': accentHex,
    '--brand-2': tokens.color.blue[500],
    '--brand-soft': mode === 'dark' ? `${accentHex}26` : `${accentHex}1A`,
    '--brand-glow': `${accentHex}55`,
    '--success': tokens.color.success,
    '--warning': tokens.color.warning,
    '--error':   tokens.color.error,
    '--info':    tokens.color.info,
    '--radius-xs': `${4 * radiusScale}px`,
    '--radius-sm': `${6 * radiusScale}px`,
    '--radius-md': `${10 * radiusScale}px`,
    '--radius-lg': `${14 * radiusScale}px`,
    '--radius-xl': `${20 * radiusScale}px`,
    '--shadow-sm': tokens.shadow.sm,
    '--shadow-md': tokens.shadow.md,
    '--shadow-lg': tokens.shadow.lg,
    '--shadow-xl': tokens.shadow.xl,
    '--shadow-glow': `0 0 0 1px ${accentHex}73, 0 0 24px ${accentHex}59`,
    '--shadow-glow-soft': `0 0 32px ${accentHex}2E`,
  };
}

Object.assign(window, { tokens, themes, themeVars });
