/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mars: {
          dark: "#000000",     // Noir pur Apple
          gray: "#0A0A0A",     // Gris ultra sombre pour les cartes
          light: "#111111",    // Gris secondaire
          primary: "#8B5CF6",  // Violet
          secondary: "#EC4899", // Rose
          accent: "#F59E0B",   // Orange/Gold
        }
      },
      backgroundImage: {
        'mars-gradient': 'linear-gradient(to right, #8B5CF6, #EC4899)',
        'mars-gradient-text': 'linear-gradient(to right, #FFFFFF, #E9D5FF)',
        'glass-gradient': 'linear-gradient(110deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.8)',
        'glass-light': '0 4px 16px 0 rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        'safe': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.pb-safe': {
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        },
      });
    },
  ],
}