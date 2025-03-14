/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "orange-button": '#ff561e',
        // Aquí puedes añadir más colores personalizados si lo necesitas
        "primary": '#0E3BB0',  // Ejemplo de color primario
        "secondary": '#ff4500',  // Ejemplo de color secundario
        "dark": '#1a1a1a',  // Ejemplo de color oscuro
        "light": '#f2f2f2',  // Ejemplo de color claro
        // Añade otros colores personalizados que necesites
      },
      boxShadow: {
        navbar: "0px 10px 8px 0px rgba(3, 3, 4, 0.03), 0 1px 2px -1px rgba(3, 3, 4, 0.03)",
        // Puedes agregar más sombras personalizadas aquí si es necesario
        "custom-light": "0px 4px 6px rgba(0, 0, 0, 0.1)",  // Ejemplo de sombra ligera
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
