/* eslint-env jest */

import {
    getStyles,
    getTrackValues,
    getGapValue,
    getSizeAtTrack,
    firstNonZero,
    combineTracks,
} from './gridUtil'

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

test('getTrackValues px', () => {
    const res = getTrackValues('px', ['1px', '2px', '3px'])
    expect(res).toEqual({
        0: 1,
        1: 2,
        2: 3,
    })
})

test('getTrackValues fr', () => {
    const res = getTrackValues('fr', ['1fr', '1fr', '1fr'])
    expect(res).toEqual({
        0: 1,
        1: 1,
        2: 1,
    })
})

test('getPixels some px', () => {
    const res = getTrackValues('px', ['1px', '1fr', '2px'])
    expect(res).toEqual({
        0: 1,
        2: 2,
    })
})

test('getGapValue', () => {
    expect(getGapValue('px', '10px')).toEqual(10)
})

test('getSizeAtTrack 0 top', () => {
    expect(getSizeAtTrack(0, [50, 10, 5], 0, false)).toEqual(0)
})

test('getSizeAtTrack 0 top with gap', () => {
    expect(getSizeAtTrack(0, [50, 10, 5], 20, false)).toEqual(0)
})

test('getSizeAtTrack 0 bottom', () => {
    expect(getSizeAtTrack(0, [50, 10, 5], 0, true)).toEqual(50)
})

test('getSizeAtTrack 0 bottom with gap', () => {
    expect(getSizeAtTrack(0, [50, 10, 5], 20, true)).toEqual(50)
})

test('getSizeAtTrack 1 top', () => {
    expect(getSizeAtTrack(1, [50, 10, 5], 0, false)).toEqual(50)
})

test('getSizeAtTrack 1 bottom', () => {
    expect(getSizeAtTrack(1, [50, 10, 5], 0, true)).toEqual(60)
})

test('getSizeAtTrack 1 bottom with gap', () => {
    expect(getSizeAtTrack(1, [50, 10, 5], 20, true)).toEqual(80)
})

test('getSizeAtTrack 2 top', () => {
    expect(getSizeAtTrack(2, [50, 10, 5], 0, false)).toEqual(60)
})

test('getSizeAtTrack 2 top with gap', () => {
    expect(getSizeAtTrack(2, [50, 10, 5], 20, false)).toEqual(100)
})

test('getSizeAtTrack 2 bottom', () => {
    expect(getSizeAtTrack(2, [50, 10, 5], 0, true)).toEqual(65)
})

test('getSizeAtTrack 2 bottom with gap', () => {
    expect(getSizeAtTrack(2, [50, 10, 5], 20, true)).toEqual(105)
})

test('getSizeAtTrack 2 bottom no gap', () => {
    expect(getSizeAtTrack(2, [50, 10, 5], undefined, true)).toEqual(65)
})

test('firstNonZero first', () => {
    expect(firstNonZero({ a: 1, b: 0 })).toEqual('a')
})

test('firstNonZero second', () => {
    expect(firstNonZero({ a: 0, b: 1 })).toEqual('b')
})

test('combineTracks some', () => {
    expect(combineTracks('1fr 1fr 1fr', { 0: '2fr' })).toEqual('2fr 1fr 1fr')
})

test('combineTracks all', () => {
    expect(
        combineTracks('1fr 1fr 1fr', { 0: '2fr', 1: '2fr', 2: '2fr' }),
    ).toEqual('2fr 2fr 2fr')
})

test('combineTracks too many', () => {
    expect(() => {
        combineTracks('1fr 1fr 1fr', { 3: '2fr' })
    }).toThrow(
        'Unable to set size of track index 3, there are only 3 tracks in the grid layout.',
    )
})

test('combineTracks empty', () => {
    expect(() => {
        combineTracks('', { 0: '2fr' })
    }).toThrow(
        'Unable to set size of track index 0, there are only 0 tracks in the grid layout.',
    )
})
