import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        monst: ["Montserrat"]
      }
    },
  },
  daisyui: {
    themes: ["light"]
  },
  plugins: [require("daisyui")],
}