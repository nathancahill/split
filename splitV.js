
SplitV = function (ids, options) {
    // Set defaults

    options = typeof options !== 'undefined' ?  options : {};

    if (!options.gutterHeight) options.gutterHeight = 10;
    if (!options.minHeight) options.minHeight = 50;
    if (!options.snapOffset) options.snapOffset = 30;

    // Event listeners for drag events, bound to a pair object.
    // Save the pair's top position and height when dragging starts.
    // Prevent selection on start and re-enable it when done.

    var startDragging = function (e) {
            e.preventDefault();

            this.dragging = true;

            // The first and last pairs have 1.5x gutter (1 in the middle and 1/2 on the side).
            // All other pairs have 2x gutter (1 in the middle and 1/2 on each side).
            // Special case for pairs that are first and last (only 1 pair).
	    
	    if (this.isFirst && this.isLast) {
		    gutterHeight = options.gutterHeight;
	    } else if (this.isFirst || this.isLast) {
		    gutterHeight = options.gutterHeight * 1.5;
	    } else {
		    gutterHeight = options.gutterHeight * 2;
	    }
	    
	    // Calculate the pairs height and percentage of the parent height

            this.height = this.top.getBoundingClientRect().height + this.bot.getBoundingClientRect().height + gutterHeight;
            this.percentage = Math.min(this.height / this.parent.clientHeight * 100, 100);

            this.y = this.top.getBoundingClientRect().top;

            this.top.addEventListener('selectstart', preventSelection);
            this.top.addEventListener('dragstart', preventSelection);
            this.bot.addEventListener('selectstart', preventSelection);
            this.bot.addEventListener('dragstart', preventSelection);

            this.top.style.userSelect = 'none';
            this.top.style.webkitUserSelect = 'none';
            this.top.style.MozUserSelect = 'none';

            this.bot.style.userSelect = 'none';
            this.bot.style.webkitUserSelect = 'none';
            this.bot.style.MozUserSelect = 'none';

            if (options.onDragStart) {
                options.onDragStart();
            }
        },

        stopDragging = function () {
            this.dragging = false;

            this.top.removeEventListener('selectstart', preventSelection);
            this.top.removeEventListener('dragstart', preventSelection);
            this.bot.removeEventListener('selectstart', preventSelection);
            this.bot.removeEventListener('dragstart', preventSelection);

            this.top.style.userSelect = '';
            this.top.style.webkitUserSelect = '';
            this.top.style.MozUserSelect = '';

            this.bot.style.userSelect = '';
            this.bot.style.webkitUserSelect = '';
            this.bot.style.MozUserSelect = '';

            if (options.onDragEnd) {
                options.onDragEnd();
            }
        },

        drag = function (e) {
            if (!this.dragging) return;

            // Get the relative position of the event from the top side of the pair.

            var offsetY = e.clientY - this.y;

            // If within snapOffset of min or max, set offset to min or max

            if (offsetY <=  this.topMin + options.snapOffset) {
                offsetY = this.topMin;
            } else if (offsetY >= this.height - this.botMin - options.snapOffset) {
                offsetY = this.height - this.botMin;
            }

            // For first and last pairs, top and bottom gutter width is half.
	    
	    var topGutterHeight = options.gutterHeight;
	    var botGutterHeight = options.gutterHeight;
	    
	    if (this.isFirst) {
		    topGutterHeight = options.gutterHeight / 2;
	    }
	    
	    if (this.isLast) {
		    botGutterHeight = options.gutterHeight / 2;
	    }
	    
	    // Top height is the same as offset. Bottom height is total height - top height.
	    // Both heights are calculated from the initial parent percentage.

            this.top.style.height = 'calc(' + (offsetY / this.height * this.percentage) + '% - ' + topGutterHeight + 'px)';
            this.bot.style.height = 'calc(' + (this.percentage - (offsetY / this.height * this.percentage)) + '% - ' + botGutterHeight + 'px)';

	    console.log("this.top.style.height=" + this.top.style.height + " this.bot.style.height=" + this.bot.style.height);
	    
            if (options.onDrag) {
                options.onDrag();
            }
        },

        preventSelection = function () { return false; },

        // Given a list of DOM element ids and a list of percentage heights,
        // assign each element a height allowing for a gutter between each
        // pair. The number of gutters is ids.length - 1, and the total gutter
        // height is gutterHeight * (ids.length - 1). Before calculating
        // each height, subtract the total gutter height for the parent height.

        parent = document.getElementById(ids[0]).parentNode;

    if (!options.heights) {
        var percent = 100 / ids.length;

        options.heights = [];

        for (var i = 0; i < ids.length; i++) {
            options.heights.push(percent);
        };
    }

    if (!Array.isArray(options.minHeight)) {
        var minHeights = [];

        for (var i = 0; i < ids.length; i++) {
            minHeights.push(options.minHeight);
        };

        options.minHeight = minHeights;
    }

    for (var i = 0; i < ids.length; i++) {
        var el = document.getElementById(ids[i]),
	    isFirst = (i == 1),
	    isLast = (i == ids.length - 1),
	    gutterHeight = options.gutterHeight;

        if (i > 0) {
            var pair = {
                    top: document.getElementById(ids[i - 1]),
                    bot: el,
                    topMin: options.minHeight[i - 1],
                    botMin: options.minHeight[i],
                    dragging: false,
                    parent: parent,
		    isFirst: isFirst,
		    isLast: isLast
                },
                gutter = document.createElement('div');

            gutter.className = 'vgutter';
            gutter.style.height = options.gutterHeight + 'px';
            gutter.style.width = "100%"; // ?or? el.getBoundingClientRect().width + 'px';

            gutter.addEventListener('mousedown', startDragging.bind(pair));

            parent.addEventListener('mouseup', stopDragging.bind(pair));
            parent.addEventListener('mousemove', drag.bind(pair));
            parent.addEventListener('mouseleave', stopDragging.bind(pair));

            parent.insertBefore(gutter, el);

            pair.gutter = gutter;
        }
	
	if (i == 0 || i == ids.length - 1) {
		gutterHeight = options.gutterHeight / 2;
	}

        el.style.height = 'calc(' + options.heights[i] + '% - ' + gutterHeight + 'px)';
    }
};
