// The programming goals of Split.js are to deliver readable, understandable and
// maintainable code, while at the same time manually optimizing for tiny minified file size,
// browser compatibility without additional requirements, graceful fallback (IE8 is supported)
// and very few assumptions about the user's page layout.
const global = window
const document = global.document

// Save a couple long function names that are used frequently.
// This optimization saves around 400 bytes.
const add = 'addEventListener'
const remove = 'removeEventListener'
const getBoundingClientRect = 'getBoundingClientRect'

const eDragTrigger = ['mousedown', 'touchstart']
const eDragStart = ['selectstart', 'dragstart']
const eDragMove = ['mousemove', 'touchmove']
const eDragStop = ['mouseup', 'touchend', 'touchcancel']

const HORIZONTAL = 'horizontal'
const NOOP = () => false

// Figure out if we're in IE8 or not. IE8 will still render correctly,
// but will be static instead of draggable.
const isIE8 = global.attachEvent && !global[add]

// Helpers function determines which prefixes CSS props and CSS values needs.
// We only need to do this once on startup, when this anonymous function is called.
//
// Tests -webkit, -moz and -o prefixes. Modified from StackOverflow:
// http://stackoverflow.com/questions/16625140/js-feature-detection-to-detect-the-usage-of-webkit-calc-over-calc/16625167#16625167
const calc = `${['', '-webkit-', '-moz-', '-o-'].filter(prefix => {
    const el = document.createElement('div')
    el.style.cssText = `width:${prefix}calc(9px)`

    return (!!el.style.length)
}).shift()}calc`

const userSelect = `${['', '-webkit-', '-moz-', '-o-'].filter(prefix => {
    const el = document.createElement('div')
    el.style.cssText = `${prefix}user-select: none`

    return (!!el.style.length)
}).shift()}userSelect`

// Helper function checks if its argument is a string-like type
const isString = v => (typeof v === 'string' || v instanceof String)
const isArray = Array.isArray || (arg => Object.prototype.toString.call(arg) === '[object Array]')

// Helper function allows elements and string selectors to be used
// interchangeably. In either case an element is returned. This allows us to
// do `Split([elem1, elem2])` as well as `Split(['#id1', '#id2'])`.
const elementOrSelector = el => (isString(el) ? document.querySelector(el) : el)

// Helper function gets a property from the properties object, with a default fallback
const getOption = (options, propName, def) => {
    const value = options[propName]
    if (value !== undefined) {
        return value
    }
    return def
}

const eventListeners = (els, operation, events, callback) => {
    const elArr = !isArray(els) ? [els] : els
    const eArr = !isArray(events) ? [events] : events

    elArr.forEach(el => {
        eArr.forEach(eName => el[operation](eName, callback))
    })
}

// Default options
const defaultGutterFn = (i, gutterDirection) => {
    const gut = document.createElement('div')
    gut.className = `gutter gutter-${gutterDirection}`
    return gut
}

const defaultElementStyleFn = (dim, size, gutSize) => {
    const style = {}

    if (!isString(size)) {
        if (!isIE8) {
            style[dim] = `${calc}(${size}% - ${gutSize}px)`
        } else {
            style[dim] = `${size}%`
        }
    } else {
        style[dim] = size
    }

    return style
}

const defaultGutterStyleFn = (dim, gutSize) => ({ [dim]: `${gutSize}px` })

