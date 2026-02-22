import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#000000",
          dark: "#0a0a0a",
          muted: "#141414",
        },
        accent: {
          DEFAULT: "#4C1D95",
          dark: "#3b1466",
          light: "#5b21b6",
        },
        accentSecondary: {
          DEFAULT: "#6B21A8",
          dark: "#581c87",
          light: "#7c3aed",
        },
        text: {
          DEFAULT: "#f5f5f5",
          muted: "#a3a3a3",
          bright: "#ffffff",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "fade-in-up": "fadeInUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(107, 33, 168, 0.4)",
        "glow-sm": "0 0 20px -5px rgba(107, 33, 168, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
