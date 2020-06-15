# React-Split &nbsp; [![CI](https://img.shields.io/circleci/project/github/nathancahill/split/master.svg)](https://circleci.com/gh/nathancahill/split) ![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen) ![](https://img.badgesize.io/https://unpkg.com/react-split/dist/react-split.min.js?compression=gzip&label=size&v=2.0.5)

React component for [Split.js](https://github.com/nathancahill/Split.js/)

## Installation

Yarn:

```
$ yarn add react-split
```

npm:

```
$ npm install --save react-split
```

Include with a module bundler like [rollup](http://rollupjs.org/) or [webpack](https://webpack.github.io/):

```js
// using ES6 modules
import Split from 'react-split'

// using CommonJS modules
var Split = require('react-split')
```

The [UMD](https://github.com/umdjs/umd) build is also available on [unpkg](http://unpkg.com/):

```html
<script src="https://unpkg.com/react-split/dist/react-split.js"></script>
```

You can find the library on `window.ReactSplit`.

## Usage

The `<Split />` component wraps multiple children components to create a resizeable split view. The component is a
light wrapper around the [Split.js](https://github.com/nathancahill/Split.js/) library and accepts (mostly) the same options.

```js
import Split from 'react-split'

<Split>
    <ComponentA />
    <ComponentB />
</Split>
```

## Reference

### `<Split>`

Creates a Split instance and a `<div>` wrapper around the children components.
All additional props are passed through to the to the `<div>` component.

### Example

```js
import Split from 'react-split'

<Split
    sizes={[25, 75]}
    minSize={100}
    expandToMin={false}
    gutterSize={10}
    gutterAlign="center"
    snapOffset={30}
    dragInterval={1}
    direction="horizontal"
    cursor="col-resize"
>
    <ComponentA />
    <ComponentB />
</Split>
```

### Props

#### `sizes`

`sizes?: [number]` - [Docs](https://github.com/nathancahill/split/tree/master/packages/splitjs#sizes)

#### `minSize`

`minSize?: number | [number]` - [Docs](https://github.com/nathancahill/split/tree/master/packages/splitjs#minsize-default-100)

#### `expandToMin`

`expandToMin?: boolean` - [Docs](https://github.com/nathancahill/split/tree/master/packages/splitjs#expandtomin-default-false)

#### `gutterSize`

`gutterSize?: number` - [Docs](https://github.com/nathancahill/split/tree/master/packages/splitjs#guttersize-default-10)

#### `gutterAlign`

`gutterAlign?: 'center' | 'start' | 'end'` - [Docs](https://github.com/nathancahill/split/tree/master/packages/splitjs#gutteralign-default-center)

#### `snapOffset`

`snapOffset?: number` - [Docs](https://github.com/nathancahill/split/tree/master/packages/splitjs#snapoffset-default-30)

#### `dragInterval`

`dragInterval?: number` - [Docs](https://github.com/nathancahill/split/tree/master/packages/splitjs#draginterval-default-1)

#### `direction`

`direction?: 'horizontal' | 'vertical'` - [Docs](https://github.com/nathancahill/split/tree/master/packages/splitjs#direction-default-horizontal)

#### `cursor`

`cursor?: string` - [Docs](https://github.com/nathancahill/split/tree/master/packages/splitjs#cursor-default-col-resize)

#### `gutter`

`gutter?: (index, direction, pairElement) => HTMLElement` - [Docs](https://github.com/nathancahill/split/tree/master/packages/splitjs#gutter)

#### `elementStyle`

`elementStyle?: (dimension, elementSize, gutterSize, index) => Object` - [Docs](https://github.com/nathancahill/split/tree/master/packages/splitjs#elementstyle)

#### `gutterStyle`

`gutterStyle?: (dimension, gutterSize, index) => Object` - [Docs](https://github.com/nathancahill/split/tree/master/packages/splitjs#gutterstyle)

#### `onDrag`

`onDrag?: sizes => void` - [Docs](https://github.com/nathancahill/split/tree/master/packages/splitjs#ondrag-ondragstart-ondragend)

#### `onDragStart`

`onDragStart?: sizes => void` - [Docs](https://github.com/nathancahill/split/tree/master/packages/splitjs#ondrag-ondragstart-ondragend)

#### `onDragEnd`

`onDragEnd?: sizes => void` - [Docs](https://github.com/nathancahill/split/tree/master/packages/splitjs#ondrag-ondragstart-ondragend)

## Migrating from Split.js

Refer to [Split.js documentation](https://github.com/nathancahill/split/tree/master/packages/splitjs#documentation) for the options the component accepts as props. The differences are noted below:

A few props are exempt from updating. These props are functions, these props will not trigger a `componentDidUpdate`.
Following React best practices, and do not create functions in the render method. Instead, create them once and pass them as props.

-   `gutter`
-   `elementStyle`
-   `gutterStyle`
-   `onDrag`
-   `onDragStart`
-   `onDragEnd`

#### API

-   `.setSizes(sizes)` becomes the prop `sizes={sizes}`
-   `.getSizes()` is unavailable, but sizes are passed to `onDragStart` and `onDragEnd`
-   `.collapse(index)` becomes the prop: `collapsed={index}`
-   `.destroy()` is triggered automatically on `componentWillUnmount`

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
