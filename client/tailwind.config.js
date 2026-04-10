/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        yatra: {
          primary: '#FF6B00',
          secondary: '#006B6B',
          accent: '#FFB347',
          bg: '#FFF8F0',
          dark: '#1A1A2E',
          success: '#2ECC71',
          danger: '#E74C3C',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        yatra: '0 8px 30px rgba(255, 107, 0, 0.12)',
        'yatra-hover': '0 12px 40px rgba(255, 107, 0, 0.22)',
      },
    },
  },
  plugins: [],
};
