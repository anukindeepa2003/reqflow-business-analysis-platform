import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#172033',
        canvas: '#f5f7fb',
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8'
        }
      },
      boxShadow: {
        panel: '0 1px 2px rgba(15, 23, 42, 0.05), 0 8px 24px rgba(15, 23, 42, 0.04)'
      }
    }
  },
  plugins: []
} satisfies Config;
