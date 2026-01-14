/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // Layered elevation system - premium depth
        'elevation-1': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
        'elevation-2': '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.04)',
        'elevation-3': '0 10px 15px -3px rgba(0,0,0,0.06), 0 4px 6px -2px rgba(0,0,0,0.04)',
        'elevation-4': '0 20px 25px -5px rgba(0,0,0,0.08), 0 10px 10px -5px rgba(0,0,0,0.03)',
        // Colored glows for brand elements
        'green-glow': '0 4px 14px -3px rgba(0, 156, 110, 0.4)',
        'green-glow-lg': '0 10px 40px -10px rgba(0, 156, 110, 0.5)',
        'pink-glow': '0 4px 14px -3px rgba(225, 0, 116, 0.4)',
        'pink-glow-lg': '0 10px 40px -10px rgba(225, 0, 116, 0.5)',
        'blue-glow': '0 4px 14px -3px rgba(0, 60, 197, 0.4)',
        'blue-glow-lg': '0 10px 40px -10px rgba(0, 60, 197, 0.5)',
        // Soft premium shadows
        'soft': '0 2px 15px rgba(0,0,0,0.05), 0 5px 30px rgba(0,0,0,0.05)',
        'soft-lg': '0 5px 30px rgba(0,0,0,0.08), 0 10px 50px rgba(0,0,0,0.05)',
        'soft-xl': '0 10px 40px rgba(0,0,0,0.1), 0 20px 60px rgba(0,0,0,0.08)',
        // Card-specific shadows
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.06)',
        // Inner shadows for depth
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.03)',
      },
      colors: {
        brand: {
          green: {
            50: '#f0fdf7',
            100: '#dcfce8',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#009c6e',
            600: '#008a5f',
            700: '#007550',
            800: '#005f41',
            900: '#064e3b',
          },
          pink: {
            50: '#fdf2f8',
            100: '#fce7f3',
            200: '#fbcfe8',
            300: '#f9a8d4',
            400: '#f472b6',
            500: '#e10074',
            600: '#c80068',
            700: '#a8005a',
            800: '#88004a',
            900: '#6b003b',
          },
          blue: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#003cc5',
            600: '#0035b0',
            700: '#002d9a',
            800: '#002585',
            900: '#001d6f',
          },
        },
        surface: {
          primary: '#ffffff',
          secondary: '#f9fafb',
          tertiary: '#eaf4f9',
          inverse: '#1f2937',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.3s ease-out forwards',
        'slide-out-right': 'slideOutRight 0.3s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pulseSoft: {
          '0%, 100%': {
            boxShadow: '0 4px 12px rgba(0, 156, 110, 0.4)'
          },
          '50%': {
            boxShadow: '0 4px 12px rgba(0, 156, 110, 0.4), 0 0 0 10px rgba(0, 156, 110, 0.1)'
          },
        },
      },
    },
  },
  plugins: [],
};
