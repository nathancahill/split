
# Split Grid [![CI](https://img.shields.io/circleci/project/github/nathancahill/split/master.svg)](https://circleci.com/gh/nathancahill/split) ![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen) [![File size](https://img.badgesize.io/https://unpkg.com/split-grid/dist/split-grid.min.js?compression=gzip&label=size&v=1.0.7)](https://unpkg.com/split-grid/dist/split-grid.min.js)

The spiritual successor of [Split.js](https://github.com/nathancahill/split/tree/master/packages/splitjs), built for CSS Grid.

 - __Zero Deps__
 - __Tiny:__ Weights 2kb gzipped.
 - __Fast:__ No overhead or attached window event listeners, uses pure CSS for resizing.
 - __Unopinionated:__ Only modifies `grid-template-*` rules, the rest of the layout is up to you.

## Table of Contents

- [Installation](#installation)
- [Example](#example)
- [Reference](#reference)
- [API](#api)
- [Migrating from Split.js](#migrating-from-splitjs)
- [License](#license)

## Installation

Yarn:

```
$ yarn add split-grid
```

npm:

```
$ npm install --save split-grid
```

Include with a module bundler like [rollup](http://rollupjs.org/) or [webpack](https://webpack.github.io/):

```js
// using ES6 modules
import Split from 'split-grid'

// using CommonJS modules
var Split = require('split-grid')
```

The [UMD](https://github.com/umdjs/umd) build is also available on [unpkg](http://unpkg.com/):

```html
<script src="https://unpkg.com/split-grid/dist/split-grid.js"></script>
```

You can find the library on `window.Split`.

## Example

```js
import Split from 'split-grid'

Split({
  columnGutters: [{
    track: 1,
    element: document.querySelector('.column-1'),
  }, {
    track: 3,
    element: document.querySelector('.column-3'),
  }],
  rowGutters: [{
    track: 1,
    element: document.querySelector('.row-1'),
  }]
})
```

## Reference

```js
Split(options: Options)
```

### Supported CSS values

Current CSS values that are supported in `grid-template, grid-template-columns, grid-template-rows`:

 - [x] `fr`
 - [x] `px`
 - [x] `%`
 - [x] `repeat`

Not supported (yet):

 - [ ] `auto`
 - [ ] other CSS values (`em, vmin, cm, etc`)

### Options

Most of the options can be specified as `option`, `columnOption` and `rowOption`.
This allows default option values to be set for both, or specified individually for each axis.

##### `columnGutters: [{ element: HTMLElement, track: number }]`

An array of objects, with `element` and `track` keys. `element` is the element
in the grid to enable as a draggable gutter. `track` is the grid track the gutter element
is positioned on. These must match.

##### `rowGutters: [{ element: HTMLElement, track: number }]`

An array of objects, with `element` and `track` keys. `element` is the element
in the grid to enable as a draggable gutter. `track` is the grid track the gutter element
is positioned on. These must match.

##### `minSize: number`

The minimum size in pixels for all tracks. Default: `0`

##### `columnMinSize: number`

The minimum size in pixels for all tracks. Default: `options.minSize`

##### `rowMinSize: number`

The minimum size in pixels for all tracks. Default: `options.minSize`

##### `columnMinSizes: { [track: number]: number }`

An object keyed by `track` index, with values set to the minimum size in pixels for the
track at that index. Allows individual minSizes to be specified by track. 
Note this option is plural with an `s`, while the two fallback options are singular.
Default: `options.columnMinSize`

##### `rowMinSizes: { [track: number]: number }`

An object keyed by `track` index, with values set to the minimum size in pixels for the
track at that index. Allows individual minSizes to be specified by track.
Note this option is plural with an `s`, while the two fallback options are singular.
Default: `options.rowMinSize`

##### `snapOffset: number`

Snap to minimum size at this offset in pixels. Set to `0` to disable snap. Default: `30`

##### `columnSnapOffset: number`

Snap to minimum size at this offset in pixels. Set to `0` to disable snap. Default: `options.snapOffset`

##### `rowSnapOffset: number`

Snap to minimum size at this offset in pixels. Set to `0` to disable snap. Default: `options.snapOffset`

##### `dragInterval: number`

Drag this number of pixels at a time. Defaults to `1` for smooth dragging,
but can be set to a pixel value to give more control over the resulting sizes. Default: `1`

##### `columnDragInterval: number`

Drag this number of pixels at a time. Defaults to `1` for smooth dragging,
but can be set to a pixel value to give more control over the resulting sizes. Default: `options.dragInterval`

##### `rowDragInterval: number`

Drag this number of pixels at a time. Defaults to `1` for smooth dragging,
but can be set to a pixel value to give more control over the resulting sizes. Default: `options.dragInterval`

##### `cursor: string`

Cursor to show while dragging. Defaults to `'col-resize'` for column gutters and
`'row-resize'` for row gutters.

##### `columnCursor: string`

Cursor to show while dragging. Default: `'col-resize'`

##### `rowCursor: string`

Cursor to show while dragging. Default: `'row-resize'`

##### `onDrag: (direction: 'row' | 'column', track: number, gridTemplateStyle: string) => void`

Called continously on drag. For process intensive code, add a debounce function to rate limit this callback.
`gridTemplateStyle` is the computed CSS value for `grid-template-column` or `grid-template-row`, depending on `direction`.

##### `onDragStart: (direction: 'row' | 'column', track: number) => void`

Called on drag start.

##### `onDragEnd: (direction: 'row' | 'column', track: number) => void`

Called on drag end.

##### `writeStyle: (grid: HTMLElement, gridTemplateProp: 'grid-template-column' | 'grid-template-row', gridTemplateStyle: string) => void`

Called to update the CSS properties of the grid element. Must eventually apply the
CSS value to the CSS prop, or the grid will not change. `gridTemplateStyle` is the computed CSS value of CSS rule `gridTemplateProp`.

Default:

```js
writeStyle: (grid, gridTemplateProp, gridTemplateStyle) => {
  grid.style[gridTemplateProp] = gridTemplateStyle
}
```

##### `gridTemplateColumns` `gridTemplateRows`

Helper options for determining initial CSS values for `grid-template-columns` and `grid-template-rows`.
Most of the time this option is not needed, as Split Grid reads the CSS rules applied to the grid element,
but security settings may prevent that, for example, when the CSS is served from a 3rd-party domain.
This is ONLY NEEDED if the default method of reading the CSS values errors.
This option does not immediately apply CSS rules, it's only used on drag.

## API

```js
const split = Split(options: Options)
```

Split Grid returns an instance with a couple of functions. The instance is returned on creation.

##### `split.addColumnGutter(element: HTMLElement, track: number)`

Adds a draggable row gutter. The element must be a direct descendant
of the element with grid layout, and positioned in the specified track.

```js
const grid = document.querySelector('.grid')
const gutter = document.createElement('div')

grid.appendChild(gutter)  // append to DOM
split.addColumnGutter(gutter, 1)  // add to Split Grid
```

##### `split.addRowGutter(element: HTMLElement, track: number)`

Adds a draggable row gutter. The element must be a direct descendant
of the element with grid layout, and positioned in the specified track.

```js
const grid = document.querySelector('.grid')
const gutter = document.createElement('div')

grid.appendChild(gutter)  // append to DOM
split.addRowGutter(gutter, 1)  // add to Split Grid
```

##### `split.removeColumnGutter(track: number, immediate?: true)`

Removes event listeners from a column gutter by track number. If `immediate = false` is passed,
event handlers are removed after dragging ends. If a gutter isn't currently being dragged,
it's event handlers are removed immediately.

##### `split.removeRowGutter(track: number, immediate?: true)`

Removes event listeners from a row gutter by track number. If `immediate = false` is passed,
event handlers are removed after dragging ends. If a gutter isn't currently being dragged,
it's event handlers are removed immediately.

##### `split.destroy(immediate?: true)`

Destroy the instance by removing the attached event listeners. If `immediate = false` is passed,
the instance is destroyed after dragging ends. If a gutter isn't currently being dragged,
it's destroyed immediately.

## Migrating from Split.js

#### Bring your own gutters

In Split.js, gutter elements were created by Split.js and inserted in to the DOM.
This is not the case in Split Grid. Create the gutter elements in the HTML as children
of the grid element, and lay them out in the tracks like any other element.
Pass the gutter elements in the options with their track index.

__Split.js__

```js
Split(options) // gutters created implicitly
```

__Split Grid__

Gutters are part of the grid layout:

```html
<div class="grid">
    <div>Column One</div>
    <div class="gutter-column-1"></div>
    <div>Column Two</div>
    <div class="gutter-column-3"></div>
    <div>Column Three</div>
    <div>Row One</div>
    <div class="gutter-row-1"></div>
    <div>Row Two</div>
</div>
```

```js
Split({ // gutters specified in options
    columnGutters: [{
        track: 1,
        element: document.querySelector('.gutter-column-1'),
    }, {
        track: 3,
        element: document.querySelector('.gutter-column-3'),
    }],
    rowGutters: [{
        track: 1,
        element: document.querySelector('.gutter-row-1'),
    }]
})
```

#### CSS values replace `sizes` option

CSS grid layout offers more flexibility than Split.js's percentage values,
so Split Grid uses the `grid-template` values directly. Instead of setting
the initial sizes as an option in Javascript, set the initial sizes in CSS.

__Split.js__

```js
Split({
    sizes: [50, 50]
})
```

__Split Grid__

```html
<div style="grid-template-columns: 1fr 10px 1fr"></div>
```

_or_

```js
> document.querySelector('.grid').style['grid-template-columns'] = '1fr 10px 1fr'
```

#### `split.getSizes()` is replaced by CSS values

Likewise, the `.getSizes()` function is replaced by reading the CSS values directly.

__Split.js__

```js
> split.getSizes()
[50, 50]
```

__Split Grid__

```js
> document.querySelector('.grid').style['grid-template-columns']
"1fr 10px 1fr"
```

#### `split.setSizes()` is replaced by CSS values

In the same way, the `.getSizes()` function is replaced by setting the CSS values directly.

__Split.js__

```js
> split.setSizes([50, 50])
```

__Split Grid__

```js
> document.querySelector('.grid').style['grid-template-columns'] = '1fr 10px 1fr'
```

#### `split.destroy()` has different parameters in Split Grid

Since there's no styles or gutters added by Split Grid, there's no need for Split.js'
`preserveStyles` and `preserveGutters` parameters. Instead, `.destroy()` takes
one parameter, `immediate: boolean`, whether to wait until the gutter has stopped dragging
before removing event listeners.

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
