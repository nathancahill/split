## Split.js



Split.js is a lightweight (2kb) utility for creating adjustable split views. [Demo](http://nathancahill.github.io/Split.js/)

No dependencies and no markup required, just two or more elements with a common parent.

Draggable gutters are inserted between every two elements.

Initial sizes, gutter sizes and minimum sizes are configurable.

### Documentation

```
Split(<id[]> element ids, <options> options?)
```

| Options | Type | Default | Description |
|---|---|---|---|
| sizes | Array of numbers | | Initial sizes of each element in percents. |
| minSize | Number or Array of numbers | 100 | Minimum size of each element. |
| gutterSize | Number | 10 | Gutter size in pixels. |
| snapOffset | Number | 30 | Snap to minimum width offset in pixels. |
| direction | String | 'horizontal' | Direction to split: horizontal or vertical. |
| onDrag | Function | | Callback on drag. |
| onDragStart | Function | | Callback on drag start. |
| onDragEnd | Function | | Callback on drag end. |

### Usage Examples

A split with two elements, starting at 25% and 75% wide with 200px minimum width.

```
Split(['one', 'two'], {
    sizes: [25, 75],
    minSize: 200
});
```

A split with three elements, starting with even widths with 100px, 100px and 300px minimum widths, respectively.

```
Split(['one', 'two', 'three'], {
    minSize: [100, 100, 300]
});
```

A vertical split with two elements.

```
Split(['one', 'two'], {
    direction: 'vertical'
});
```
