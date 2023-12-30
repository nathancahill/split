/* eslint-env jest */

import { getStyles, getGapValue, firstNonZero } from './util'

const ownStyle = { 'grid-template-columns': '2px 2px 2px' }

const columns = { 'grid-template-columns': '1px 1px 1px' }
const emptyColumns = { 'grid-template-columns': '' }
const noColumns = {}

test('getStyles columns', () => {
    const res = getStyles(
        'grid-template-columns',
        [{ style: {} }],
        [{ style: columns }],
    )
    expect(res).toEqual(['1px 1px 1px'])
})

test('getStyles emptyColumns', () => {
    const res = getStyles(
        'grid-template-columns',
        [{ style: {} }],
        [{ style: emptyColumns }],
    )
    expect(res).toEqual([])
})

test('getStyles noColumns', () => {
    const res = getStyles(
        'grid-template-columns',
        [{ style: {} }],
        [{ style: noColumns }],
    )
    expect(res).toEqual([])
})

test('getStyles ownStyle', () => {
    const res = getStyles(
        'grid-template-columns',
        [{ style: ownStyle }],
        [{ style: noColumns }],
    )
    expect(res).toEqual(['2px 2px 2px'])
})

test('getStyles ownStyle no match', () => {
    const res = getStyles(
        'grid-template-columns',
        [{ style: { other: '1' } }],
        [{ style: columns }],
    )
    expect(res).toEqual(['1px 1px 1px'])
})

const rows = { 'grid-template-rows': '1px 1px 1px' }
const emptyRows = { 'grid-template-rows': '' }
const noRows = {}

test('getStyles rows', () => {
    const res = getStyles(
        'grid-template-rows',
        [{ style: {} }],
        [{ style: rows }],
    )
    expect(res).toEqual(['1px 1px 1px'])
})

test('getStyles emptyRows', () => {
    const res = getStyles(
        'grid-template-rows',
        [{ style: {} }],
        [{ style: emptyRows }],
    )
    expect(res).toEqual([])
})

test('getStyles noRows', () => {
    const res = getStyles(
        'grid-template-rows',
        [{ style: {} }],
        [{ style: noRows }],
    )
    expect(res).toEqual([])
})

test('getGapValue', () => {
    expect(getGapValue('px', '10px')).toEqual(10)
})

test('firstNonZero fraction first', () => {
    expect(
        firstNonZero('fr', [
            { type: 'fr', numeric: 1 },
            { type: 'fr', numeric: 0 },
            { type: '%', numeric: 2 },
            { type: '%', numeric: 0 },
        ]),
    ).toEqual(0)
})

test('firstNonZero fraction second', () => {
    expect(
        firstNonZero('fr', [
            { type: 'fr', numeric: 0 },
            { type: 'fr', numeric: 1 },
            { type: '%', numeric: 0 },
            { type: '%', numeric: 1 },
        ]),
    ).toEqual(1)
})

test('firstNonZero percentage first', () => {
    expect(
        firstNonZero('%', [
            { type: 'fr', numeric: 1 },
            { type: 'fr', numeric: 0 },
            { type: '%', numeric: 2 },
            { type: '%', numeric: 0 },
        ]),
    ).toEqual(2)
})

test('firstNonZero percentage second', () => {
    expect(
        firstNonZero('%', [
            { type: 'fr', numeric: 0 },
            { type: 'fr', numeric: 1 },
            { type: '%', numeric: 0 },
            { type: '%', numeric: 1 },
        ]),
    ).toEqual(3)
})
