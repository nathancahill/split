/*! Split.js - v1.3.5 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Split = factory());
}(this, (function () { 'use strict';

// The programming goals of Split.js are to deliver readable, understandable and
// maintainable code, while at the same time manually optimizing for tiny minified file size,
// browser compatibility without additional requirements, graceful fallback (IE8 is supported)
// and very few assumptions about the user's page layout.
var global = window;
var document = global.document;

// Save a couple long function names that are used frequently.
// This optimization saves around 400 bytes.
var addEventListener = 'addEventListener';
var removeEventListener = 'removeEventListener';
var getBoundingClientRect = 'getBoundingClientRect';
var HORIZONTAL = 'horizontal';
var NOOP = function () { return false; };

// Figure out if we're in IE8 or not. IE8 will still render correctly,
// but will be static instead of draggable.
var isIE8 = global.attachEvent && !global[addEventListener];

// Helper function determines which prefixes of CSS calc we need.
// We only need to do this once on startup, when this anonymous function is called.
//
// Tests -webkit, -moz and -o prefixes. Modified from StackOverflow:
// http://stackoverflow.com/questions/16625140/js-feature-detection-to-detect-the-usage-of-webkit-calc-over-calc/16625167#16625167
var calc = (['', '-webkit-', '-moz-', '-o-'].filter(function (prefix) {
    var el = document.createElement('div');
    el.style.cssText = "width:" + prefix + "calc(9px)";

    return (!!el.style.length)
}).shift()) + "calc";

// Helper function checks if its argument is a string-like type
var isString = function (v) { return (typeof v === 'string' || v instanceof String); };

// Helper function allows elements and string selectors to be used
// interchangeably. In either case an element is returned. This allows us to
// do `Split([elem1, elem2])` as well as `Split(['#id1', '#id2'])`.
var elementOrSelector = function (el) { return (isString(el) ? document.querySelector(el) : el); };

// Helper function gets a property from the properties object, with a default fallback
var getOption = function (options, propName, def) {
    var value = options[propName];
    if (value !== undefined) {
        return value
    }
    return def
};

// Default options
var defaultGutterFn = function (i, gutterDirection) {
    var gut = document.createElement('div');
    gut.className = "gutter gutter-" + gutterDirection;
    return gut
};

var defaultElementStyleFn = function (dim, size, gutSize) {
    var style = {};

    if (!isString(size)) {
        if (!isIE8) {
            style[dim] = calc + "(" + size + "% - " + gutSize + "px)";
        } else {
            style[dim] = size + "%";
        }
    } else {
        style[dim] = size;
    }

    return style
};

var defaultGutterStyleFn = function (dim, gutSize) { return (( obj = {}, obj[dim] = (gutSize + "px"), obj ))
    var obj; };

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
//     d: Number ( dragging Gutter index)
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
var Split = function (ids, options) {
    if ( options === void 0 ) options = {};

    var dimension;
    var clientAxis;
    var position;
    var panes;
    var gutters = [];
    var draggingGutter = null;

    // All DOM elements in the split should have a common parent. We can grab
    // the first elements parent and hope users read the docs because the
    // behavior will be whacky otherwise.
    var parent = elementOrSelector(ids[0]).parentNode;
    // const parentFlexDirection = global.getComputedStyle(parent).flexDirection

    // Set default options.sizes to equal percentages of the parent pane.
    var sizes = getOption(options, 'sizes') || ids.map(function () { return 100 / ids.length; });

    // Standardize minSize to an array if it isn't already. This allows minSize
    // to be passed as a number.
    var minSize = getOption(options, 'minSize', 100);
    var minSizes = Array.isArray(minSize) ? minSize : ids.map(function () { return minSize; });
    var gutterSize = getOption(options, 'gutterSize', 10);
    var snapOffset = getOption(options, 'snapOffset', 30);
    var pushablePanes = getOption(options, 'pushablePanes', false);
    var direction = getOption(options, 'direction', HORIZONTAL);
    var cursor = getOption(options, 'cursor', direction === HORIZONTAL ? 'ew-resize' : 'ns-resize');
    var gutterCreate = getOption(options, 'gutter', defaultGutterFn);
    var elementStyle = getOption(options, 'elementStyle', defaultElementStyleFn);
    var gutterStyle = getOption(options, 'gutterStyle', defaultGutterStyleFn);

    // 2. Initialize a bunch of strings based on the direction we're splitting.
    // A lot of the behavior in the rest of the library is paramatized down to
    // rely on CSS strings and classes.
    if (direction === HORIZONTAL) {
        dimension = 'width';
        clientAxis = 'clientX';
        position = 'left';
    } else if (direction === 'vertical') {
        dimension = 'height';
        clientAxis = 'clientY';
        position = 'top';
    }

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

    function applyPaneSize (ref) {
        var el = ref.el;
        var size = ref.size;
        var isFirst = ref.isFirst;
        var isLast = ref.isLast;

        var gutSize = isFirst || isLast ? gutterSize / 2 : gutterSize;
        // Split.js allows setting sizes via numbers (ideally), or if you must,
        // by string, like '300px'. This is less than ideal, because it breaks
        // the fluid layout that `calc(% - px)` provides. You're on your own if you do that,
        // make sure you calculate the gutter size by hand.
        var style = elementStyle(dimension, size, gutSize);

        // eslint-disable-next-line no-param-reassign
        Object.keys(style).forEach(function (prop) {
            el.style[prop] = style[prop];
        });
    }

    function setGutterSize (gutterElement, gutSize) {
        var style = gutterStyle(dimension, gutSize);

        // eslint-disable-next-line no-param-reassign
        Object.keys(style).forEach(function (prop) {
            gutterElement.style[prop] = style[prop];
        });
    }

    // Actually adjust the size of elements `a` and `b` to `offset` while dragging.
    // calc is used to allow calc(percentage + gutterpx) on the whole split instance,
    // which allows the viewport to be resized without additional logic.
    // Element a's size is the same as offset. b's size is total size - a size.
    // Both sizes are calculated from the initial parent percentage,
    // then the gutter size is subtracted.
    function adjust (offset) {
        var a = panes[this.a];
        var b = panes[this.b];
        var percentage = a.size + b.size;

        a.size = (offset / this.size) * percentage;
        b.size = (percentage - ((offset / this.size) * percentage));

        applyPaneSize(a);
        applyPaneSize(b);
    }

    // Cache some important sizes when drag starts, so we don't have to do that
    // continously:
    //
    // `size`: The total size of the pair. First + second + first gutter + second gutter.
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
        // Figure out the parent size minus padding.
        var a = panes[this.a];
        var b = panes[this.b];
        var gutWidth = gutters.slice(this.a, this.b).reduce(function (S, ref) {
            var size = ref.size;

            return S + size;
        }, 0);

        var aBounds = a.el[getBoundingClientRect]();
        var bBounds = b.el[getBoundingClientRect]();

        this.size = aBounds[dimension] + bBounds[dimension] + gutWidth;
        this.start = aBounds[position];
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
        var pair = {
            a: this.gutterIndex,
            b: this.gutterIndex + 1,
        };
        var a = panes[pair.a];
        var b = panes[pair.b];

        if (draggingGutter === null) { return }

        var eventOffset;
        // Get the offset of the event from the first side of the
        // pair `this.start`. Supports touch events, but not multitouch, so only the first
        // finger `touches[0]` is counted.
        if ('touches' in e) {
            eventOffset = e.touches[0][clientAxis] - pair.start;
        } else {
            eventOffset = e[clientAxis] - pair.start;
        }

        var pairOffset = eventOffset;

        if (pushablePanes) {
            var pushedPair;

            while (!a.isFirst && eventOffset < (a.start + a.minSize)) {
                pair.a -= 1;
                if (!pushedPair.size) { calculateSizes.call(pushedPair); }
                pairOffset += pair.start - pushedPair.start - a.minSize;
            }

            while (!b.isLast && eventOffset > (pair.size - b.minSize)) {
                pair.b += 1;
                if (!pushedPair.size) { calculateSizes.call(pushedPair); }
            }

            calculateSizes.call(pair);

            a = panes[pair.a];
            b = panes[pair.b];
        }

        // If within snapOffset of min or max, set offset to min or max.
        // snapOffset buffers a.minSize and b.minSize, so logic is opposite for both.
        // Include the appropriate gutter sizes to prevent overflows.
        if (pairOffset <= a.minSize + snapOffset + panes[pair.a].gutterSize) {
            pairOffset = a.minSize + panes[pair.a].gutterSize;
        } else if (pairOffset >= pair.size - (b.minSize + snapOffset + panes[pair.b].gutterSize)) {
            pairOffset = pair.size - (b.minSize + panes[pair.b].gutterSize);
        }

        // Actually adjust the dragged pair size.
        adjust.call(pair, pairOffset);

        // Call the drag callback continously. Don't do anything too intensive
        // in this callback.
        getOption(options, 'onDrag', NOOP)();
    }

    // stopDragging is very similar to startDragging in reverse.
    function stopDragging () {
        var gutter = gutters[this.gutterIndex];
        var a = panes[this.gutterIndex];
        var b = panes[this.gutterIndex + 1];

        if (draggingGutter !== null) {
            getOption(options, 'onDragEnd', NOOP)();
        }

        gutter.isDragging = false;

        // Remove the stored event listeners. This is why we store them.
        global[removeEventListener]('mouseup', gutter.stop);
        global[removeEventListener]('touchend', gutter.stop);
        global[removeEventListener]('touchcancel', gutter.stop);
        global[removeEventListener]('mousemove', gutter.move);
        global[removeEventListener]('touchmove', gutter.move);

        // Clear bound function references
        gutter.stop = null;
        gutter.move = null;

        a.el[removeEventListener]('selectstart', NOOP);
        a.el[removeEventListener]('dragstart', NOOP);
        b.el[removeEventListener]('selectstart', NOOP);
        b.el[removeEventListener]('dragstart', NOOP);

        a.el.style.userSelect = '';
        a.el.style.webkitUserSelect = '';
        a.el.style.MozUserSelect = '';
        a.el.style.pointerEvents = '';

        b.el.style.userSelect = '';
        b.el.style.webkitUserSelect = '';
        b.el.style.MozUserSelect = '';
        b.el.style.pointerEvents = '';

        gutter.el.style.cursor = '';
        parent.style.cursor = '';
        document.body.style.cursor = '';
    }

    // startDragging calls `calculateSizes` to store the inital size in the pair object.
    // It also adds event listeners for mouse/touch events,
    // and prevents selection while dragging so avoid the selecting text.
    function startDragging (e) {
        // Alias frequently used variables to save space. 200 bytes.
        var gutter = gutters[this.gutterIndex];
        var a = panes[this.gutterIndex];
        var b = panes[this.gutterIndex + 1];

        // Call the onDragStart callback.
        if (draggingGutter === null) {
            getOption(options, 'onDragStart', NOOP)();
        }

        // Don't actually drag the pane. We emulate that in the drag function.
        e.preventDefault();

        // Set the dragging property of the pair object.
        draggingGutter = gutter;

        // Create two event listeners bound to the same gutter object and store
        // them in the gutter object.
        gutter.move = drag.bind(this);
        gutter.stop = stopDragging.bind(this);

        // All the binding. `window` gets the stop events in case we drag out of the elements.
        global[addEventListener]('mouseup', gutter.stop);
        global[addEventListener]('touchend', gutter.stop);
        global[addEventListener]('touchcancel', gutter.stop);
        global[addEventListener]('mousemove', gutter.move);
        global[addEventListener]('touchmove', gutter.move);

        // Disable selection. Disable!
        a.el[addEventListener]('selectstart', NOOP);
        a.el[addEventListener]('dragstart', NOOP);
        b.el[addEventListener]('selectstart', NOOP);
        b.el[addEventListener]('dragstart', NOOP);

        a.el.style.userSelect = 'none';
        a.el.style.webkitUserSelect = 'none';
        a.el.style.MozUserSelect = 'none';
        a.el.style.pointerEvents = 'none';

        b.el.style.userSelect = 'none';
        b.el.style.webkitUserSelect = 'none';
        b.el.style.MozUserSelect = 'none';
        b.el.style.pointerEvents = 'none';

        // Set the cursor at multiple levels
        gutter.el.style.cursor = cursor;
        parent.style.cursor = cursor;
        document.body.style.cursor = cursor;

        calculateSizes.call(gutter);
    }

    // 5. Create pair from pane objects. Each pair has an index reference to
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
    panes = ids.map(function (id, i) {
        // Create the element object.

        var isFirstPane = (i === 0);
        var isLastPane = (i === ids.length - 1);

        var pane = {
            el: elementOrSelector(id),
            minSize: minSizes[i],
            size: sizes[i],
            isFirst: isFirstPane,
            isLast: isLastPane,
            isCollapsed: false,
        };

        // Determine the size of the current pane. IE8 is supported by
        // staticly assigning sizes without draggable gutters. Assigns a string
        // to `size`.
        //
        // Create gutter elements for each pair, if IE9 and above
        if (i > 0 && !isIE8) {
            var gutterIndex = gutters.length;
            var gutterElement = gutterCreate(gutterIndex, direction);
            setGutterSize(gutterElement, gutterSize);

            gutterElement[addEventListener]('mousedown', startDragging.bind({ gutterIndex: gutterIndex }));
            gutterElement[addEventListener]('touchstart', startDragging.bind({ gutterIndex: gutterIndex }));

            parent.insertBefore(gutterElement, pane.el);

            gutters.push({
                el: gutterElement,
            });
        }

        applyPaneSize(pane);

        var computedSize = pane.el[getBoundingClientRect]()[dimension];

        if (computedSize < pane.minSize) {
            pane.minSize = computedSize;
        }

        return pane
    });

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
        newSizes.forEach(function (newSize, i) {
            panes[i].size = newSize;
            applyPaneSize(panes[i]);
        });
    }

    function destroy () {
        gutters.forEach(function (g) {
            parent.removeChild(g);
        });
        panes.forEach(function (p) {
            p.el.style[dimension] = '';
        });
    }

    if (isIE8) {
        return {
            setSizes: setSizes,
            destroy: destroy,
        }
    }

    return {
        setSizes: setSizes,
        getSizes: function getSizes () {
            return panes.map(function (pane) { return pane.size; })
        },
        collapse: function collapse (i) {
            var pair = {
                a: i === panes.length ? i - 1 : i,
                b: i === panes.length ? i : i + 1,
            };

            calculateSizes.call(pair);

            if (!isIE8) {
                adjust.call(pair);
            }
        },
        destroy: destroy,
        parent: parent,
    }
};

return Split;

})));
//# sourceMappingURL=split.js.map
