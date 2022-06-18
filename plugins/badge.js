const plugin = require('tailwindcss/plugin');

module.exports = plugin(({ e, addComponents, theme }) => {
    const colors = theme('colors');

    const components = [];

    Object.entries(colors).forEach(([key, color]) => {
        if (typeof color === 'object') {
            // Create style for badge component
            components.push({
                [`.${e(`badge-${key}`)}`]: {
                    backgroundColor: color['100'],
                    color: color['800'],
                },
                [`.${e(`badge-${key}`)}.${e(`badge-dot`)}::before`]: {
                    backgroundColor: color['400'],
                },
            });
        }
    });

    addComponents(components);
});
