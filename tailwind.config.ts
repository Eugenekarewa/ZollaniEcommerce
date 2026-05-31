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
      },
    },
  },
  plugins: [],
};

export default config;
