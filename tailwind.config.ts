import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Space Mono"', 'monospace'],
        sans: ['"IBM Plex Sans KR"', 'sans-serif'],
      },
      colors: {
        accent: '#f59e0b',
        'accent-dim': '#78350f',
        'term-green': '#22c55e',
        'term-green-dim': '#14532d',
        'term-blue': '#3b82f6',
        'term-red': '#ef4444',
        'term-bg': '#0a0c10',
        'term-surface': '#111318',
        'term-border': '#2a2d36',
      },
      boxShadow: {
        'neon-amber': '0 0 10px rgba(245, 158, 11, 0.4), 0 0 20px rgba(245, 158, 11, 0.2)',
        'neon-green': '0 0 10px rgba(34, 197, 94, 0.4), 0 0 20px rgba(34, 197, 94, 0.2)',
        'crt': 'inset 0 0 100px rgba(0,0,0,0.9)',
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'glitch': 'glitch 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite',
        'crt-flicker': 'crt-flicker 0.15s infinite',
        'typing': 'typing 2s steps(40, end)',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.3)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        'crt-flicker': {
          '0%': { opacity: '0.95' },
          '100%': { opacity: '1' },
        },
        typing: {
          from: { width: '0' },
          to: { width: '100%' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
