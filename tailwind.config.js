/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        'deep-violet': '#3D3560',
        'indigo': '#5B5080',
        'lavender': '#8878A9',
        // Supporting colors
        'lilac': '#D4CEE4',
        'soft-white': '#F9F8FB',
        'light-lavender': '#F0EEF5',
        // Accent
        'terracotta': '#D4956A',
        // Semantic
        'success': '#4A9B7F',
        'error': '#C25A5A',
        'warning': '#B8923A',
      },
      fontFamily: {
        'arabic': ['IBM Plex Sans Arabic', 'sans-serif'],
        'display': ['Lora', 'serif'],
        'ui': ['Quicksand', 'sans-serif'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
      },
      boxShadow: {
        'sm': '0 2px 8px rgba(91, 80, 128, 0.06)',
        'md': '0 4px 16px rgba(91, 80, 128, 0.08)',
        'lg': '0 8px 32px rgba(91, 80, 128, 0.12)',
        'xl': '0 16px 48px rgba(91, 80, 128, 0.16)',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
    },
  },
  plugins: [],
}
