export const getStyles = (rule, ownRules, matchedRules) =>
    [...ownRules, ...matchedRules]
        .map(r => r.style[rule])
        .filter(style => style !== undefined && style !== '')

export const getGapValue = (unit, size) => {
    if (size.endsWith(unit)) {
        return Number(size.slice(0, -1 * unit.length))
    }
    return null
}

export const firstNonZero = tracks => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].numeric > 0) {
            return i
        }
    }
    return null
}

export const NOOP = () => false

export const defaultWriteStyle = (element, gridTemplateProp, style) => {
    // eslint-disable-next-line no-param-reassign
    element.style[gridTemplateProp] = style
}

export const getOption = (options, propName, def) => {
    const value = options[propName]
    if (value !== undefined) {
        return value
    }
    return def
}
