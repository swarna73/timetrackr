/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  extend: {
      /* add this ↓ */
      gridTemplateColumns: {
        /* gives you `grid-cols-15` */
        15: "repeat(15, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
};
