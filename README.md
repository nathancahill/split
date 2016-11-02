## Split.js

[![Build Status](https://travis-ci.org/nathancahill/Split.js.svg?branch=v0.4.4)](https://travis-ci.org/nathancahill/Split.js)
[![File Size](https://badge-size.herokuapp.com/nathancahill/Split.js/master/split.min.js.svg?compression=gzip&label=size)](https://raw.githubusercontent.com/nathancahill/Split.js/master/split.min.js)

Split.js is a lightweight, unopinionated utility for creating adjustable split views or panes. [Demo](http://nathancahill.github.io/Split.js/).

No dependencies or markup required, just two or more elements with a common parent. Views can be split horizontally or vertically, with draggable gutters inserted between every two elements.

## Installation

Install with Bower:

```shell
bower install Split.js
```

NPM:

```shell
npm install split.js
```

Or clone from Github:

```shell
git clone https://github.com/nathancahill/Split.js.git
```

## Documentation

```js
Split(<HTMLElement|selector[]> elements, <options> options?)
```

| Options | Type | Default | Description |
|---|---|---|---|
| sizes | Array | | Initial sizes of each element in percents or CSS values. |
| minSize | Number or Array | 100 | Minimum size of each element. |
| gutterSize | Number | 10 | Gutter size in pixels. |
| snapOffset | Number | 30 | Snap to minimum width offset in pixels. |
| direction | String | 'horizontal' | Direction to split: horizontal or vertical. |
| cursor | String | 'col-resize' | Cursor to display while dragging. |
| onDrag | Function | | Callback on drag. |
| onDragStart | Function | | Callback on drag start. |
| onDragEnd | Function | | Callback on drag end. |

__Important Note__: Split.js does not set CSS beyond the minimum needed to manage the width and height of the elements.
This is by design. It makes Split.js flexible and useful in many different situations.
If you create a horizontal split, you are responsible for (likely) floating the elements and the gutter,
and setting their heights. See the [CSS](#css) section below.

## Usage Examples

Reference HTML for examples. Gutters are inserted automatically:

```html
<div>
    <div id="one">content one</div>
    <div id="two">content two</div>
    <div id="three">content three</div>
</div>
```

A split with two elements, starting at 25% and 75% wide with 200px minimum width.

```js
Split(['#one', '#two'], {
    sizes: [25, 75],
    minSize: 200
});
```

A split with three elements, starting with even widths with 100px, 100px and 300px minimum widths, respectively.

```js
Split(['#one', '#two', '#three'], {
    minSize: [100, 100, 300]
});
```

A vertical split with two elements.

```js
Split(['#one', '#two'], {
    direction: 'vertical'
});
```

Specifying the initial widths with CSS values. Not recommended, the size/gutter calculations would have to be done before hand and won't scale on viewport resize.

```js
Split(['#one', '#two'], {
	sizes: ['200px', '500px']
});
```

JSFiddle style is also possible: [Demo](http://nathancahill.github.io/Split.js/examples/jsfiddle.html).

## API

Split.js returns an instance with a couple of functions. The instance is returned on creation:

```
var instance = Split([], ...)
```

#### .setSizes([])

setSizes behaves the same as the `sizes` configuration option, passing an array of percents or CSS values. It updates the sizes of the elements in the split:

```
instance.setSizes([25, 75])
```

#### .collapse(index)

collapse changes the size of element at `index` to 0. Every element except the last is collapsed towards the front (left or top). The last is collapsed towards the back:

```
instance.collapse(0)
```

#### .destroy()

Destroy the instance. It removes the gutter elements, and the size CSS styles Split.js set.

```
instance.destroy()
```

## CSS

In being non-opionionated, the only CSS Split.js sets is the widths or heights of the elements. Everything else is left up to you. You must set the elements and gutter heights when using horizontal mode. The gutters will not be visible if their height is 0px. Here's some basic CSS to style the gutters with, although it's not required:

```css
.gutter {
  background-color: #eee;

  background-repeat: no-repeat;
  background-position: 50%;
}

.gutter.gutter-horizontal {
  background-image: url('grips/vertical.png');
  cursor: ew-resize;
}

.gutter.gutter-vertical {
  background-image: url('grips/horizontal.png');
  cursor: ns-resize;
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
.split, .gutter.gutter-horizontal {
  float: left;
}
```

If you use floats, set the height of the elements including the gutters. The gutters will not be visible otherwise if the height is set to 0px.

```css
.split, .gutter.gutter-horizontal {
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

## Browser Support

This library uses [calc()](https://developer.mozilla.org/en-US/docs/Web/CSS/calc#AutoCompatibilityTable), [box-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing#AutoCompatibilityTable) and [getBoundingClientRect()](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect#AutoCompatibilityTable). This features are supported in the following browsers:

| <img src="http://i.imgur.com/dJC1GUv.png" width="48px" height="48px" alt="Chrome logo"> | <img src="http://i.imgur.com/o1m5RcQ.png" width="48px" height="48px" alt="Firefox logo"> | <img src="http://i.imgur.com/8h3iz5H.png" width="48px" height="48px" alt="Internet Explorer logo"> | <img src="http://i.imgur.com/iQV4nmJ.png" width="48px" height="48px" alt="Opera logo"> | <img src="http://i.imgur.com/j3tgNKJ.png" width="48px" height="48px" alt="Safari logo"> |
|:---:|:---:|:---:|:---:|:---:|
| 19+ ✔ | 4+ ✔ | 9+ ✔ | 32+ ✔ | 7+ ✔ |

Gracefully falls back in IE 8 and below to only setting the initial widths/heights and not allowing dragging. IE 8 requires a [polyfill](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray) for `Array.isArray()`

## License

Copyright (c) 2016 Nathan Cahill

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
