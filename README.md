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
| minWidth | Number or Array of numbers | 100 | Minimum width of each element. |
| gutterWidth | Number | 10 | Gutter width in pixels. |
| onDrag | Function | | Callback on drag. |
| onDragStart | Function | | Callback on drag start. |
| onDragEnd | Function | | Callback on drag end. |

### Usage Examples

A split with two elements, starting at 25% and 75% wide with 200px minimum width.

```
Split(['one', 'two'], {
    widths: [25, 75],
    minWidth: 200
});
```

A split with three elements, starting with even widths with 100px, 100px and 500px minimum widths, respectively.

```
Split(['one', 'two', 'three'], {
    minWidth: [100, 100, 500]
});
```