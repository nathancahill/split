<p align="center">
<img alt="Split.js" title="Split.js" src="https://rawcdn.githack.com/nathancahill/split/df1873f0c74d2da60f42e1774040651d6191b9bb/packages/splitjs/logo.svg?sanitize=true" width="430">
<br><br>
<a href="https://circleci.com/gh/nathancahill/split"><img src="https://img.shields.io/circleci/project/github/nathancahill/split/master.svg" alt="Build Status"></a>
<img src="https://img.badgesize.io/https://unpkg.com/split.js/dist/split.min.js?compression=gzip&label=size&v=1.6.0" alt="File Size">
<img src="https://badge.fury.io/js/split.js.svg" alt="npm version">
<img src="https://img.shields.io/badge/dependencies-0-brightgreen" alt="Dependencies">
<img src = "https://opencollective.com/splitjs/backers/badge.svg" alt="Backers on Open Collective"/>
<img src = "https://opencollective.com/splitjs/sponsors/badge.svg" alt="Sponsors on Open Collective"/>
</p>

# Split.js

> 2kb unopinionated utility for resizeable split views.

-   **Zero Deps**
-   **Tiny:** Weights 2kb gzipped.
-   **Fast:** No overhead or attached window event listeners, uses pure CSS for resizing.
-   **Unopinionated:** Plays nicely with `float`, `flex` and other layouts.
-   **Compatible:** Works great in IE9, early Firefox/Chrome/Safari/Opera supported too.

## Table of Contents

