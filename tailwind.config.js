/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ffffff",
        accent: "#22c55e", // Professional green
      },
      fontFamily: {
        logo: ['"Outfit"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

