import Gutter from './Gutter'
import { getOption } from './util'

const getTrackOption = (options, track, defaultValue) => {
    if (track in options) {
        return options[track]
    }

    return defaultValue
}

const createGutter = (direction, options) => gutterOptions => {
    if (gutterOptions.track < 1) {
        throw Error(
            `Invalid track index: ${gutterOptions.track}. Track must be between two other tracks.`,
        )
    }

    const trackMinSizes =
        direction === 'column'
            ? options.columnMinSizes || {}
            : options.rowMinSizes || {}
    const trackMaxSizes =
        direction === 'column'
            ? options.columnMaxSizes || {}
            : options.rowMaxSizes || {}
    const trackMinSize = direction === 'column' ? 'columnMinSize' : 'rowMinSize'
    const trackMaxSize = direction === 'column' ? 'columnMaxSize' : 'rowMaxSize'

    return new Gutter(
        direction,
        {
            minSizeStart: getTrackOption(
                trackMinSizes,
                gutterOptions.track - 1,
                getOption(
                    options,
                    trackMinSize,
                    getOption(options, 'minSize', 0),
                ),
            ),
            minSizeEnd: getTrackOption(
                trackMinSizes,
                gutterOptions.track + 1,
                getOption(
                    options,
                    trackMinSize,
                    getOption(options, 'minSize', 0),
                ),
            ),
            maxSizeStart: getTrackOption(
                trackMaxSizes,
                gutterOptions.track - 1,
                getOption(
                    options,
                    trackMaxSize,
                    getOption(options, 'maxSize', Infinity),
                ),
            ),
            maxSizeEnd: getTrackOption(
                trackMaxSizes,
                gutterOptions.track + 1,
                getOption(
                    options,
                    trackMaxSize,
                    getOption(options, 'maxSize', Infinity),
                ),
            ),
            ...gutterOptions,
        },
        options,
    )
}

class Grid {
    constructor(options) {
        this.columnGutters = {}
        this.rowGutters = {}

        this.options = {
            columnGutters: options.columnGutters || [],
            rowGutters: options.rowGutters || [],
            columnMinSizes: options.columnMinSizes || {},
            rowMinSizes: options.rowMinSizes || {},
            columnMaxSizes: options.columnMaxSizes || {},
            rowMaxSizes: options.rowMaxSizes || {},
            ...options,
        }

        this.options.columnGutters.forEach(gutterOptions => {
            this.columnGutters[gutterOptions.track] = createGutter(
                'column',
                this.options,
            )(gutterOptions)
        })

        this.options.rowGutters.forEach(gutterOptions => {
            this.rowGutters[gutterOptions.track] = createGutter(
                'row',
                this.options,
            )(gutterOptions)
        })
    }

    addColumnGutter(element, track) {
        if (this.columnGutters[track]) {
            this.columnGutters[track].destroy()
        }

        this.columnGutters[track] = createGutter(
            'column',
            this.options,
        )({
            element,
            track,
        })
    }

    addRowGutter(element, track) {
        if (this.rowGutters[track]) {
            this.rowGutters[track].destroy()
        }

        this.rowGutters[track] = createGutter(
            'row',
            this.options,
        )({
            element,
            track,
        })
    }

    removeColumnGutter(track, immediate = true) {
        if (this.columnGutters[track]) {
            this.columnGutters[track].destroy(immediate, () => {
                delete this.columnGutters[track]
            })
        }
    }

    removeRowGutter(track, immediate = true) {
        if (this.rowGutters[track]) {
            this.rowGutters[track].destroy(immediate, () => {
                delete this.rowGutters[track]
            })
        }
    }

    handleDragStart(e, direction, track) {
        if (direction === 'column') {
            if (this.columnGutters[track]) {
                this.columnGutters[track].destroy()
            }

            this.columnGutters[track] = createGutter(
                'column',
                this.options,
            )({
                track,
            })
            this.columnGutters[track].startDragging(e)
        } else if (direction === 'row') {
            if (this.rowGutters[track]) {
                this.rowGutters[track].destroy()
            }

            this.rowGutters[track] = createGutter(
                'row',
                this.options,
            )({
                track,
            })
            this.rowGutters[track].startDragging(e)
        }
    }

    destroy(immediate = true) {
        Object.keys(this.columnGutters).forEach(track =>
            this.columnGutters[track].destroy(immediate, () => {
                delete this.columnGutters[track]
            }),
        )
        Object.keys(this.rowGutters).forEach(track =>
            this.rowGutters[track].destroy(immediate, () => {
                delete this.rowGutters[track]
            }),
        )
    }
}

export default options => new Grid(options)
