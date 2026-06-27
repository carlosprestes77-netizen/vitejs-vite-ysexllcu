/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0c0b0a',
          900: '#0c0b0a',
          800: '#13110f',
          700: '#1b1815',
          600: '#26221c',
        },
        bone: {
          DEFAULT: '#efe9dd',
          dim: '#b8b0a1',
          faint: '#736b5d',
        },
        blood: '#7c2b2b',
        ember: '#9c7b4f',
        gold: '#b08d57',
        marble: '#efe9dd',
      },
      fontFamily: {
        display: ['"Bodoni Moda"', 'serif'],
        gothic: ['"Bodoni Moda"', 'serif'],
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
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.9s cubic-bezier(0.16,1,0.3,1) both',
        marquee: 'marquee 28s linear infinite',
        flicker: 'flicker 6s linear infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
        'spin-slow': 'spin 90s linear infinite',
        'spin-rev': 'spin 140s linear infinite reverse',
        'float-slow': 'float 14s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
