import { parse, getSizeAtTrack } from 'grid-template-utils'
import { getStyles, getGapValue, firstNonZero } from './util'
import getMatchedCSSRules from './getMatchedCSSRules'

const gridTemplatePropColumns = 'grid-template-columns'
const gridTemplatePropRows = 'grid-template-rows'

const NOOP = () => false

const defaultWriteStyle = (element, gridTemplateProp, style) => {
    // eslint-disable-next-line no-param-reassign
    element.style[gridTemplateProp] = style
}

const getOption = (options, propName, def) => {
    const value = options[propName]
    if (value !== undefined) {
        return value
    }
    return def
}

class Gutter {
    constructor(direction, options, parentOptions) {
        this.direction = direction
        this.element = options.element
        this.track = options.track

        if (direction === 'column') {
            this.gridTemplateProp = gridTemplatePropColumns
            this.gridGapProp = 'grid-column-gap'
            this.cursor = getOption(
                parentOptions,
                'columnCursor',
                getOption(parentOptions, 'cursor', 'col-resize'),
            )
            this.snapOffset = getOption(
                parentOptions,
                'columnSnapOffset',
                getOption(parentOptions, 'snapOffset', 30),
            )
            this.dragInterval = getOption(
                parentOptions,
                'columnDragInterval',
                getOption(parentOptions, 'dragInterval', 1),
            )
            this.clientAxis = 'clientX'
            this.optionStyle = getOption(parentOptions, 'gridTemplateColumns')
        } else if (direction === 'row') {
            this.gridTemplateProp = gridTemplatePropRows
            this.gridGapProp = 'grid-row-gap'
            this.cursor = getOption(
                parentOptions,
                'rowCursor',
                getOption(parentOptions, 'cursor', 'row-resize'),
            )
            this.snapOffset = getOption(
                parentOptions,
                'rowSnapOffset',
                getOption(parentOptions, 'snapOffset', 30),
            )
            this.dragInterval = getOption(
                parentOptions,
                'rowDragInterval',
                getOption(parentOptions, 'dragInterval', 1),
            )
            this.clientAxis = 'clientY'
            this.optionStyle = getOption(parentOptions, 'gridTemplateRows')
        }

        this.onDragStart = getOption(parentOptions, 'onDragStart', NOOP)
        this.onDragEnd = getOption(parentOptions, 'onDragEnd', NOOP)
        this.onDrag = getOption(parentOptions, 'onDrag', NOOP)
        this.writeStyle = getOption(
            parentOptions,
            'writeStyle',
            defaultWriteStyle,
        )

        this.startDragging = this.startDragging.bind(this)
        this.stopDragging = this.stopDragging.bind(this)
        this.drag = this.drag.bind(this)

        this.minSizeStart = options.minSizeStart
        this.minSizeEnd = options.minSizeEnd

        if (options.element) {
            this.element.addEventListener('mousedown', this.startDragging)
            this.element.addEventListener('touchstart', this.startDragging)
        }
    }

    getDimensions() {
        const {
            width,
            height,
            top,
            bottom,
            left,
            right,
        } = this.grid.getBoundingClientRect()

        if (this.direction === 'column') {
            this.start = top
            this.end = bottom
            this.size = height
        } else if (this.direction === 'row') {
            this.start = left
            this.end = right
            this.size = width
        }
    }

    getSizeAtTrack(track, end) {
        return getSizeAtTrack(
            track,
            this.computedPixels,
            this.computedGapPixels,
            end,
        )
    }

    getSizeOfTrack(track) {
        return this.computedPixels[track].numeric
    }

    getRawTracks() {
        const tracks = getStyles(
            this.gridTemplateProp,
            [this.grid],
            getMatchedCSSRules(this.grid),
        )
        if (!tracks.length) {
            if (this.optionStyle) return this.optionStyle

            throw Error('Unable to determine grid template tracks from styles.')
        }
        return tracks[0]
    }

    getGap() {
        const gap = getStyles(
            this.gridGapProp,
            [this.grid],
            getMatchedCSSRules(this.grid),
        )
        if (!gap.length) {
            return null
        }
        return gap[0]
    }

    getRawComputedTracks() {
        return window.getComputedStyle(this.grid)[this.gridTemplateProp]
    }

    getRawComputedGap() {
        return window.getComputedStyle(this.grid)[this.gridGapProp]
    }

    setTracks(raw) {
        this.tracks = raw.split(' ')
        this.trackValues = parse(raw)
    }

    setComputedTracks(raw) {
        this.computedTracks = raw.split(' ')
        this.computedPixels = parse(raw)
    }

    setGap(raw) {
        this.gap = raw
    }

    setComputedGap(raw) {
        this.computedGap = raw
        this.computedGapPixels = getGapValue('px', this.computedGap) || 0
    }

