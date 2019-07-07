# React Split Grid &nbsp; [![CI](https://img.shields.io/circleci/project/github/nathancahill/split/master.svg)](https://circleci.com/gh/nathancahill/split) ![Dependencies](https://david-dm.org/nathancahill/split/status.svg) ![](https://img.badgesize.io/https://unpkg.com/react-split-grid/dist/react-split-grid.min.js?compression=gzip&label=size)

React component for [Split Grid](https://github.com/nathancahill/split/tree/master/packages/split-grid)

## Installation

Yarn:

```
$ yarn add react-split-grid
```

npm:

```
$ npm install --save react-split-grid
```

Include with a module bundler like [rollup](http://rollupjs.org/) or [webpack](https://webpack.github.io/):

```js
// using ES6 modules
import Split from 'react-split-grid'

// using CommonJS modules
var Split = require('react-split-grid')
```

The [UMD](https://github.com/umdjs/umd) build is also available on [unpkg](http://unpkg.com/):

```html
<script src="https://unpkg.com/react-split-grid/dist/react-split-grid.js"></script>
```

You can find the library on `window.ReactSplitGrid`.

## `<Split />`

`<Split>` is a light component wrapper around the [Split Grid](https://github.com/nathancahill/split/tree/master/packages/split-grid) library.
It uses the render prop pattern, but also supports calling the `children` prop or
the `component` prop.

### Example

```js
import Split from 'react-split-grid'

<Split
    minSize={100}
    cursor="col-resize"
    render={({
        getGridProps,
        getGutterProps,
    }) => (
        <div {...getGridProps()}>
            <div />
            <div {...getGutterProps('column', 1)} />
            <div />
        </div>
    )}
/>
```

## Reference

### Split render methods and props

There are three ways to render a Split Grid with `<Split />`

-   `<Split component>`
-   `<Split render>`
-   `<Split children>`

All three render methods will be passed the same props:

### Props

Refer to [Split Grid documentation](https://github.com/nathancahill/split/tree/master/packages/split-grid#reference) for the options the component accepts as props.

Here's the full list:

-   `minSize: number`
-   `columnMinSize: number`
-   `rowMinSize: number`
-   `columnMinSizes: { [track: number]: number }`
-   `rowMinSizes: { [track: number]: number }`
-   `snapOffset: number`
-   `columnSnapOffset: number`
-   `rowSnapOffset: number`
-   `dragInterval: number`
-   `columnDragInterval: number`
-   `rowDragInterval: number`
-   `cursor: string`
-   `columnCursor: string`
-   `rowCursor: string`
-   `onDrag: (direction: 'row' | 'column', track: number, gridTemplateStyle: string) => void`
-   `onDragStart: (direction: 'row' | 'column', track: number) => void`
-   `onDragEnd: (direction: 'row' | 'column', track: number) => void`
-   `gridTemplateColumns: string`
-   `gridTemplateRows: string`

See the note below on using `gridTemplateColumns` / `gridTemplateRows` props.

### `component`

```js
import Split from 'react-split-grid'

<Split
    minSize={100}
    cursor="col-resize"
    component={Grid}
/>

const Grid = ({
    getGridProps,
    getGutterProps,
}) => (
    <div {...getGridProps()}>
        <div />
        <div {...getGutterProps('column', 1)} />
        <div />
    </div>
)
```

**Warning:** `<Split component>` takes precendence over `<Split render>` so don’t use both in the same `<Split>`.

### `render: (props: Props) => ReactNode`

```js
import Split from 'react-split-grid'

<Split
    minSize={100}
    cursor="col-resize"
    render={({
        getGridProps,
        getGutterProps,
    }) => (
        <div {...getGridProps()}>
            <div />
            <div {...getGutterProps('column', 1)} />
            <div />
        </div>
    )}
/>
```

### `children: func`

```js
import Split from 'react-split-grid'

<Split
    minSize={100}
    cursor="col-resize"
>
    {({
        getGridProps,
        getGutterProps,
    }) => (
        <div {...getGridProps()}>
            <div />
            <div {...getGutterProps('column', 1)} />
            <div />
        </div>
    )}
</Split>
```

### Using `gridTemplateColumns` / `gridTemplateRows` props

If `gridTemplateColumns` or `gridTemplateRows` are passed to `<Split />`,
a handler for `onDrag` must be passed as well to update the prop:

```js
class Wrapper extends React.Component {
    constructor() {
        super()

        this.state = {
            gridTemplateColumns: '1fr 10px 1fr',
        }

        this.handleDrag = this.handleDrag.bind(this)
    }

    handleDrag(direction, track, style) {
        this.setState({
            gridTemplateColumns: style,
        })
    }

    render() {
        const { gridTemplateColumns } = this.state

        return (
            <Split
                gridTemplateColumns={gridTemplateColumns}
                onDrag={this.handleDrag}
                render={({ getGridProps, getGutterProps }) => (
                    <div {...getGridProps()}>
                        <div />
                        <div {...getGutterProps('column', 1)} />
                        <div />
                    </div>
                )}
            />
        )
    }
}
```

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