// The main function to initialize a split. Split.js thinks about each pair
// of two panes as an independant pair. Dragging the gutter between two panes
// only changes the dimensions of elements in that pair. This is key to understanding
// how the following functions operate, since each function is bound to a pair.
//
// Pair object is shaped like this:
//
// {
//     a: Number (Pane index)
//     b: Number (Pane index)
//     g: Number ( dragging Gutter index)
// }
//
// Pane object is shaped like this:
//
// {
//     el: DOM element
//     minSize: Number
//     size: Number
//     isFirst: Boolean
//     isLast: Boolean
//     isCollapsed: Boolean
// }
//
// Gutter object is shaped like this:
//
// {
//     el: DOM element
//     isDragging: Boolean,
// }
//
// The basic sequence:
//
// 1. Set defaults to something sane. `options` doesn't have to be passed at all.
// 2. Initialize a bunch of strings based on the direction we're splitting.
//    A lot of the behavior in the rest of the library is paramatized down to
//    rely on CSS strings and classes.
// 3. Define the dragging helper functions, and a few helpers to go with them.
// 4. Loop through the elements while pairing them off. Every pair gets an
//    `pair` object, a gutter, and special isFirst/isLast properties.
// 5. Actually size the pair elements, insert gutters and attach event listeners.
const Split = (ids, options = {}) => {
    let dimension
    let clientAxis
    let position

    const panes = []
    const gutters = []

    // All DOM elements in the split should have a common parent. We can grab
    // the first elements parent and hope users read the docs because the
    // behavior will be whacky otherwise.
    const parent = elementOrSelector(ids[0]).parentNode
    const parentFlexDirection = global.getComputedStyle(parent).flexDirection
    const isReverse = parentFlexDirection === 'row-reverse' || parentFlexDirection === 'column-reverse'

    // Set default options.sizes to equal percentages of the parent pane.
    const sizes = getOption(options, 'sizes') || ids.map(() => 100 / ids.length)

    // Standardize minSize to an array if it isn't already. This allows minSize
    // to be passed as a number.
    const minSize = getOption(options, 'minSize', 100)
    const minSizes = isArray(minSize) ? minSize : ids.map(() => minSize)
    const gutterSize = getOption(options, 'gutterSize', 10)
    const snapOffset = getOption(options, 'snapOffset', 30)
    const pushablePanes = getOption(options, 'pushablePanes', false)
    const direction = getOption(options, 'direction', HORIZONTAL)
    const cursor = getOption(options, 'cursor', direction === HORIZONTAL ? 'ew-resize' : 'ns-resize')
    const gutterCreate = getOption(options, 'gutter', defaultGutterFn)
    const elementStyle = getOption(options, 'elementStyle', defaultElementStyleFn)
    const gutterStyle = getOption(options, 'gutterStyle', defaultGutterStyleFn)

    // 2. Initialize a bunch of strings based on the direction we're splitting.
    // A lot of the behavior in the rest of the library is paramatized down to
    // rely on CSS strings and classes.
    if (direction === HORIZONTAL) {
        dimension = 'width'
        clientAxis = 'clientX'
        position = 'left'
    } else if (direction === 'vertical') {
        dimension = 'height'
        clientAxis = 'clientY'
        position = 'top'
    }

    // const parentBounds = parent[getBoundingClientRect]()

    // 3. Define the dragging helper functions, and a few helpers to go with them.
    // Each helper is bound to a Gutter object that contains its metadata. This
    // also makes it easy to store references to listeners that that will be
    // added and removed.
    //
    // Even though there are no other functions contained in them, aliasing
    // this to self saves 50 bytes or so since it's used so frequently.
    //
    // The Gutter object saves metadata like dragging state, position and
    // event listener references.

    function applyPaneSize ({ el, size, isFirst, isLast }) {
        const gutSize = (isFirst || isLast) ? gutterSize / 2 : gutterSize

        // Split.js allows setting sizes via numbers (ideally), or if you must,
        // by string, like '300px'. This is less than ideal, because it breaks
        // the fluid layout that `calc(% - px)` provides. You're on your own if you do that,
        // make sure you calculate the gutter size by hand.
        const style = elementStyle(dimension, size, gutSize)

        // eslint-disable-next-line no-param-reassign
        Object.keys(style).forEach(prop => {
            el.style[prop] = style[prop]
        })
    }

    function applyGutterSize ({ el, size }) {
        const style = gutterStyle(dimension, size)

        // eslint-disable-next-line no-param-reassign
        Object.keys(style).forEach(prop => {
            el.style[prop] = style[prop]
        })
    }

    function getSizeBetween (start, end) {
        return panes.slice(start, end).reduce(S => S + gutterSize, 0)
    }

    // Actually adjust the size of elements `a` and `b` to `offset` while dragging.
    // calc is used to allow calc(percentage + gutterpx) on the whole split instance,
    // which allows the viewport to be resized without additional logic.
    // Element a's size is the same as offset. b's size is total size - a size.
    // Both sizes are calculated from the initial parent percentage,
    // then the gutter size is subtracted.
    function adjust (offset) {
        const a = panes[this.a]
        const b = panes[this.b]
        const percentage = a.size + b.size

        a.size = (offset / this.size) * percentage
        b.size = (percentage - ((offset / this.size) * percentage))

        applyPaneSize(a)
        applyPaneSize(b)
    }

    // Cache some important sizes when drag starts, so we don't have to do that
    // continously:
    //
    // `size`: The total size of the pair. First pane + second pane + all gutters between.
    // `start`: The leading side of the first pane.
    //
    // ------------------------------------------------
    // |     a.gutterSize -> |||                      |
    // |                     |||                      |
    // |                     |||                      |
    // |                     ||| <- b.gutterSize      |
    // ------------------------------------------------
    // | <- start                             size -> |
    function calculateSizes () {
        const aBounds = panes[this.a].el[getBoundingClientRect]()
        const bBounds = panes[this.b].el[getBoundingClientRect]()
        const allGuttersSize = getSizeBetween(this.a, this.b)

        // Figure out the parent size minus padding.
        this.size = aBounds[dimension] + allGuttersSize + bBounds[dimension]
        this.start = aBounds[position]
    }

    // drag, where all the magic happens. The logic is really quite simple:
    //
    // 1. Ignore if the gutter is not dragging.
    // 2. Get the offset of the event.
    // 3. Snap offset to min if within snappable range (within min + snapOffset).
    // 4. Actually adjust each pane in the pair to offset.
    //
    // ---------------------------------------------------------------------
    // |    | <- a.minSize               ||              b.minSize -> |    |
    // |    |  | <- this.snapOffset      ||     this.snapOffset -> |  |    |
    // |    |  |                         ||                        |  |    |
    // |    |  |                         ||                        |  |    |
    // ---------------------------------------------------------------------
    // | <- this.start                                        this.size -> |
    function drag (e) {
        const g = gutters[this.g]
        let a = panes[this.a]
        let b = panes[this.b]

        if (!g.isDragging) return

        // Get the offset of the event from the first side of the
        // pair `this.start`. Supports touch events, but not multitouch, so only the first
        // finger `touches[0]` is counted.
        const eventOffset = ('touches' in e ? e.touches[0] : e)[clientAxis]
        let pairOffset = eventOffset - this.start

        if (pushablePanes) {
            while (!a.isFirst && eventOffset < (this.start + a.minSize)) {
                this.a -= 1
                calculateSizes.call(this)
                pairOffset = eventOffset - this.start
                a = panes[this.a]
            }

            while (!b.isLast && eventOffset > (this.size - b.minSize)) {
                this.b += 1
                calculateSizes.call(this)
                b = panes[this.b]
            }
        }

        // If within snapOffset of min or max, set offset to min or max.
        // snapOffset buffers a.minSize and b.minSize, so logic is opposite for both.
        // Include the appropriate gutter sizes to prevent overflows.
        if (pairOffset <= a.minSize + snapOffset + gutterSize) {
            pairOffset = a.minSize + gutterSize
        } else if (pairOffset >= this.size - (b.minSize + snapOffset + gutterSize)) {
            pairOffset = this.size - (b.minSize + gutterSize)
        }

        // Actually adjust the dragged pair size.
        adjust.call(this, pairOffset)

        // Call the drag callback continously. Don't do anything too intensive
        // in this callback.
        getOption(options, 'onDrag', NOOP)()
    }

    // stopDragging is very similar to startDragging in reverse.
    function stopDragging () {
        const g = gutters[this.g]
        const a = panes[isReverse ? this.g + 1 : this.g]
        const b = panes[isReverse ? this.g : this.g + 1]

        if (g.isDragging) {
            getOption(options, 'onDragEnd', NOOP)()
        }

        g.isDragging = false

        // Remove the stored event listeners. This is why we store them.
        eventListeners(global, remove, eDragStop, g.stop)
        eventListeners(global, remove, eDragMove, g.move)

        // Clear bound function references
        g.stop = null
        g.move = null
        g.el.style.cursor = ''

        eventListeners([a.el, b.el], remove, eDragStart, NOOP)

        a.el.style[userSelect] = ''
        b.el.style[userSelect] = ''

        parent.style.cursor = ''
        document.body.style.cursor = ''
    }

    // startDragging calls `calculateSizes` to store the inital size in the pair object.
    // It also adds event listeners for mouse/touch events,
    // and prevents selection while dragging so avoid the selecting text.
    function startDragging (e) {
        // Don't actually drag the pane. We emulate that in the drag function.
        e.preventDefault()

        this.a = isReverse ? this.g + 1 : this.g
        this.b = isReverse ? this.g : this.g + 1
        calculateSizes.call(this)

        // Alias frequently used variables to save space. 200 bytes.
        const a = panes[isReverse ? this.b : this.a]
        const b = panes[isReverse ? this.a : this.b]
        const g = gutters[this.g]

        // Call the onDragStart callback.
        if (!g.isDragging) {
            getOption(options, 'onDragStart', NOOP)()
        }
        // Set the dragging property of the pair object.
        g.isDragging = true

        // Create two event listeners bound to the same gutter object and store
        // them in the gutter object.
        g.move = drag.bind(this)
        g.stop = stopDragging.bind(this)
        g.el.style.cursor = cursor

        // All the binding. `window` gets the stop events in case we drag out of the elements.
        eventListeners(global, add, eDragStop, g.stop)
        eventListeners(global, add, eDragMove, g.move)

        eventListeners([a.el, b.el], add, eDragStart, NOOP)

        a.el.style[userSelect] = 'none'
        b.el.style[userSelect] = 'none'

        // Set the cursor at multiple levels
        parent.style.cursor = cursor
        document.body.style.cursor = cursor
    }

    // 5. Create Pane and Gutter objects. Each pair has an index reference to
    // panes `a` and `b` of the pair (first and second panes).
    // Loop through the panes while pairing them off. Every pair gets a
    // `pair` object, a gutter, and isFirst/isLast properties.
    //
    // Basic logic:
    //
    // - Starting with the second pane `i > 0`, create `pair` objects with
    //   `a = i - 1` and `b = i`
    // - Set gutter sizes based on the _pair_ being first/last. The first and last
    //   pair have gutterSize / 2, since they only have one half gutter, and not two.
    // - Create gutter elements and add event listeners.
    // - Set the size of the panes, minus the gutter sizes.
    //
    // -----------------------------------------------------------------------
    // |     i=0     |         i=1         |        i=2       |      i=3     |
    // |             |       isFirst       |                  |     isLast   |
    // |           pair 0                pair 1             pair 2           |
    // |             |                     |                  |              |
    // -----------------------------------------------------------------------
    ids.forEach((id, i) => {
        const isFirstPane = (i === 0)
        const isLastPane = (i === ids.length - 1)

        const pane = {
            // Create the element object.
            i,
            el: elementOrSelector(id),
            minSize: minSizes[i],
            size: sizes[i],

            isFirst: isFirstPane,
            isLast: isLastPane,
            isCollapsed: false,
        }

        // Create gutter elements for each pair, if IE9 and above
        if (!isFirstPane && !isIE8) {
            const gutterIndex = gutters.length
            const gutterElement = gutterCreate(gutterIndex, direction)
            const gutter = {
                i,
                el: gutterElement,
                size: gutterSize,
            }
            applyGutterSize(gutter)

            eventListeners(gutterElement, add, eDragTrigger, startDragging.bind({ g: gutterIndex }))

            parent.insertBefore(gutterElement, pane.el)

            gutters.push(gutter)
        }

        // Determine the size of the current pane. IE8 is supported by
        // staticly assigning sizes without draggable gutters. Assigns a string
        // to `size`.
        applyPaneSize(pane)

        const computedSize = pane.el[getBoundingClientRect]()[dimension]

        if (computedSize < pane.minSize) {
            pane.minSize = computedSize
        }

        applyPaneSize(pane)

        panes.push(pane)
    })

    // function selectPair(a, b) {
    //     // if the parent has a reverse flex-direction, switch the pair elements.
    //     const isReverse = (
    //         parentFlexDirection === 'row-reverse'
    //      || parentFlexDirection === 'column-reverse'
    //     )
    //
    //     const pair = {
    //         a: isReverse ? b : a,
    //         b: isReverse ? a : b,
    //         dragging: false,
    //     }
    //
    //     return pair
    // }

    function setSizes (newSizes) {
        newSizes.forEach((newSize, i) => {
            panes[i].size = newSize
            applyPaneSize(panes[i])
        })
    }

    function destroy () {
        gutters.forEach(g => {
            parent.removeChild(g)
        })
        panes.forEach(p => {
            p.el.style[dimension] = ''
        })
    }

    if (isIE8) {
        return {
            setSizes,
            destroy,
        }
    }

    return {
        setSizes,
        getSizes () {
            return panes.map(pane => pane.size)
        },
        collapse (i) {
            const isLast = i === panes.length - 1

            const pair = {
                g: i,
                a: isLast ? i - 1 : i,
                b: isLast ? i : i + 1,
            }

            calculateSizes.call(pair)

            if (!isIE8) {
                adjust.call(pair, isLast ? pair.size : 0)
            }
        },
        destroy,
        parent,
    }
}

export default Split
