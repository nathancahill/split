
Split = function (ids, options) {
    // Set defaults

    options = typeof options !== 'undefined' ?  options : {};

    if (!options.gutterWidth) options.gutterWidth = 10;
    if (!options.minWidth) options.minWidth = 100;
    if (!options.snapOffset) options.snapOffset = 30;

    // Event listeners for drag events, bound to a pair object.
    // Save the pair's left position and width when dragging starts.
    // Prevent selection on start and re-enable it when done.

    var startDragging = function (e) {
            e.preventDefault();

            this.dragging = true;

            this.width = this.left.clientWidth + this.right.clientWidth + options.gutterWidth;
            this.x = this.left.getBoundingClientRect().left;

            this.left.addEventListener('selectstart', preventSelection);
            this.left.addEventListener('dragstart', preventSelection);
            this.right.addEventListener('selectstart', preventSelection);
            this.right.addEventListener('dragstart', preventSelection);

            this.left.style.userSelect = 'none';
            this.left.style.webkitUserSelect = 'none';
            this.left.style.MozUserSelect = 'none';

            this.right.style.userSelect = 'none';
            this.right.style.webkitUserSelect = 'none';
            this.right.style.MozUserSelect = 'none';

            if (options.onDragStart) {
                options.onDragStart();
            }
        },

        stopDragging = function () {
            this.dragging = false;

            this.left.removeEventListener('selectstart', preventSelection);
            this.left.removeEventListener('dragstart', preventSelection);
            this.right.removeEventListener('selectstart', preventSelection);
            this.right.removeEventListener('dragstart', preventSelection);

            this.left.style.userSelect = '';
            this.left.style.webkitUserSelect = '';
            this.left.style.MozUserSelect = '';

            this.right.style.userSelect = '';
            this.right.style.webkitUserSelect = '';
            this.right.style.MozUserSelect = '';

            if (options.onDragEnd) {
                options.onDragEnd();
            }
        },

        drag = function (e) {
            if (!this.dragging) return;

            // Get the relative position of the event from the left side of the
            // pair.

            var offsetX = e.clientX - this.x;

            // If within snapOffset of min or max, set offset to min or max

            if (offsetX <=  this.leftMin + options.snapOffset) {
                offsetX = this.leftMin;
            } else if (offsetX >= this.width - this.rightMin - options.snapOffset) {
                offsetX = this.width - this.rightMin;
            }

            // Left width is the same as offset. Right width is total width - left width.
	    // The widths are expressed as percents and if there are more than
	    // two columns, the percents will not add up to 100.

	    var sw = this.left.style.width; // style width e.g. "calc(23% - 5px)"
	    var xolp = sw.indexOf("("); // index of left paren
	    var old_left_style_width_percent = sw.substr(xolp+1, sw.indexOf("%")-xolp-1);
	    
	    sw = this.right.style.width;
	    xolp = sw.indexOf("(");
	    var old_right_style_width_percent = sw.substr(xolp+1, sw.indexOf("%")-xolp-1);
	    
	    var total_style_width_percent = Number(old_left_style_width_percent) + Number(old_right_style_width_percent);
	    
	    var new_left_style_width_percent = (offsetX / this.width * 100);
            this.left.style.width	=                                                         new_left_style_width_percent  + '%';
            this.right.style.width	= 'calc(' + (total_style_width_percent - new_left_style_width_percent) + '% - ' + options.gutterWidth + 'px)';

            if (options.onDrag) {
                options.onDrag();
            }
        },

        preventSelection = function () { return false; },

        // Given a list of DOM element ids and a list of percentage widths,
        // assign each element a width allowing for a gutter between each
        // pair. The number of gutters is ids.length - 1, and the total gutter
        // width is gutterWidth * (ids.length - 1). Before calculating
        // each width, subtract the total gutter width for the parent width.

        parent = document.getElementById(ids[0]).parentNode;

    if (!options.widths) {
        var percent = 100 / ids.length;

        options.widths = [];

        for (var i = 0; i < ids.length; i++) {
            options.widths.push(percent);
        };
    }

    if (!Array.isArray(options.minWidth)) {
        var minWidths = [];

        for (var i = 0; i < ids.length; i++) {
            minWidths.push(options.minWidth);
        };

        options.minWidth = minWidths;
    }

    for (var i = 0; i < ids.length; i++) {
        var el = document.getElementById(ids[i]);

        if (i > 0) {
            var pair = {
                    left: document.getElementById(ids[i - 1]),
                    right: el,
                    leftMin: options.minWidth[i - 1],
                    rightMin: options.minWidth[i],
                    dragging: false,
                    parent: parent
                },
                gutter = document.createElement('div');

            gutter.className = 'gutter';
            gutter.style.width = options.gutterWidth + 'px';

            gutter.addEventListener('mousedown', startDragging.bind(pair));

            parent.addEventListener('mouseup', stopDragging.bind(pair));
            parent.addEventListener('mousemove', drag.bind(pair));
            parent.addEventListener('mouseleave', stopDragging.bind(pair));

            parent.insertBefore(gutter, el);

            pair.gutter = gutter;

	    el.style.width = 'calc(' + options.widths[i] + '% - ' + options.gutterWidth + 'px)';
        } else {
	    el.style.width =              options.widths[i] + '%'; // No gutter adjustment for leftmost pane
	}
    }
};

