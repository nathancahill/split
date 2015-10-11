
Split = function (ids, options) {
    // Set defaults

    options = typeof options !== 'undefined' ?  options : {};

    if (!options.gutterSize) options.gutterSize = 10;
    if (!options.minSize) options.minSize = 100;
    if (!options.snapOffset) options.snapOffset = 30;

    // Event listeners for drag events, bound to a pair object.
    // Save the pair's position and size when dragging starts.
    // Prevent selection on start and re-enable it when done.

    var startDragging = function (e) {
            e.preventDefault();

            this.dragging = true;

            // The first and last pairs have 1.5x gutter (1 in the middle and 1/2 on the side).
            // All other pairs have 2x gutter (1 in the middle and 1/2 on each side).
            // Special case for pairs that are first and last (only 1 pair).

            if (this.isFirst && this.isLast) {
                gutterSize = options.gutterSize;
            } else if (this.isFirst || this.isLast) {
                gutterSize = options.gutterSize * 1.5;
            } else {
                gutterSize = options.gutterSize * 2;
            }

            // Calculate the pairs size, and percentage of the parent size

            this.size = this.a.getBoundingClientRect().width + this.b.getBoundingClientRect().width + gutterSize;
            this.percentage = Math.min(this.size / this.parent.clientWidth * 100, 100);

            this.start = this.a.getBoundingClientRect().left;

            this.a.addEventListener('selectstart', preventSelection);
            this.a.addEventListener('dragstart', preventSelection);
            this.b.addEventListener('selectstart', preventSelection);
            this.b.addEventListener('dragstart', preventSelection);

            this.a.style.userSelect = 'none';
            this.a.style.webkitUserSelect = 'none';
            this.a.style.MozUserSelect = 'none';

            this.b.style.userSelect = 'none';
            this.b.style.webkitUserSelect = 'none';
            this.b.style.MozUserSelect = 'none';

            if (options.onDragStart) {
                options.onDragStart();
            }
        },

        stopDragging = function () {
            this.dragging = false;

            this.a.removeEventListener('selectstart', preventSelection);
            this.a.removeEventListener('dragstart', preventSelection);
            this.b.removeEventListener('selectstart', preventSelection);
            this.b.removeEventListener('dragstart', preventSelection);

            this.a.style.userSelect = '';
            this.a.style.webkitUserSelect = '';
            this.a.style.MozUserSelect = '';

            this.b.style.userSelect = '';
            this.b.style.webkitUserSelect = '';
            this.b.style.MozUserSelect = '';

            if (options.onDragEnd) {
                options.onDragEnd();
            }
        },

        drag = function (e) {
            if (!this.dragging) return;

            // Get the relative position of the event from the first side of the
            // pair.

            var offset = e.clientX - this.start;

            // If within snapOffset of min or max, set offset to min or max

            if (offset <=  this.aMin + options.snapOffset) {
                offset = this.aMin;
            } else if (offset >= this.size - this.bMin - options.snapOffset) {
                offset = this.size - this.bMin;
            }

            // For first and last pairs, first and last gutter width is half.

            var aGutterSize = options.gutterSize;
            var bGutterSize = options.gutterSize;

            if (this.isFirst) {
                aGutterSize = options.gutterSize / 2;
            }

            if (this.isLast) {
                bGutterSize = options.gutterSize / 2;
            }

            // A size is the same as offset. B size is total size - A size.
            // Both sizes are calculated from the initial parent percentage.

            this.a.style.width = 'calc(' + (offset / this.size * this.percentage) + '% - ' + aGutterSize + 'px)';
            this.b.style.width = 'calc(' + (this.percentage - (offset / this.size * this.percentage)) + '% - ' + bGutterSize + 'px)';

            if (options.onDrag) {
                options.onDrag();
            }
        },

        preventSelection = function () { return false; },

        // Given a list of DOM element ids and a list of percentage sizes,
        // assign each element a size allowing for a gutter between each
        // pair. The number of gutters is ids.length - 1, and the total gutter
        // size is gutterSize * (ids.length - 1). Before calculating
        // each size, subtract the total gutter size for the parent size.

        parent = document.getElementById(ids[0]).parentNode;

    if (!options.sizes) {
        var percent = 100 / ids.length;

        options.sizes = [];

        for (var i = 0; i < ids.length; i++) {
            options.sizes.push(percent);
        };
    }

    if (!Array.isArray(options.minSize)) {
        var minSizes = [];

        for (var i = 0; i < ids.length; i++) {
            minSizes.push(options.minSize);
        };

        options.minSize = minSizes;
    }

    for (var i = 0; i < ids.length; i++) {
        var el = document.getElementById(ids[i]),
            isFirst = (i == 1),
            isLast = (i == ids.length - 1),
            gutterSize = options.gutterSize;

        if (i > 0) {
            var pair = {
                    a: document.getElementById(ids[i - 1]),
                    b: el,
                    aMin: options.minSize[i - 1],
                    bMin: options.minSize[i],
                    dragging: false,
                    parent: parent,
                    isFirst: isFirst,
                    isLast: isLast
                },
                gutter = document.createElement('div');

            gutter.className = 'gutter';
            gutter.style.width = options.gutterSize + 'px';

            gutter.addEventListener('mousedown', startDragging.bind(pair));

            parent.addEventListener('mouseup', stopDragging.bind(pair));
            parent.addEventListener('mousemove', drag.bind(pair));
            parent.addEventListener('mouseleave', stopDragging.bind(pair));

            parent.insertBefore(gutter, el);

            pair.gutter = gutter;
        }

        if (i == 0 || i == ids.length - 1) {
            gutterSize = options.gutterSize / 2;
        }

        el.style.width = 'calc(' + options.sizes[i] + '% - ' + gutterSize + 'px)';
    }
};
