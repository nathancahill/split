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
var elementOrSelector = function (el) {
    if (isString(el)) {
        return document.querySelector(el)
    }

    return el
};

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
// of elements as an independant pair. Dragging the gutter between two elements
// only changes the dimensions of elements in that pair. This is key to understanding
// how the following functions operate, since each function is bound to a pair.
//
// A pair object is shaped like this:
//
// {
//     a: DOM element,
//     b: DOM element,
//     aMin: Number,
//     bMin: Number,
//     dragging: Boolean,
//     parent: DOM element,
//     isFirst: Boolean,
//     isLast: Boolean,
//     direction: 'horizontal' | 'vertical'
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
    var draggingPair = null;
    var pairs = [];

    // All DOM elements in the split should have a common parent. We can grab
    // the first elements parent and hope users read the docs because the
    // behavior will be whacky otherwise.
    var parent = elementOrSelector(ids[0]).parentNode;
    var parentFlexDirection = global.getComputedStyle(parent).flexDirection;

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
    var gutter = getOption(options, 'gutter', defaultGutterFn);
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
    // Each helper is bound to a pair object that contains its metadata. This
    // also makes it easy to store references to listeners that that will be
    // added and removed.
    //
    // Even though there are no other functions contained in them, aliasing
    // this to self saves 50 bytes or so since it's used so frequently.
    //
    // The pair object saves metadata like dragging state, position and
    // event listener references.

    function applyPaneSize (pane) {
        // Split.js allows setting sizes via numbers (ideally), or if you must,
        // by string, like '300px'. This is less than ideal, because it breaks
        // the fluid layout that `calc(% - px)` provides. You're on your own if you do that,
        // make sure you calculate the gutter size by hand.
        var style = elementStyle(dimension, pane.size, pane.gutterSize);

        // eslint-disable-next-line no-param-reassign
        Object.keys(style).forEach(function (prop) {
            pane.element.style[prop] = style[prop];
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

        applyPaneSize(a, a.gutterSize);
        applyPaneSize(b, b.gutterSize);
    }

    // Cache some important sizes when drag starts, so we don't have to do that
    // continously:
    //
    // `size`: The total size of the pair. First + second + first gutter + second gutter.
    // `start`: The leading side of the first pane.
    //
    // ------------------------------------------------
    // |      aGutterSize -> |||                      |
    // |                     |||                      |
    // |                     |||                      |
    // |                     ||| <- bGutterSize       |
    // ------------------------------------------------
    // | <- start                             size -> |
    function calculateSizes () {
        // Figure out the parent size minus padding.
        var a = panes[this.a];
        var b = panes[this.b];

        var aBounds = a.element[getBoundingClientRect]();
        var bBounds = b.element[getBoundingClientRect]();

        this.size = aBounds[dimension] + bBounds[dimension] + a.gutterSize + b.gutterSize;
        this.start = aBounds[position];
    }

    // drag, where all the magic happens. The logic is really quite simple:
    //
    // 1. Ignore if the pair is not dragging.
    // 2. Get the offset of the event.
    // 3. Snap offset to min if within snappable range (within min + snapOffset).
    // 4. Actually adjust each element in the pair to offset.
    //
    // ---------------------------------------------------------------------
    // |    | <- a.minSize               ||              b.minSize -> |    |
    // |    |  | <- this.snapOffset      ||     this.snapOffset -> |  |    |
    // |    |  |                         ||                        |  |    |
    // |    |  |                         ||                        |  |    |
    // ---------------------------------------------------------------------
    // | <- this.start                                        this.size -> |
    function drag (e) {
        var i = this.pairIndex;
        var pair = Object.assign({}, pairs[i]);

        if (draggingPair === null) { return }

        var a = panes[pair.a];
        var b = panes[pair.b];

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

        if (pushablePanes && pairs.length > 1) {
            var pushedPair;

            if (!pair.isFirst && eventOffset < a.minSize) {
                pushedPair = pairs[this.pairIndex - 1];
                if (!pushedPair.size) { calculateSizes.call(pushedPair); }

                pairOffset += pair.start - pushedPair.start - a.minSize;
                pair.a = pushedPair.a;
            }

            if (!pair.isLast && eventOffset > pair.size - b.minSize) {
                pushedPair = pairs[this.pairIndex + 1];
                if (!pushedPair.size) { calculateSizes.call(pushedPair); }

                pair.b = pushedPair.b;
            }

            calculateSizes.call(pair);
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
        var pair = pairs[this.pairIndex];
        var a = panes[pair.a].element;
        var b = panes[pair.b].element;

        if (draggingPair !== null) {
            getOption(options, 'onDragEnd', NOOP)();
        }

        pair.dragging = false;

        // Remove the stored event listeners. This is why we store them.
        global[removeEventListener]('mouseup', pair.stop);
        global[removeEventListener]('touchend', pair.stop);
        global[removeEventListener]('touchcancel', pair.stop);
        global[removeEventListener]('mousemove', pair.move);
        global[removeEventListener]('touchmove', pair.move);

        // Clear bound function references
        pair.stop = null;
        pair.move = null;

        a[removeEventListener]('selectstart', NOOP);
        a[removeEventListener]('dragstart', NOOP);
        b[removeEventListener]('selectstart', NOOP);
        b[removeEventListener]('dragstart', NOOP);

        a.style.userSelect = '';
        a.style.webkitUserSelect = '';
        a.style.MozUserSelect = '';
        a.style.pointerEvents = '';

        b.style.userSelect = '';
        b.style.webkitUserSelect = '';
        b.style.MozUserSelect = '';
        b.style.pointerEvents = '';

        pair.gutter.style.cursor = '';
        pair.parent.style.cursor = '';
        document.body.style.cursor = '';
    }

    // startDragging calls `calculateSizes` to store the inital size in the pair object.
    // It also adds event listeners for mouse/touch events,
    // and prevents selection while dragging so avoid the selecting text.
    function startDragging (e) {
        // Alias frequently used variables to save space. 200 bytes.
        var pair = pairs[this.pairIndex];
        var a = panes[pair.a].element;
        var b = panes[pair.b].element;

        // Call the onDragStart callback.
        if (draggingPair === null) {
            getOption(options, 'onDragStart', NOOP)();
        }

        // Don't actually drag the pane. We emulate that in the drag function.
        e.preventDefault();

        // Set the dragging property of the pair object.
        draggingPair = pair;

        // Create two event listeners bound to the same pair object and store
        // them in the pair object.
        pair.move = drag.bind(this);
        pair.stop = stopDragging.bind(this);

        // All the binding. `window` gets the stop events in case we drag out of the elements.
        global[addEventListener]('mouseup', pair.stop);
        global[addEventListener]('touchend', pair.stop);
        global[addEventListener]('touchcancel', pair.stop);
        global[addEventListener]('mousemove', pair.move);
        global[addEventListener]('touchmove', pair.move);

        // Disable selection. Disable!
        a[addEventListener]('selectstart', NOOP);
        a[addEventListener]('dragstart', NOOP);
        b[addEventListener]('selectstart', NOOP);
        b[addEventListener]('dragstart', NOOP);

        a.style.userSelect = 'none';
        a.style.webkitUserSelect = 'none';
        a.style.MozUserSelect = 'none';
        a.style.pointerEvents = 'none';

        b.style.userSelect = 'none';
        b.style.webkitUserSelect = 'none';
        b.style.MozUserSelect = 'none';
        b.style.pointerEvents = 'none';

        // Set the cursor at multiple levels
        pair.gutter.style.cursor = cursor;
        pair.parent.style.cursor = cursor;
        document.body.style.cursor = cursor;

        calculateSizes.call(pair);
    }

    // 5. Create pair and pane objects. Each pair has an index reference to
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
        var pane = {
            element: elementOrSelector(id),
            gutterSize: (i === 0 || i === ids.length - 1) ? gutterSize / 2 : gutterSize,
            minSize: minSizes[i],
            size: sizes[i],
        };

        var pair;
        var pairIndex = pairs.length;

        if (i > 0) {
            // Create the pair object with its metadata.
            pair = {
                a: i - 1,
                b: i,
                dragging: false,
                isFirst: (i === 1),
                isLast: (i === ids.length - 1),
                direction: direction,
                parent: parent,
            };

            // if the parent has a reverse flex-direction, switch the pair elements.
            if (parentFlexDirection === 'row-reverse' || parentFlexDirection === 'column-reverse') {
                var temp = pair.a;
                pair.a = pair.b;
                pair.b = temp;
            }
        }

        // Determine the size of the current pane. IE8 is supported by
        // staticly assigning sizes without draggable gutters. Assigns a string
        // to `size`.
        //
        // IE9 and above
        if (!isIE8) {
            // Create gutter elements for each pair.
            if (i > 0) {
                var gutterElement = gutter(i, direction);
                setGutterSize(gutterElement, gutterSize);

                gutterElement[addEventListener]('mousedown', startDragging.bind({ pairIndex: pairIndex }));
                gutterElement[addEventListener]('touchstart', startDragging.bind({ pairIndex: pairIndex }));

                parent.insertBefore(gutterElement, pane.element);

                pair.gutter = gutterElement;
            }
        }

        applyPaneSize(pane);

        var computedSize = pane.element[getBoundingClientRect]()[dimension];

        if (computedSize < pane.minSize) {
            pane.minSize = computedSize;
        }

        // After the first iteration, and we have a pair object, append it to the
        // list of pairs.
        if (i > 0) {
            pairs.push(pair);
        }

        return pane
    });

    function setSizes (newSizes) {
        newSizes.forEach(function (newSize, i) {
            panes[i].size = newSize;
            applyPaneSize(panes[i]);
        });
    }

    function destroy () {
        pairs.forEach(function (pair) {
            pair.parent.removeChild(pair.gutter);
            panes[pair.a].pane.style[dimension] = '';
            panes[pair.b].pane.style[dimension] = '';
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
            if (i === pairs.length) {
                var pair = pairs[i - 1];

                calculateSizes.call(pair);

                if (!isIE8) {
                    adjust.call(pair, pair.size - panes[pair.b].gutterSize);
                }
            } else {
                var pair$1 = pairs[i];

                calculateSizes.call(pair$1);

                if (!isIE8) {
                    adjust.call(pair$1, panes[pair$1.a].gutterSize);
                }
            }
        },
        destroy: destroy,
        parent: parent,
        pairs: pairs,
    }
};

return Split;

})));
