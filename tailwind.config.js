/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        '2xl': '1200px',
      },
    },
    extend: {
      colors: {
        // Semantic tokens resolve to CSS variables (RGB channels) so we get
        // dark/light theming + a configurable accent for free, and Tailwind
        // opacity modifiers (bg-surface/60) keep working.
        background: 'rgb(var(--bg) / <alpha-value>)',
        'background-elevated': 'rgb(var(--bg-elevated) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        'border-strong': 'rgb(var(--border-strong) / <alpha-value>)',
        foreground: 'rgb(var(--text) / <alpha-value>)',
        muted: 'rgb(var(--text-secondary) / <alpha-value>)',
        faint: 'rgb(var(--text-faint) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          hover: 'rgb(var(--accent-hover) / <alpha-value>)',
          soft: 'rgb(var(--accent-soft) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
        },
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display-lg': ['clamp(2.75rem, 6vw, 4.5rem)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        display: ['clamp(2.25rem, 4.5vw, 3.5rem)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        'heading-1': ['clamp(1.9rem, 3vw, 2.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'heading-2': ['clamp(1.5rem, 2.2vw, 1.9rem)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgb(0 0 0 / 0.24), 0 1px 3px rgb(0 0 0 / 0.16)',
        card: '0 4px 24px -8px rgb(0 0 0 / 0.5)',
        'card-hover': '0 12px 40px -12px rgb(0 0 0 / 0.6)',
        glow: '0 0 0 1px rgb(var(--accent) / 0.25), 0 8px 32px -8px rgb(var(--accent) / 0.35)',
      },
      maxWidth: {
        prose: '68ch',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgb(var(--success) / 0.5)' },
          '70%': { boxShadow: '0 0 0 6px rgb(var(--success) / 0)' },
          '100%': { boxShadow: '0 0 0 0 rgb(var(--success) / 0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease forwards',
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        shimmer: 'shimmer 1.5s infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.66, 0, 0, 1) infinite',
      },
    },
  },
  plugins: [],
}
