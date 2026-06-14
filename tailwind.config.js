/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    extend: {
      colors: {
        museum: {
          50: "#f0f0ff",
          100: "#e0e0ff",
          200: "#c7c7ff",
          300: "#a3a3ff",
          400: "#7a7aff",
          500: "#5c5cff",
          600: "#4040f5",
          700: "#3232d4",
          800: "#2a2aab",
          900: "#1a1a3e",
          950: "#0f0f24",
        },
        neon: {
          purple: "#9d4edd",
          blue: "#00d4ff",
          pink: "#ff006e",
          yellow: "#ffbe0b",
          green: "#06ffa5",
          orange: "#ff9e00",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "'Noto Sans SC', sans-serif"],
        body: ["'Inter'", "'Noto Sans SC', sans-serif"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "gradient": "gradient 8s ease infinite",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-up": "slide-up 0.6s ease-out",
        "bounce-slow": "bounce-slow 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5", boxShadow: "0 0 20px rgba(157, 78, 221, 0.3)" },
          "50%": { opacity: "1", boxShadow: "0 0 40px rgba(157, 78, 221, 0.6)" },
        },
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
