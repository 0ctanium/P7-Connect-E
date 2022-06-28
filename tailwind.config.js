const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        18: '4.5rem',
      },
      colors: {
        fiord: {
          50: '#f6f6f7',
          100: '#edeef0',
          200: '#d3d4d9',
          300: '#b8b9c2',
          400: '#838594',
          500: '#4E5166',
          600: '#46495c',
          700: '#3b3d4d',
          800: '#2f313d',
          900: '#262832',
        },
        cosmos: {
          50: '#fffdfd',
          100: '#fffbfb',
          200: '#fff5f5',
          300: '#ffefef',
          400: '#ffe3e3',
          500: '#FFD7D7',
          600: '#e6c2c2',
          700: '#bfa1a1',
          800: '#998181',
          900: '#7d6969',
        },
        scarlet: {
          50: '#fff5f2',
          100: '#ffeae6',
          200: '#ffcbc0',
          300: '#feab99',
          400: '#fe6c4d',
          500: '#FD2D01',
          600: '#e42901',
          700: '#be2201',
          800: '#981b01',
          900: '#7c1600',
        },
      },
    },
  },
  variants: {
    extend: {
      borderStyle: ['focus'],
      borderWidth: ['focus'],
      backgroundColor: ['disabled', 'even'],
      cursor: ['disabled'],
      opacity: ['disabled'],
      margin: ['last'],
      display: ['group-hover'],
      fontWeight: ['group-hover'],
    },
  },
  plugins: [
    require('@tailwindcss/forms')(),
    require('@tailwindcss/aspect-ratio'),
    require('./plugins/badge'),
    require('./plugins/tooltip'),
  ],
};
