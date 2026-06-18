import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          DEFAULT: '#F6917C',
          50:  '#FEF4F2',
          100: '#FDE8E4',
          200: '#FAD1CA',
          300: '#F7B0A4',
          400: '#F6917C',
          500: '#EF6A51',
          600: '#DC4D31',
          700: '#B83C23',
          800: '#983221',
          900: '#7E2F22',
        },
        teal: {
          DEFAULT: '#4D9190',
          50:  '#F0F8F8',
          100: '#DCEEEE',
          200: '#BCDEDE',
          300: '#8FC7C6',
          400: '#4D9190',
          500: '#3D7776',
          600: '#326261',
          700: '#2B5151',
          800: '#264444',
          900: '#233A3A',
        },
        charcoal: {
          DEFAULT: '#1F2937',
          light: '#374151',
          dark:  '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #F6917C, #4D9190)',
        'gradient-brand-radial': 'radial-gradient(circle at top left, #F6917C, #4D9190 70%)',
        'gradient-mesh': `
          radial-gradient(at 0% 0%, rgba(246,145,124,0.35) 0px, transparent 50%),
          radial-gradient(at 100% 0%, rgba(77,145,144,0.35) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(246,145,124,0.25) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(77,145,144,0.25) 0px, transparent 50%)
        `,
      },
      boxShadow: {
        'glow-coral': '0 0 40px -8px rgba(246,145,124,0.55)',
        'glow-teal': '0 0 40px -8px rgba(77,145,144,0.55)',
        'glow-soft': '0 8px 40px -12px rgba(31,41,55,0.25)',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        'gradient-pan': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        float: 'float 6s ease-in-out infinite',
        'gradient-pan': 'gradient-pan 8s ease infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
      backgroundSize: {
        '200%': '200% 200%',
      },
    },
  },
  plugins: [],
};

export default config;
