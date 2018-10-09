
import buble from 'rollup-plugin-buble'
import { uglify } from 'rollup-plugin-uglify'

const pkg = require('./package.json')

const output = {
    format: 'umd',
    file: 'split.js',
    name: 'Split',
    banner: `/*! Split.js - v${pkg.version} */\n`,
}

export default [{
    input: 'src/split.js',
    output,
    plugins: [
        buble(),
    ],
}, {
    input: 'src/split.js',
    output: {
        ...output,
        file: 'split.min.js',
    },
    plugins: [
        buble(),
        uglify({
            output: {
                comments: /^!/,
            },
        }),
    ],
}]