-   [Installation](#installation)
-   [Documentation](#documentation)
-   [Important Note](#important-note)
-   [Options](#options)
-   [Examples](#usage-examples)
-   [Saving State](#saving-state)
-   [Flexbox](#flex-layout)
-   [API](#api)
-   [CSS](#css)
-   [React](#react)
-   [Browser Support](#browser-support)
-   [Credits](#credits)
-   [License](#license)

## Installation

Yarn:

```bash
$ yarn add split.js
```

npm:

```bash
$ npm install --save split.js
```

Include with a module bundler like [rollup](http://rollupjs.org/) or [webpack](https://webpack.github.io/):

```js
// using ES6 modules
import Split from 'split.js'

// using CommonJS modules
var Split = require('split.js')
```

The [UMD](https://github.com/umdjs/umd) build is also available on [unpkg](http://unpkg.com/):

```html
<script src="https://unpkg.com/split.js/dist/split.min.js"></script>
```

or [cdnjs](https://cdnjs.com/):

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/split.js/1.6.5/split.min.js"></script>
```

You can find the library on `window.Split`.

## Documentation

```js
var split = Split(<HTMLElement|selector[]> elements, <options> options?)
```

| Options        | Type            | Default        | Description                                              |
| -------------- | --------------- | -------------- | -------------------------------------------------------- |
| `sizes`        | Array           |                | Initial sizes of each element in percents or CSS values. |
| `minSize`      | Number or Array | `100`          | Minimum size of each element.                            |
| `maxSize`      | Number or Array | `Infinity`     | Maximum size of each element.                            |
| `expandToMin`  | Boolean         | `false`        | Grow initial sizes to `minSize`                          |
| `gutterSize`   | Number          | `10`           | Gutter size in pixels.                                   |
| `gutterAlign`  | String          | `'center'`     | Gutter alignment between elements.                       |
| `snapOffset`   | Number          | `30`           | Snap to minimum size offset in pixels.                   |
| `dragInterval` | Number          | `1`            | Number of pixels to drag.                                |
| `direction`    | String          | `'horizontal'` | Direction to split: horizontal or vertical.              |
| `cursor`       | String          | `'col-resize'` | Cursor to display while dragging.                        |
| `gutter`       | Function        |                | Called to create each gutter element                     |
| `elementStyle` | Function        |                | Called to set the style of each element.                 |
| `gutterStyle`  | Function        |                | Called to set the style of the gutter.                   |
| `onDrag`       | Function        |                | Callback on drag.                                        |
| `onDragStart`  | Function        |                | Callback on drag start.                                  |
| `onDragEnd`    | Function        |                | Callback on drag end.                                    |

## Important Note

Split.js does not set CSS beyond the minimum needed to manage the width or height of the elements.
This is by design. It makes Split.js flexible and useful in many different situations.
If you create a horizontal split, you are responsible for (likely) floating the elements and the gutter,
and setting their heights. See the [CSS](#css) section below. If your gutters are not showing up, check the applied CSS styles.

**THIS IS THE #1 QUESTION ABOUT THE LIBRARY**.

## Options

#### sizes

An array of initial sizes of the elements, specified as percentage values. Example: Setting the initial sizes to `25%` and `75%`.

```js
Split(['#one', '#two'], {
    sizes: [25, 75],
})
```

#### minSize. Default: `100`

An array of minimum sizes of the elements, specified as pixel values. Example: Setting the minimum sizes to `100px` and `300px`, respectively.

```js
Split(['#one', '#two'], {
    minSize: [100, 300],
})
```

#### maxSize. Default: `Infinity`

An array of maximum sizes of the elements, specified as pixel values. Example: Setting the maximum sizes of the first element to `500px`, and not setting a maximum size on the second element.

```js
Split(['#one', '#two'], {
    maxSize: [500, Infinity],
})
```

If a number is passed instead of an array, all elements are set to the same minimum size:

```js
Split(['#one', '#two'], {
    minSize: 100,
    maxSize: 500,
})
```

#### expandToMin. Default: `false`

When the split is created, if `expandToMin` is `true`, the minSize for each element overrides the percentage value from the `sizes` option.
Example: The first element (`#one`) is set to 25% width of the parent container. However, it's `minSize` is `300px`. Using `expandToMin: true` means that
the first element will always load at at least `300px`, even if `25%` were smaller.

```js
Split(['#one', '#two'], {
    sizes: [25, 75],
    minSize: [300, 100],
    expandToMin: true,
})
```

#### gutterSize. Default: `10`

Gutter size in pixels. Example: Setting the gutter size to `20px`.

```js
Split(['#one', '#two'], {
    gutterSize: 20,
})
```

#### gutterAlign. Default: `'center'`

Possible options are `'start'`, `'end'` and `'center'`. Determines how the gutter aligns between the two elements.
`'start'` shrinks the first element to fit the gutter, `'end'` shrinks the second element to fit the gutter and `'center'` shrinks both
elements by the same amount so the gutter sits between. Added in v1.5.3.

Example: move gutter to the side of the second element:

```js
Split(['#one', '#two'], {
    gutterAlign: 'end',
})
```

#### snapOffset. Default: `30`

Snap to minimum size at this offset in pixels. Example: Set to `0` to disable to snap effect.

```js
Split(['#one', '#two'], {
    snapOffset: 0,
})
```

#### dragInterval. Default: `1`

Drag this number of pixels at a time. Defaults to `1` for smooth dragging, but can be set to a pixel value to
give more control over the resulting sizes. Works particularly well when the `gutterSize` is set to the same size.
Added in v1.5.3. Example: Drag 20px at a time:

```js
Split(['#one', '#two'], {
    dragInterval: 20,
})
```

#### direction. Default: `'horizontal'`

Direction to split in. Can be `'vertical'` or `'horizontal'`. Determines which CSS properties are applied (ie. width/height) to each element and gutter. Example: split vertically:

```js
Split(['#one', '#two'], {
    direction: 'vertical',
})
```

#### cursor. Default: `'col-resize'`

Cursor to show on the gutter (also applied to the body on dragging to prevent flickering). Defaults to `'col-resize'`for `direction: 'horizontal'` and `'row-resize'` for `direction: 'vertical'`:

```js
Split(['#one', '#two'], {
    direction: 'vertical',
    cursor: 'row-resize',
})
```

#### gutter

Optional function called to create each gutter element. The signature looks like this:

```js
(index, direction, pairElement) => HTMLElement
```

Defaults to creating a `div` with `class="gutter gutter-horizontal"` or `class="gutter gutter-vertical"`, depending on the direction. The default gutter function looks like this:

```js
(index, direction) => {
    const gutter = document.createElement('div')
    gutter.className = `gutter gutter-${direction}`
    return gutter
}
```

The returned element is then inserted into the DOM, and it's width or height are set. This option can be used to clone an existing DOM element, or to create a new element with custom styles.

Returning a falsey value like `null` or `false` will not insert a gutter. This behavior was added in v1.4.1.
An additional argument, `pairElement`, is passed to the gutter function: this is the DOM element after (to the right or below) the gutter. This argument was added in v1.4.1.

This final argument makes it easy to return the gutter that has already been created, for example, if `split.destroy()` was called with the option to preserve the gutters.

```js
(index, direction, pairElement) => pairElement.previousSibling
```

#### elementStyle

Optional function called setting the CSS style of the elements. The signature looks like this:

```js
(dimension, elementSize, gutterSize, index) => Object
```

Dimension will be a string, `'width'` or `'height'`, and can be used in the return style. `elementSize` is the target percentage value of the element, and `gutterSize` is the target pixel value of the gutter.

It should return an object with CSS properties to apply to the element. For horizontal splits, the return object looks like this:

```js
{
    'width': 'calc(50% - 5px)'
}
```

A vertical split style would look like this:

```js
{
    'height': 'calc(50% - 5px)'
}
```

You might use this function if you're using a different layout like flex (see [Flex Layout](#flex-layout)).
Flex styles for a horizontal split could return an object like this:

```js
{
    'flex-basis': 'calc(50% - 5px)'
}
```

#### gutterStyle

Optional function called when setting the CSS style of the gutters. The signature looks like this:

```js
(dimension, gutterSize, index) => Object
```

Dimension is a string, either `'width'` or `'height'`, and `gutterSize` is a pixel value representing the width of the gutter.

It should return a similar object as `elementStyle`, an object with CSS properties to apply to the gutter. Since gutters have fixed widths, it will generally look like this:

```js
{
    'width': '10px'
}
```

Both `elementStyle` and `gutterStyle` are called continously while dragging, so don't do anything besides return the style object in these functions. Both of these functions should be _pure_, returning the same values for the same inputs and not modifying any external state.

#### onDrag, onDragStart, onDragEnd

Callbacks that can be added on drag (fired continously), drag start and drag end. If doing more than basic operations in `onDrag`, add a debounce function to rate limit the callback.

`onDrag`, `onDragStart` and `onDragEnd` are passed the initial and final sizes of the split since it's a common pattern to access the sizes this way.

Their function signature looks like this, where `sizes` is an array of percentage values like returned by `getSizes()`:

```js
sizes => {}
```

## Usage Examples

Reference HTML for examples. Gutters are inserted automatically:

```html
<div>
    <div id="one">content one</div>
    <div id="two">content two</div>
    <div id="three">content three</div>
</div>
```

A split with two elements, starting at `25%` and `75%` wide, with `200px` minimum width.

```js
Split(['#one', '#two'], {
    sizes: [25, 75],
    minSize: 200,
})
```

A split with three elements, starting with even (default) widths and minimum widths set to `100px`, `100px` and `300px`, respectively.

```js
Split(['#one', '#two', '#three'], {
    minSize: [100, 100, 300],
})
```

A vertical split with two elements.

```js
Split(['#one', '#two'], {
    direction: 'vertical',
})
```

## Saving State

Use local storage to save the most recent state:

```js
var sizes = localStorage.getItem('split-sizes')

if (sizes) {
    sizes = JSON.parse(sizes)
} else {
    sizes = [50, 50] // default sizes
}

var split = Split(['#one', '#two'], {
    sizes: sizes,
    onDragEnd: function (sizes) {
        localStorage.setItem('split-sizes', JSON.stringify(sizes))
    },
})
```

## Flex Layout

Flex layout is supported easily by adding a `display: flex` to the parent element. The `width` or `height` CSS values
assigned by default by Split.js work well with flex.

```html
<div id="flex">
    <div id="flex-1"></div>
    <div id="flex-2"></div>
</div>
```

And CSS style like this:

```css
#flex {
    display: flex;
    flex-direction: row;
}
```

For more complicated flex layouts, the `elementStyle` and `gutterStyle` can be used to set flex-basis:

```js
Split(['#flex-1', '#flex-2'], {
    elementStyle: function (dimension, size, gutterSize) {
        return {
            'flex-basis': 'calc(' + size + '% - ' + gutterSize + 'px)',
        }
    },
    gutterStyle: function (dimension, gutterSize) {
        return {
            'flex-basis': gutterSize + 'px',
        }
    },
})
```

## API

Split.js returns an instance with a couple of functions. The instance is returned on creation:

```js
var instance = Split([], ...)
```

#### `.setSizes([])`

setSizes behaves the same as the `sizes` configuration option, passing an array of percentages. It updates the sizes of the elements in the split. Added in v1.1.0:

```js
instance.setSizes([25, 75])
```

#### `.getSizes()`

getSizes returns an array of percents, suitable for using with `setSizes` or creation. Not supported in IE8. Added in v1.1.2:

```js
instance.getSizes() > [25, 75]
```

#### `.collapse(index)`

collapse changes the size of element at `index` to it's `minSize`. Every element except the last is collapsed towards the front (left or top). The last is collapsed towards the back. Not supported in IE8. Added in v1.1.0:

```js
instance.collapse(0)
```

#### `.destroy(preserveStyles? = false, preserveGutters? = false)`

Destroy the instance. It removes the gutter elements, and the size CSS styles Split.js set. Added in v1.1.1.
Passing `preserveStyles = true` does not remove the CSS styles. Option added in v1.4.0.
Passing `preserveGutters = true` does not remove the gutter elements. Option added in v1.4.1.

```js
instance.destroy()
```

## CSS

In being non-opionionated, the only CSS Split.js sets is the widths or heights of the elements. Everything else is left up to you. You must set the elements and gutter heights when using horizontal mode. The gutters will not be visible if their height is 0px. Here's some basic CSS to style the gutters with, although it's not required. Both grip images are included in this repo:

```css
.gutter {
    background-color: #eee;

    background-repeat: no-repeat;
    background-position: 50%;
}

.gutter.gutter-horizontal {
    background-image: url('grips/vertical.png');
    cursor: col-resize;
}

.gutter.gutter-vertical {
    background-image: url('grips/horizontal.png');
    cursor: row-resize;
}
```

The grip images are small files and can be included with base64 instead:

```css
.gutter.gutter-vertical {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
}

.gutter.gutter-horizontal {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
}
```

Split.js also works best when the elements are sized using `border-box`. The `split` class would have to be added manually to apply these styles:

```css
.split {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}
```

And for horizontal splits, make sure the layout allows elements (including gutters) to be displayed side-by-side. Floating the elements is one option:

```css
.split,
.gutter.gutter-horizontal {
    float: left;
}
```

If you use floats, set the height of the elements including the gutters. The gutters will not be visible otherwise if the height is set to 0px.

```css
.split,
.gutter.gutter-horizontal {
    height: 300px;
}
```

Overflow can be handled as well, to get scrolling within the elements:

```css
.split {
    overflow-y: auto;
    overflow-x: hidden;
}
```

## React

**[React Split](https://github.com/nathancahill/split/tree/master/packages/react-split)** - Thin wrapper component for Split.js.

## Browser Support

This library uses [CSS calc()](https://developer.mozilla.org/en-US/docs/Web/CSS/calc#AutoCompatibilityTable), [CSS box-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing#AutoCompatibilityTable) and [JS getBoundingClientRect()](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect#AutoCompatibilityTable). These features are supported in the following browsers:

| <img src="http://i.imgur.com/dJC1GUv.png" width="48px" height="48px" alt="Chrome logo"> | <img src="http://i.imgur.com/o1m5RcQ.png" width="48px" height="48px" alt="Firefox logo"> | <img src="http://i.imgur.com/8h3iz5H.png" width="48px" height="48px" alt="Internet Explorer logo"> | <img src="http://i.imgur.com/iQV4nmJ.png" width="48px" height="48px" alt="Opera logo"> | <img src="http://i.imgur.com/j3tgNKJ.png" width="48px" height="48px" alt="Safari logo"> | [<img src="https://i.imgur.com/29eVTCg.png" height="28px" alt="Sauce Labs">](https://saucelabs.com) |
| :-------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------- |
|                                          22+ ✔                                          |                                           6+ ✔                                           |                                                9+ ✔                                                |                                         15+ ✔                                          |                                         6.2+ ✔                                          | Sponsored ✔                                                                                         |

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs](https://saucelabs.com).

## Credits

### Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="graphs/contributors"><img src="https://opencollective.com/splitjs/contributors.svg?width=890&button=false" /></a>

### Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/splitjs#backer)]

<a href="https://opencollective.com/splitjs#backers" target="_blank"><img src="https://opencollective.com/splitjs/backers.svg?width=890"></a>

### Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/splitjs#sponsor)]

[<img src="https://i.imgur.com/29eVTCg.png" height="28px" alt="Sauce Labs">](https://saucelabs.com)

<a href="https://opencollective.com/splitjs/sponsor/0/website" target="_blank"><img src="https://opencollective.com/splitjs/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/splitjs/sponsor/1/website" target="_blank"><img src="https://opencollective.com/splitjs/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/splitjs/sponsor/2/website" target="_blank"><img src="https://opencollective.com/splitjs/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/splitjs/sponsor/3/website" target="_blank"><img src="https://opencollective.com/splitjs/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/splitjs/sponsor/4/website" target="_blank"><img src="https://opencollective.com/splitjs/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/splitjs/sponsor/5/website" target="_blank"><img src="https://opencollective.com/splitjs/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/splitjs/sponsor/6/website" target="_blank"><img src="https://opencollective.com/splitjs/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/splitjs/sponsor/7/website" target="_blank"><img src="https://opencollective.com/splitjs/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/splitjs/sponsor/8/website" target="_blank"><img src="https://opencollective.com/splitjs/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/splitjs/sponsor/9/website" target="_blank"><img src="https://opencollective.com/splitjs/sponsor/9/avatar.svg"></a>

## License

Copyright (c) 2019 Nathan Cahill

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
