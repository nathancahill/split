const numeric = (value, unit) => Number(value.slice(0, -1 * unit.length))

const parseValue = value => {
    if (value.endsWith('px'))
        return { value, type: 'px', numeric: numeric(value, 'px') }
    if (value.endsWith('fr'))
        return { value, type: 'fr', numeric: numeric(value, 'fr') }
    if (value.endsWith('%'))
        return { value, type: '%', numeric: numeric(value, '%') }
    if (value === 'auto') return { value, type: 'auto' }
    return null
}

export const parse = rule => rule.split(' ').map(parseValue)

export const combine = (rule, tracks) => {
    const prevTracks = rule ? rule.split(' ') : []

    tracks.forEach((track, i) => {
        if (i > prevTracks.length - 1) {
            throw new Error(
                `Unable to set size of track index ${i}, there are only ${
                    prevTracks.length
                } tracks in the grid layout.`,
            )
        }

        prevTracks[i] = track.value
            ? track.value
            : `${track.numeric}${track.type}`
    })

    return prevTracks.join(' ')
}

export const getSizeAtTrack = (index, tracks, gap = 0, end = false) => {
    const newIndex = end ? index + 1 : index
    const trackSum = tracks
        .slice(0, newIndex)
        .reduce((accum, value) => accum + value.numeric, 0)
    const gapSum = gap ? index * gap : 0

    return trackSum + gapSum
}
