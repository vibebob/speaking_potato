import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 감자 테마 색상 팔레트
        potato: {
          primary: '#D4A574',
          secondary: '#B8860B', 
          accent: '#8B4513'
        },
        bg: {
          'gradient-start': '#FFF8DC',
          'gradient-end': '#F5DEB3'
        },
        text: {
          primary: '#5D4037',
          secondary: '#A0522D'
        }
      },
      backgroundImage: {
        'potato-gradient': 'linear-gradient(135deg, #FFF8DC 0%, #F5DEB3 100%)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'pulse-slow': 'pulse 2s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        }
      },
      fontFamily: {
        'korean': ['Noto Sans KR', 'sans-serif'],
      },
      maxWidth: {
        'potato': '320px', // 데스크톱에서도 컴팩트하게
        'potato-mobile': '100%',
      }
    },
  },
  plugins: [],
} satisfies Config;