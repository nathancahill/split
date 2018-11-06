# Grid Template Utils [![CI](https://img.shields.io/circleci/project/github/nathancahill/split/master.svg)](https://circleci.com/gh/nathancahill/split) ![Dependencies](https://david-dm.org/nathancahill/split/status.svg) [![File size](https://img.badgesize.io/https://unpkg.com/grid-template-utils/dist/grid-template-utils.min.js?compression=gzip&label=size&v=1.0.0)](https://unpkg.com/grid-template-utils/dist/grid-template-utils.min.js)

## Installation

Yarn:

```
$ yarn add grid-template-utils
```

npm:

```
$ npm install --save grid-template-utils
```

Include with a module bundler like [rollup](http://rollupjs.org/) or [webpack](https://webpack.github.io/):

```js
// using ES6 modules
import { parse, combine, getSizeAtTrack } from 'grid-template-utils'

// using CommonJS modules
var utils = require('grid-template-utils')
```

The [UMD](https://github.com/umdjs/umd) build is also available on [unpkg](http://unpkg.com/):

```html
<script src="https://unpkg.com/grid-template-utils/dist/grid-template-utils.js"></script>
```

You can find the library on `window.GridTemplateUtils`.

## Example

```js
import { parse, combine, getSizeAtTrack } from 'grid-template-utils'

> parse('1fr 10px 1fr')
[
    {
        value: '1fr',
        type: 'fr',
        numeric: 1,
    },
    {
        value: '10px',
        type: 'px',
        numeric: 10,
    },
    {
        value: '1fr',
        type: 'fr',
        numeric: 1,
    },
]

> combine('1fr 10px 1fr', [,{ value: '20px' }])
'1fr 20px 1fr'


> getSizeAtTrack(1, parse('10px 10px 10px'))
20

> getSizeAtTrack(1, parse('10px 10px 10px'), 20)
40
```

## Reference

##### `Track { value: string, type: 'fr' | 'px' | '%' | 'auto', numeric: number }`

Object describing CSS values for a single track in a grid template.

##### `parse(rule: string) => Track[]`

Parses a `grid-template-rows` or `grid-template-columns` CSS rule to
an array of `Track` objects with `value`, `type` and `numeric` keys.

##### `combine(rule: string, tracks: Track[]) => string`

Updates a CSS rule with values from an array of `Track` objects. The array can be sparse,
only included indices will be updated. If `Track.value` is specified,
that string value will be used directly. If not, `Track.numeric` and `Track.type` are
joined before interpolation.

##### `getSizeAtTrack(index: number, tracks: Track[], gap?: number = 0, end?: boolean = false) => number`

Returns the pixel size measured from the start of the grid layout up to the track
specified by `index`. Each `Track.numeric` value should be a `px` value
(for example, as returned by `parse(getComputedStyle())`).
Optional argument `gap` is the pixel size of `grid-gap`. Optional agrument `end`
is a flag that determines whether to measure up to the start or end of the track.
Defaults to `false` (measure to the start of the track).

## License

Copyright (c) 2018 Nathan Cahill

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
