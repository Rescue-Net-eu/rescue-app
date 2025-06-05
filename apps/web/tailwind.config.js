module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        'rescue-red': '#D32F2F',
        'volunteer-blue': '#1976D2',
        'dark-gray': '#424242',
        'off-white': '#F5F5F5',
      },
    },
  },
  variants: { extend: {} },
  plugins: [],
};
