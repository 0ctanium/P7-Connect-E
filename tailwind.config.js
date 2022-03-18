const plugin = require('tailwindcss/plugin');

module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            spacing: {
                18: '4.5rem',
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
        require('@tailwindcss/forms')({
            // strategy: 'class',
        }),
        plugin(function ({ theme, e, addComponents }) {
            const colors = theme('colors');

            // Components
            const badges = [];

            Object.entries(colors).forEach(([key, color]) => {
                if (typeof color === 'object') {
                    badges.push({
                        [`.${e(`badge-${key}`)}`]: {
                            backgroundColor: color['100'],
                            color: color['800'],
                        },
                    });
                    badges.push({
                        [`.${e(`badge-${key}`)}.${e(`badge-dot`)}::before`]: {
                            backgroundColor: color['400'],
                        },
                    });
                }
            });

            addComponents(badges);
        }),
    ],
}
