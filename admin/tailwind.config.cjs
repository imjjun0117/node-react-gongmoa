/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      dnd: {
        space: {
          1: '8px',
          2: '12px',
          3: '16px',
          4: '24px',
        },
      }
    },
  },
  plugins: [],
});
