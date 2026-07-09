// tailwind.config.js — Tailwind v3 configuration with custom pirate theme
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        parchment: {
          50:  "#fdf8f0",
          100: "#f9efd8",
          200: "#f4e4bc",
          300: "#edd4a0",
          400: "#e0be7a",
          500: "#d4a855",
          600: "#c08c30",
          700: "#9a6e20",
          800: "#7a5518",
          900: "#5c3f10",
        },
        ocean: {
          100: "#bfe7f5",
          200: "#7dcced",
          300: "#3bafe3",
          400: "#1a8fc7",
          500: "#1a6b8a",
          600: "#155570",
          700: "#0f3d55",
          800: "#092a3a",
          900: "#04151d",
        },
        treasure: {
          100: "#fff8dc",
          200: "#ffd700",
          300: "#ffbf00",
          400: "#d4a017",
          500: "#b8860b",
          600: "#9a7009",
          700: "#7a5607",
        },
        pirate: {
          brown: "#8B4513",
          darkbrown: "#5C2E00",
          green: "#2D5016",
          darkgreen: "#1a3009",
          red: "#8B0000",
        },
      },
      fontFamily: {
        pirate:   ["Pirata One", "cursive"],
        medieval: ["MedievalSharp", "cursive"],
        adventure:["Cinzel", "serif"],
        body:     ["Lato", "sans-serif"],
      },
      backgroundImage: {
        "parchment-texture": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        "glow-gold":   "0 0 20px 6px rgba(212,160,23,0.6)",
        "glow-blue":   "0 0 20px 6px rgba(26,143,199,0.6)",
        "glow-green":  "0 0 15px 4px rgba(45,80,22,0.5)",
        "treasure":    "0 0 40px 15px rgba(255,215,0,0.8), 0 0 80px 30px rgba(212,160,23,0.4)",
        "parchment":   "inset 0 0 60px rgba(139,69,19,0.2), 0 8px 32px rgba(0,0,0,0.4)",
        "card":        "0 4px 20px rgba(139,69,19,0.25), 0 1px 4px rgba(0,0,0,0.2)",
        "node":        "0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
      },
      animation: {
        "float":         "float 6s ease-in-out infinite",
        "float-slow":    "float 10s ease-in-out infinite",
        "float-fast":    "float 4s ease-in-out infinite",
        "glow-pulse":    "glowPulse 2s ease-in-out infinite",
        "spin-slow":     "spin 20s linear infinite",
        "bird":          "bird 15s linear infinite",
        "wave":          "wave 4s ease-in-out infinite",
        "sparkle":       "sparkle 1.5s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px 6px rgba(255,215,0,0.6)" },
          "50%":      { boxShadow: "0 0 40px 15px rgba(255,215,0,0.9)" },
        },
        bird: {
          "0%":   { transform: "translateX(-100px) translateY(0px)" },
          "25%":  { transform: "translateX(25vw) translateY(-20px)" },
          "50%":  { transform: "translateX(50vw) translateY(5px)" },
          "75%":  { transform: "translateX(75vw) translateY(-15px)" },
          "100%": { transform: "translateX(110vw) translateY(0px)" },
        },
        wave: {
          "0%, 100%": { transform: "scaleX(1)" },
          "50%":      { transform: "scaleX(1.05)" },
        },
        sparkle: {
          "0%, 100%": { opacity: 1, transform: "scale(1)" },
          "50%":      { opacity: 0.4, transform: "scale(0.8)" },
        },
      },
    },
  },
  plugins: [],
};