    getMousePosition(e) {
        if ('touches' in e) return e.touches[0][this.clientAxis]
        return e[this.clientAxis]
    }

    startDragging(e) {
        if ('button' in e && e.button !== 0) {
            return
        }

        // Don't actually drag the element. We emulate that in the drag function.
        e.preventDefault()

        if (this.element) {
            this.grid = this.element.parentNode
        } else {
            this.grid = e.target.parentNode
        }

        this.getDimensions()
        this.setTracks(this.getRawTracks())
        this.setComputedTracks(this.getRawComputedTracks())
        this.setGap(this.getGap())
        this.setComputedGap(this.getRawComputedGap())

        const trackPercentage = this.trackValues.filter(
            track => track.type === '%',
        )
        const trackFr = this.trackValues.filter(track => track.type === 'fr')

        this.totalFrs = trackFr.length

        if (this.totalFrs) {
            const track = firstNonZero(trackFr)

            if (track !== null) {
                this.frToPixels =
                    this.computedPixels[track].numeric / trackFr[track].numeric
            }
        }

        if (trackPercentage.length) {
            const track = firstNonZero(trackPercentage)

            if (track !== null) {
                this.percentageToPixels =
                    this.computedPixels[track].numeric /
                    trackPercentage[track].numeric
            }
        }

        // get start of gutter track
        const gutterStart = this.getSizeAtTrack(this.track, false) + this.start
        this.dragStartOffset = this.getMousePosition(e) - gutterStart

        this.aTrack = this.track - 1

        if (this.track < this.tracks.length - 1) {
            this.bTrack = this.track + 1
        } else {
            throw Error(
                `Invalid track index: ${
                    this.track
                }. Track must be between two other tracks and only ${
                    this.tracks.length
                } tracks were found.`,
            )
        }

        this.aTrackStart = this.getSizeAtTrack(this.aTrack, false) + this.start
        this.bTrackEnd = this.getSizeAtTrack(this.bTrack, true) + this.start

        // Set the dragging property of the pair object.
        this.dragging = true

        // All the binding. `window` gets the stop events in case we drag out of the elements.
        window.addEventListener('mouseup', this.stopDragging)
        window.addEventListener('touchend', this.stopDragging)
        window.addEventListener('touchcancel', this.stopDragging)
        window.addEventListener('mousemove', this.drag)
        window.addEventListener('touchmove', this.drag)

        // Disable selection. Disable!
        this.grid.addEventListener('selectstart', NOOP)
        this.grid.addEventListener('dragstart', NOOP)

        this.grid.style.userSelect = 'none'
        this.grid.style.webkitUserSelect = 'none'
        this.grid.style.MozUserSelect = 'none'
        this.grid.style.pointerEvents = 'none'

        // Set the cursor at multiple levels
        this.grid.style.cursor = this.cursor
        window.document.body.style.cursor = this.cursor

        this.onDragStart(this.direction, this.track)
    }

    stopDragging() {
        this.dragging = false

        // Remove the stored event listeners. This is why we store them.
        this.cleanup()

        this.onDragEnd(this.direction, this.track)

        if (this.needsDestroy) {
            if (this.element) {
                this.element.removeEventListener(
                    'mousedown',
                    this.startDragging,
                )
                this.element.removeEventListener(
                    'touchstart',
                    this.startDragging,
                )
            }
            this.destroyCb()
            this.needsDestroy = false
            this.destroyCb = null
        }
    }

