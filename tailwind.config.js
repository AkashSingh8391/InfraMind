/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Core civic-infrastructure palette
        pulse: {
          50: '#eef5f6',
          100: '#d3e6e9',
          200: '#a7cdd3',
          300: '#79b1ba',
          400: '#4c939f',
          500: '#2c7480',
          600: '#1B4B5A', // primary - deep municipal teal
          700: '#153a46',
          800: '#0f2933',
          900: '#0a1c22',
        },
        signal: {
          50: '#fdf1ea',
          100: '#fbdcc7',
          300: '#f2a374',
          500: '#E8622C', // accent - hazard/alert orange
          600: '#cc4f1e',
          700: '#a63e17',
        },
        ok: {
          500: '#2D7D46',
          600: '#236337',
        },
        warn: {
          500: '#D9A62E',
          600: '#b8871c',
        },
        danger: {
          500: '#C23B3B',
          600: '#a12f2f',
        },
        ink: {
          50: '#f5f6f4',
          100: '#e8eae6',
          200: '#d3d7d2',
          400: '#5b6461',
          700: '#2a302e',
          800: '#1c2220',
          900: '#101820',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,32,0.06), 0 1px 3px rgba(16,24,32,0.08)',
        raised: '0 4px 16px rgba(16,24,32,0.12)',
      },
      animation: {
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.4, transform: 'scale(1.4)' },
        },
      },
    },
  },
  plugins: [],
};
