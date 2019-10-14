/* eslint-env jest */

import Split from './index'

const gutter1 = { id: 'gutter1', addEventListener() {} }
const gutter2 = { id: 'gutter2', addEventListener() {} }
const gutter3 = { id: 'gutter3', addEventListener() {} }
const gutters = [
    { track: 1, element: gutter1 },
    { track: 3, element: gutter2 },
    { track: 5, element: gutter3 },
]

test('Grid#constructor columnGutters', () => {
    const res = Split({
        columnGutters: gutters,
    })
    expect(res.columnGutters[1].element.id).toEqual(gutter1.id)
    expect(res.columnGutters[3].element.id).toEqual(gutter2.id)
    expect(res.columnGutters[5].element.id).toEqual(gutter3.id)
})

test('Grid#constructor rowGutters', () => {
    const res = Split({
        rowGutters: gutters,
    })
    expect(res.rowGutters[1].element.id).toEqual(gutter1.id)
    expect(res.rowGutters[3].element.id).toEqual(gutter2.id)
    expect(res.rowGutters[5].element.id).toEqual(gutter3.id)
})
