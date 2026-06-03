import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './features/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg-rgb) / <alpha-value>)',
        'bg-soft': 'rgb(var(--bg-soft-rgb) / <alpha-value>)',
        surface: 'rgb(var(--surface-rgb) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2-rgb) / <alpha-value>)',
        glass: 'var(--glass)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        text: 'rgb(var(--text-rgb) / <alpha-value>)',
        muted: 'rgb(var(--text-muted-rgb) / <alpha-value>)',
        subtle: 'rgb(var(--text-subtle-rgb) / <alpha-value>)',
        inverse: 'rgb(var(--inverse-rgb) / <alpha-value>)',
        brand: 'rgb(var(--brand-rgb) / <alpha-value>)',
        'brand-2': 'rgb(var(--brand-2-rgb) / <alpha-value>)',
        success: 'rgb(var(--success-rgb) / <alpha-value>)',
        warning: 'rgb(var(--warning-rgb) / <alpha-value>)',
        error: 'rgb(var(--error-rgb) / <alpha-value>)',
        info: 'rgb(var(--info-rgb) / <alpha-value>)',
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        glow: 'var(--shadow-glow-soft)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      backgroundImage: {
        app: 'var(--bg-gradient)',
      },
    },
  },
  plugins: [],
};

export default config;
