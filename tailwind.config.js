/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0a0a0b',
          900: '#0a0a0b',
          800: '#101013',
          700: '#16161b',
          600: '#1d1d24',
        },
        bone: {
          DEFAULT: '#ece6da',
          dim: '#a8a294',
          faint: '#6b665c',
        },
        blood: '#c1121f',
        ember: '#e23b2e',
        gold: '#c8a45c',
      },
      fontFamily: {
        display: ['"Bodoni Moda"', 'serif'],
        gothic: ['"Pirata One"', 'cursive'],
        mono: ['"Space Mono"', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        ultra: '0.42em',
        mega: '0.6em',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '42%': { opacity: '1' },
          '43%': { opacity: '0.5' },
          '45%': { opacity: '1' },
          '78%': { opacity: '0.85' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.8' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.9s cubic-bezier(0.16,1,0.3,1) both',
        marquee: 'marquee 28s linear infinite',
        flicker: 'flicker 6s linear infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
