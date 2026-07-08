/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // These colors perfectly match the dark navy theme in the mockup![cite: 1]
        weatherDark: '#0b1326',
        weatherCard: '#16223f',
        weatherAccent: '#23355a',
      }
    },
  },
  plugins: [],
}