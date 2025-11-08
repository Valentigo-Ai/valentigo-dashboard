/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        vgbg: "#0e1113",
        vgpane: "#0f1417",
        vgmuted: "#9aa6ad",
        vgaccent: "#5fbffd",
        vgdark: "#0b0d0f"
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"]
      }
    }
  },
  plugins: []
};
