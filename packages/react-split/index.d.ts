import React from 'react'
import { Options } from 'split.js'

export interface SplitProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag'|'onDragStart'|'onDragEnd'> {
    sizes?: Options["sizes"]
    minSize?: Options["minSize"]
    maxSize?: Options["maxSize"]
    expandToMin?: Options["expandToMin"]
    gutterSize?: Options["gutterSize"]
    gutterAlign?: Options["gutterAlign"]
    snapOffset?: Options["snapOffset"]
    dragInterval?: Options["dragInterval"]
    direction?: Options["direction"]
    cursor?: Options["cursor"]
    gutter?: Options["gutter"]
    elementStyle?: Options["elementStyle"]
    gutterStyle?: Options["gutterStyle"]
    onDrag?: Options["onDrag"]
    onDragStart?: Options["onDragStart"]
    onDragEnd?: Options["onDragEnd"]
    collapsed?: Number
}

declare class Split extends React.Component<SplitProps, any> {}

export default Split
