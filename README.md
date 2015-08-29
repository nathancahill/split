## Split.js



Split.js is a lightweight (2kb) utility for creating adjustable split views. [Demo](http://nathancahill.github.io/Split.js/)

No dependencies and no markup required, just two or more elements with a common parent.

Draggable gutters are inserted between every two elements.

Initial widths, gutter widths and minimum widths are configurable.

### Documentation

```
Split(<id[]> element ids, <options> options?)
```

| Options | Type | Default | Description |
|---|---|---|---|
| widths | Array of numbers | Even | Initial widths of each element in percents. |
| gutterWidth | Number | 10 | Gutter width in pixels |
| minWidth | Number | 100 | Minimum width of each element. |

### Usage Example

```
Split(['one', 'two'], {
    widths: [25, 75],
    minWidth: 200
});
```