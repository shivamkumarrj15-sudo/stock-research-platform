/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { 50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8f',950:'#172554' },
        surface: { 900:'#0f1117',800:'#161b26',750:'#1a2035',700:'#1e2740',600:'#243050' },
        'accent-green': { DEFAULT:'#22c55e',light:'#4ade80',dark:'#16a34a' },
        'accent-red':   { DEFAULT:'#ef4444',light:'#f87171',dark:'#dc2626' },
        'accent-yellow':{ DEFAULT:'#eab308',light:'#fbbf24',dark:'#ca8a04' },
        'accent-blue':  { DEFAULT:'#3b82f6',light:'#60a5fa',dark:'#2563eb' },
      },
      fontFamily: {
        sans: ['Inter','system-ui','sans-serif'],
        mono: ['JetBrains Mono','monospace'],
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(34,197,94,0.3)',
        'glow-red':   '0 0 20px rgba(239,68,68,0.3)',
        'glow-blue':  '0 0 20px rgba(59,130,246,0.3)',
        card: '0 4px 24px rgba(0,0,0,0.4)',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-in-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { '0%':{ opacity:'0' },'100%':{ opacity:'1' } },
        slideUp: { '0%':{ transform:'translateY(10px)',opacity:'0' },'100%':{ transform:'translateY(0)',opacity:'1' } },
      },
    },
  },
  plugins: [],
};
