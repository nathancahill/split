import buble from '@rollup/plugin-buble'
import { terser } from 'rollup-plugin-terser'

const pkg = require('./package.json')

const output = {
    format: 'umd',
    file: pkg.main,
    name: 'Split',
    sourcemap: false,
    banner: `/*! Split.js - v${pkg.version} */\n`,
}

export default [
    {
        input: 'src/split.js',
        output: [
            output,
            {
                file: pkg.module,
                format: 'esm',
                sourcemap: false,
            },
        ],
        plugins: [buble()],
    },
    {
        input: 'src/split.js',
        output: {
            ...output,
            sourcemap: true,
            file: pkg['minified:main'],
        },
        plugins: [buble(), terser()],
    },
]
