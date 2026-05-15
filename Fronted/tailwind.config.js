export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Outfit'", "system-ui", "sans-serif"],
        display: ["'Playfair Display'", "Georgia", "serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: { DEFAULT: "#0a0a0a", 50: "#f5f5f4", 100: "#e8e5e0", 200: "#ccc8c0", 300: "#a8a39a", 400: "#7a7570", 500: "#5a5550", 600: "#3d3a36", 700: "#2a2825", 800: "#1a1917", 900: "#0d0c0b", 950: "#0a0a0a" },
        cream: { DEFAULT: "#faf8f5", 50: "#fefefe", 100: "#faf8f5", 200: "#f0ede7", 300: "#e4dfd6", 400: "#d0c9bd", 500: "#b8b0a2" },
        amber: { DEFAULT: "#d4a853", 50: "#fdf8ee", 100: "#faefd5", 200: "#f3d99d", 300: "#ecbe5e", 400: "#d4a853", 500: "#b8903e", 600: "#9a7530", 700: "#7d5e24", 800: "#634a1c", 900: "#4e3a15" },
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "slide-left": "slideLeft 0.5s ease-out forwards",
        "slide-right": "slideRight 0.5s ease-out forwards",
        shimmer: "shimmer 1.8s infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: { from: { opacity: 0, transform: "translateY(24px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideLeft: { from: { opacity: 0, transform: "translateX(32px)" }, to: { opacity: 1, transform: "translateX(0)" } },
        slideRight: { from: { opacity: 0, transform: "translateX(-32px)" }, to: { opacity: 1, transform: "translateX(0)" } },
        shimmer: { "0%": { backgroundPosition: "-1000px 0" }, "100%": { backgroundPosition: "1000px 0" } },
        float: { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-8px)" } },
      },
    },
  },
  plugins: [],
};
