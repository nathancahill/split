export const getStyles = (rule, ownRules, matchedRules) =>
    [...ownRules, ...matchedRules]
        .map(r => r.style[rule])
        .filter(style => style !== undefined && style !== '')

export const getTrackValues = (unit, sizes) =>
    sizes.reduce((accum, size, i) => {
        if (size.endsWith(unit)) {
            // eslint-disable-next-line no-param-reassign
            accum[i] = Number(size.slice(0, -1 * unit.length))
        }

        return accum
    }, {})

export const getGapValue = (unit, size) => {
    if (size.endsWith(unit)) {
        return Number(size.slice(0, -1 * unit.length))
    }
    return null
}

export const getComputedValues = sizes =>
    sizes.map(size => Number(size.slice(0, -2)))

export const getTypeFromTrackValue = value => {
    if (value.endsWith('px')) return 'px'
    if (value.endsWith('fr')) return 'fr'
    if (value.endsWith('%')) return '%'
    if (value === 'auto') return 'auto'
    return null
}

export const getSizeAtTrack = (index, tracks, gap, end) => {
    const newIndex = end ? index + 1 : index
    const trackSum = tracks
        .slice(0, newIndex)
        .reduce((accum, value) => accum + value, 0)
    const gapSum = gap ? index * gap : 0

    return trackSum + gapSum
}

export const firstNonZero = obj => {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i += 1) {
        if (obj[keys[i]] > 0) {
            return keys[i]
        }
    }
    return null
}

export const combineTracks = (oldTracks, newTracks) => {
    const old = oldTracks ? oldTracks.split(' ') : []

    Object.keys(newTracks).forEach(track => {
        if (track > old.length - 1) {
            throw new Error(
                `Unable to set size of track index ${track}, there are only ${
                    old.length
                } tracks in the grid layout.`,
            )
        }

        old[track] = newTracks[track]
    })

    return old.join(' ')
}
