/* eslint-disable global-require */
const purgecss = require('@fullhuman/postcss-purgecss')({
    content: ['./src/**/*.html', './src/**/*.svelte'],

    safelist: [/svelte-/],

    defaultExtractor: content =>
        content
            .match(/[A-Za-z0-9-_:./]+/g)
            .map(c => (c.startsWith('class:') ? c.substring(6) : c)) || [],
})

const plugins = [require('tailwindcss'), require('autoprefixer')]

if (process.env.NODE_ENV === 'production') {
    plugins.push(purgecss)
}

module.exports = {
    plugins,
}
