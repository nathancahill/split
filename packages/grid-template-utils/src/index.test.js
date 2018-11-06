/* eslint-env jest */

import { parse, combine, getSizeAtTrack } from './index'

const sizeTracks = [
    { value: '50px', type: 'px', numeric: 50 },
    { value: '10px', type: 'px', numeric: 10 },
    { value: '5px', type: 'px', numeric: 5 },
]
;[
    {
        input: '1px 2px 3px',
        output: [
            { value: '1px', type: 'px', numeric: 1 },
            { value: '2px', type: 'px', numeric: 2 },
            { value: '3px', type: 'px', numeric: 3 },
        ],
    },
    {
        input: '1fr 2px 3fr',
        output: [
            { value: '1fr', type: 'fr', numeric: 1 },
            { value: '2px', type: 'px', numeric: 2 },
            { value: '3fr', type: 'fr', numeric: 3 },
        ],
    },
    {
        input: '40% auto 10%',
        output: [
            { value: '40%', type: '%', numeric: 40 },
            { value: 'auto', type: 'auto' },
            { value: '10%', type: '%', numeric: 10 },
        ],
    },
    {
        input: '1unsupported 2unsupported',
        output: [null, null],
    },
].forEach(({ input, output }) => {
    test(`parse ${input}`, () => {
        expect(parse(input)).toEqual(output)
    })
})
;[
    {
        input: {
            rule: '1px 1px 1px',
            tracks: [
                { value: '1px', type: 'px', numeric: 1 },
                { value: '2px', type: 'px', numeric: 2 },
                { value: '3px', type: 'px', numeric: 3 },
            ],
        },
        output: '1px 2px 3px',
    },
    {
        input: {
            rule: '1px 1px 1px',
            tracks: [
                { value: '1fr', type: 'fr', numeric: 1 },
                { value: '2px', type: 'px', numeric: 2 },
                { value: '3fr', type: 'fr', numeric: 3 },
            ],
        },
        output: '1fr 2px 3fr',
    },
    {
        input: {
            rule: '1px 1px 1px',
            tracks: (() => {
                const sparse = []
                sparse[1] = { value: '2px', type: 'px', numeric: 2 }
                return sparse
            })(),
        },
        output: '1px 2px 1px',
    },
    {
        input: {
            rule: '1px 1px 1px',
            tracks: [
                { type: 'fr', numeric: 1 },
                { type: 'px', numeric: 2 },
                { type: 'fr', numeric: 3 },
            ],
        },
        output: '1fr 2px 3fr',
    },
].forEach(({ input: { rule, tracks }, output }) => {
    test(`combine ${rule}`, () => {
        expect(combine(rule, tracks)).toEqual(output)
    })
})
;[
    {
        input: {
            index: 0,
            gap: 0,
            end: false,
        },
        output: 0,
    },
    {
        input: {
            index: 0,
            gap: 20,
            end: false,
        },
        output: 0,
    },
    {
        input: {
            index: 0,
            gap: 0,
            end: true,
        },
        output: 50,
    },
    {
        input: {
            index: 0,
            gap: 20,
            end: true,
        },
        output: 50,
    },
    {
        input: {
            index: 1,
            gap: 0,
            end: false,
        },
        output: 50,
    },
    {
        input: {
            index: 1,
            gap: 0,
            end: true,
        },
        output: 60,
    },
    {
        input: {
            index: 1,
            gap: 20,
            end: true,
        },
        output: 80,
    },
    {
        input: {
            index: 2,
            gap: 0,
            end: false,
        },
        output: 60,
    },
    {
        input: {
            index: 2,
            gap: 20,
            end: false,
        },
        output: 100,
    },
    {
        input: {
            index: 2,
            gap: 0,
            end: true,
        },
        output: 65,
    },
    {
        input: {
            index: 2,
            gap: 20,
            end: true,
        },
        output: 105,
    },
    {
        input: {
            index: 2,
            gap: undefined,
            end: true,
        },
        output: 65,
    },
].forEach(({ input: { index, gap, end }, output }) => {
    test(`getSizeAtTrack ${index} ${gap} ${end}`, () => {
        expect(getSizeAtTrack(index, sizeTracks, gap, end)).toEqual(output)
    })
})
