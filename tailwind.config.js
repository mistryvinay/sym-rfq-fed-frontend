/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        secondary: "#6366F1"
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(90deg, #EEF2FF 0%, #E0E7FF 100%)"
      }
    },
  },
  darkMode: "class",
  plugins: [],
};