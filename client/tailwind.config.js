const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    screens: {
      sm: '640px',
      md: '960px',
      lg: '1440px',
    },
    colors: {
      ...colors,
      primary: {
        50: '#eff6f5',
        100: '#d2eff2',
        200: '#9fe5e2',
        300: '#66cbc0',
        400: '#2aac98',
        500: '#1e9071',
        600: '#1b7958',
        700: '#195d46',
        800: '#134034',
        900: '#0d2727',
      },
    },
    fontFamily: {
      sans: ['InterVariable', 'sans-serif'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
