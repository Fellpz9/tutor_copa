/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        success: "#1D9E75",
        info: "#378ADD",
        warning: "#FBBF24",
        error: "#E24B4A",
      },
      fontFamily: {
        sans: "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      },
    },
  },
  plugins: [],
}
