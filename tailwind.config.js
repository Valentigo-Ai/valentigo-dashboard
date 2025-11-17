/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // important: use the "class" strategy (next-themes will add .light / .dark)
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        vgbg: "#0e1113",
        vgpane: "#0f1417",
        vgmuted: "#9aa6ad",
        vgaccent: "#6EC1E4", /* sky blue */
        vgblue: "#87BAFF"
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"]
      }
    }
  },
  plugins: []
}
