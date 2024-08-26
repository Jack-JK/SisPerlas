/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: '#7e6aa2',  // Violeta claro
        secondary: '#4a3f69',  // Violeta oscuro
        accent: '#b794f4',  // Lila
        highlight: '#bf843b',  // Amarillo oscuro
        background: '#f3f4f6',  // Color de fondo claro
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],  // Fuente principal
        serif: ['Merriweather', 'serif'],  // Fuente para encabezados o bloques de texto especiales
      },
      spacing: {
        '128': '32rem',  // Espaciado extra grande
        '144': '36rem',  // Espaciado aún más grande
      },
      borderRadius: {
        '4xl': '2rem',  // Radio de borde personalizado
      },
    },
  },
  plugins: [],
}
