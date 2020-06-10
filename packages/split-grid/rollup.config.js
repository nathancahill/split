import resolve from '@rollup/plugin-node-resolve'
import buble from '@rollup/plugin-buble'
import { terser } from 'rollup-plugin-terser'

const pkg = require('./package.json')

export default [
    {
        input: './src/index.js',
        output: [
            {
                name: 'Split',
                file: pkg.main,
                format: 'umd',
                sourcemap: false,
                banner: `/*! ${pkg.name} - v${pkg.version} */\n`,
            },
            {
                file: pkg.module,
                format: 'esm',
                sourcemap: false,
            },
        ],
        plugins: [
            resolve(),
            buble({
                exclude: 'node_modules/**',
                objectAssign: 'Object.assign',
                transforms: {
                    forOf: false,
                },
            }),
        ],
    },
    {
        input: './src/index.js',
        output: {
            name: 'Split',
            file: pkg['minified:main'],
            format: 'umd',
            sourcemap: true,
            banner: `/*! ${pkg.name} - v${pkg.version} */\n`,
        },
        plugins: [
            resolve(),
            buble({
                exclude: 'node_modules/**',
                objectAssign: 'Object.assign',
                transforms: {
                    forOf: false,
                },
            }),
            terser(),
        ],
    },
]
