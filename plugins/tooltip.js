let flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette').default

module.exports = function ({ theme, matchUtilities }) {
    matchUtilities(
        {
          'tooltip-bg': (value) => {
            return {
              '--tooltip-background': value,
            }
          },
          'tooltip-border': (value) => {
            return {
              '--tooltip-border': value,
            }
          },
        },
        {
          values: flattenColorPalette(theme('colors')),
          type: ['color', 'any'],
        }
      )
};