    drag(e) {
        let mousePosition = this.getMousePosition(e)

        const gutterSize = this.getSizeOfTrack(this.track)
        const minMousePosition =
            this.aTrackStart +
            this.minSizeStart +
            this.dragStartOffset +
            this.computedGapPixels
        const maxMousePosition =
            this.bTrackEnd -
            this.minSizeEnd -
            this.computedGapPixels -
            (gutterSize - this.dragStartOffset)
        const minMousePositionOffset = minMousePosition + this.snapOffset
        const maxMousePositionOffset = maxMousePosition - this.snapOffset

        if (mousePosition < minMousePositionOffset) {
            mousePosition = minMousePosition
        }

        if (mousePosition > maxMousePositionOffset) {
            mousePosition = maxMousePosition
        }

        if (mousePosition < minMousePosition) {
            mousePosition = minMousePosition
        } else if (mousePosition > maxMousePosition) {
            mousePosition = maxMousePosition
        }

        let aTrackSize =
            mousePosition -
            this.aTrackStart -
            this.dragStartOffset -
            this.computedGapPixels
        let bTrackSize =
            this.bTrackEnd -
            mousePosition +
            this.dragStartOffset -
            gutterSize -
            this.computedGapPixels

        if (this.dragInterval > 1) {
            const aTrackSizeIntervaled =
                Math.round(aTrackSize / this.dragInterval) * this.dragInterval
            bTrackSize -= aTrackSizeIntervaled - aTrackSize
            aTrackSize = aTrackSizeIntervaled
        }

        if (aTrackSize < this.minSizeStart) {
            aTrackSize = this.minSizeStart
        }

        if (bTrackSize < this.minSizeEnd) {
            bTrackSize = this.minSizeEnd
        }

        if (this.trackValues[this.aTrack].type === 'px') {
            this.tracks[this.aTrack] = `${aTrackSize}px`
        } else if (this.trackValues[this.aTrack].type === 'fr') {
            if (this.totalFrs === 1) {
                this.tracks[this.aTrack] = '1fr'
            } else {
                const targetFr = aTrackSize / this.frToPixels
                this.tracks[this.aTrack] = `${targetFr}fr`
            }
        } else if (this.trackValues[this.aTrack].type === '%') {
            const targetPercentage = aTrackSize / this.percentageToPixels
            this.tracks[this.aTrack] = `${targetPercentage}%`
        }

        if (this.trackValues[this.bTrack].type === 'px') {
            this.tracks[this.bTrack] = `${bTrackSize}px`
        } else if (this.trackValues[this.bTrack].type === 'fr') {
            if (this.totalFrs === 1) {
                this.tracks[this.bTrack] = '1fr'
            } else {
                const targetFr = bTrackSize / this.frToPixels
                this.tracks[this.bTrack] = `${targetFr}fr`
            }
        } else if (this.trackValues[this.bTrack].type === '%') {
            const targetPercentage = bTrackSize / this.percentageToPixels
            this.tracks[this.bTrack] = `${targetPercentage}%`
        }

        const style = this.tracks.join(' ')
        this.writeStyle(this.grid, this.gridTemplateProp, style)
        this.onDrag(this.direction, this.track, style)
    }

    cleanup() {
        window.removeEventListener('mouseup', this.stopDragging)
        window.removeEventListener('touchend', this.stopDragging)
        window.removeEventListener('touchcancel', this.stopDragging)
        window.removeEventListener('mousemove', this.drag)
        window.removeEventListener('touchmove', this.drag)

        if (this.grid) {
            this.grid.removeEventListener('selectstart', NOOP)
            this.grid.removeEventListener('dragstart', NOOP)

            this.grid.style.userSelect = ''
            this.grid.style.webkitUserSelect = ''
            this.grid.style.MozUserSelect = ''
            this.grid.style.pointerEvents = ''

            this.grid.style.cursor = ''
        }

        window.document.body.style.cursor = ''
    }

    destroy(immediate = true, cb) {
        if (immediate || this.dragging === false) {
            this.cleanup()
            if (this.element) {
                this.element.removeEventListener(
                    'mousedown',
                    this.startDragging,
                )
                this.element.removeEventListener(
                    'touchstart',
                    this.startDragging,
                )
            }

            if (cb) {
                cb()
            }
        } else {
            this.needsDestroy = true
            if (cb) {
                this.destroyCb = cb
            }
        }
    }
}

const getTrackOption = (options, track, defaultValue) => {
    if (track in options) {
        return options[track]
    }

    return defaultValue
}

const createGutter = (direction, options) => gutterOptions => {
    if (gutterOptions.track < 1) {
        throw Error(
            `Invalid track index: ${
                gutterOptions.track
            }. Track must be between two other tracks.`,
        )
    }

    const trackMinSizes =
        direction === 'column'
            ? options.columnMinSizes || {}
            : options.rowMinSizes || {}
    const trackMinSize = direction === 'column' ? 'columnMinSize' : 'rowMinSize'

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
            ...options,
        }

        this.options.columnGutters.forEach(gutterOptions => {
            this.columnGutters[options.track] = createGutter(
                'column',
                this.options,
            )(gutterOptions)
        })

        this.options.rowGutters.forEach(gutterOptions => {
            this.rowGutters[options.track] = createGutter('row', this.options)(
                gutterOptions,
            )
        })
    }

    addColumnGutter(element, track) {
        if (this.columnGutters[track]) {
            this.columnGutters[track].destroy()
        }

        this.columnGutters[track] = createGutter('column', this.options)({
            element,
            track,
        })
    }

    addRowGutter(element, track) {
        if (this.rowGutters[track]) {
            this.rowGutters[track].destroy()
        }

        this.rowGutters[track] = createGutter('row', this.options)({
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

            this.columnGutters[track] = createGutter('column', this.options)({
                track,
            })
            this.columnGutters[track].startDragging(e)
        } else if (direction === 'row') {
            if (this.rowGutters[track]) {
                this.rowGutters[track].destroy()
            }

            this.rowGutters[track] = createGutter('row', this.options)({
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
