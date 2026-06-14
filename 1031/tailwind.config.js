/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        alchemy: {
          brown: '#2C1810',
          darkBrown: '#1A0F0A',
          copper: '#D4A574',
          copperLight: '#E8C9A0',
          copperDark: '#B8895A',
          flame: '#FF6B35',
          flameLight: '#FF8C5A',
          flameDark: '#E55A2B',
          smoke: '#6B7280',
          smokeLight: '#9CA3AF',
          emerald: '#10B981',
          parchment: '#F5E6D3',
          parchmentDark: '#E8D4BC',
        }
      },
      fontFamily: {
        display: ['"Cinzel Decorative"', 'serif'],
        body: ['"Crimson Pro"', 'serif'],
      },
      animation: {
        'flicker': 'flicker 1.5s ease-in-out infinite',
        'smoke': 'smoke 3s ease-out forwards',
        'shake': 'shake 0.5s ease-in-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'typewriter': 'typewriter 2s steps(40) forwards',
        'unlock': 'unlock 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1', transform: 'scaleY(1)' },
          '50%': { opacity: '0.8', transform: 'scaleY(0.95)' },
        },
        smoke: {
          '0%': { opacity: '0.8', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-100px) scale(2)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-10px)' },
          '75%': { transform: 'translateX(10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 107, 53, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 107, 53, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        typewriter: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        unlock: {
          '0%': { transform: 'scale(0.8) rotate(-10deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
