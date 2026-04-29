/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFD200', // 乐高黄
          light: '#FFE566',
          dark: '#E6BD00'
        },
        secondary: {
          DEFAULT: '#00B4D8', // 天空蓝
          light: '#33C9FF',
          dark: '#0099BB'
        },
        background: '#F8F9FA', // 浅灰背景
        card: '#FFFFFF', // 卡片白
        text: {
          primary: '#212529', // 深灰
          secondary: '#495057' // 中灰
        }
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Microsoft YaHei"', 'sans-serif']
      },
      borderRadius: {
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px'
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'button': '0 4px 8px rgba(0, 0, 0, 0.1)',
        'button-hover': '0 6px 12px rgba(0, 0, 0, 0.15)'
      }
    },
  },
  plugins: [],
}