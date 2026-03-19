/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F4c429", // Adds a custom 'primary' color
        secondary: "#E14A25", // Adds a custom 'secondary' color
        green: "#037B5C",

        cyan: { 100: "#1AB0B6", 200: "#4FC5CA", 300: "#00979E" },
      },
    },
  },
  plugins: [],
};
