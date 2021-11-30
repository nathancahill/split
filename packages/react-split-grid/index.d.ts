import React from 'react'
import { SplitOptions } from 'split-grid'

export interface SplitProps {
    columnGutters?: SplitOptions["columnGutters"]
    rowGutters?: SplitOptions["rowGutters"]
    minSize?: SplitOptions["minSize"]
    maxSize?: SplitOptions["maxSize"]
    columnMinSize?: SplitOptions["columnMinSize"]
    rowMinSize?: SplitOptions["rowMinSize"]
    columnMaxSize?: SplitOptions["columnMaxSize"]
    rowMaxSize?: SplitOptions["rowMaxSize"]
    columnMinSizes?: SplitOptions["columnMinSizes"]
    rowMinSizes?: SplitOptions["rowMinSizes"]
    columnMaxSizes?: SplitOptions["columnMaxSizes"]
    rowMaxSizes?: SplitOptions["rowMaxSizes"]
    snapOffset?: SplitOptions["snapOffset"]
    columnSnapOffset?: SplitOptions["columnSnapOffset"]
    rowSnapOffset?: SplitOptions["rowSnapOffset"]
    dragInterval?: SplitOptions["dragInterval"]
    columnDragInterval?: SplitOptions["columnDragInterval"]
    rowDragInterval?: SplitOptions["rowDragInterval"]
    cursor?: SplitOptions["cursor"]
    columnCursor?: SplitOptions["columnCursor"]
    rowCursor?: SplitOptions["rowCursor"]
    onDrag?: SplitOptions["onDrag"]
    onDragStart?: SplitOptions["onDragStart"]
    onDragEnd?: SplitOptions["onDragEnd"]
    writeStyle?: SplitOptions["writeStyle"]
    gridTemplateColumns?: SplitOptions["gridTemplateColumns"]
    gridTemplateRows?: SplitOptions["gridTemplateRows"]
}

declare class Split extends React.Component<SplitProps, any> {}

export default Split
