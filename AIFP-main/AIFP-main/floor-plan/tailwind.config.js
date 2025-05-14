/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false, // This prevents Tailwind from resetting styles that Radix needs
  },
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
