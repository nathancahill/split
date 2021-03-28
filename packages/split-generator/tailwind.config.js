const forms = require('@tailwindcss/forms')

module.exports = {
    purge: false,
    theme: {
        extend: {
            colors: {
                code: {
                    green: 'var(--color-code-green)',
                    yellow: 'var(--color-code-yellow)',
                    purple: 'var(--color-code-purple)',
                    red: 'var(--color-code-red)',
                    blue: 'var(--color-code-blue)',
                    white: 'var(--color-code-white)',
                },
            },
        },
    },
    variants: {},
    plugins: [forms],
}
