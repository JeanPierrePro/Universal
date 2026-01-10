/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <--- ADICIONE ISSO
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#8b5cf6', // Roxo Violeta
          dark: '#09090b',   // Preto quase absoluto
          light: '#fafafa',  // Branco suave
        }
      }
    },
  },
  plugins: [],
}