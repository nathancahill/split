import buble from 'rollup-plugin-buble'
import { uglify } from 'rollup-plugin-uglify'

const pkg = require('./package.json')

export default [
    {
        input: './src/index.js',
        output: [
            {
                name: 'GridTemplateUtils',
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
            name: 'GridTemplateUtils',
            file: pkg['minified:main'],
            format: 'umd',
            sourcemap: true,
            banner: `/*! ${pkg.name} - v${pkg.version} */\n`,
        },
        plugins: [
            buble({
                exclude: 'node_modules/**',
                objectAssign: 'Object.assign',
                transforms: {
                    forOf: false,
                },
            }),
            uglify({
                output: {
                    comments: /^!/,
                },
            }),
        ],
    },
]
