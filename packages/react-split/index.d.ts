import React, { ReactNode, ReactElement } from "react";
import { CSSStyleDeclarationPartial } from "split.js";

export interface SplitProps extends Omit<React.HTMLProps<HTMLDivElement>, "sizes"> {
  // Initial sizes of each element in percents or CSS values.
  sizes?: number[];

  // Minimum size of each element.
  minSize?: number | number[];

  expandToMin?: boolean;

  // Gutter size in pixels.
  gutterSize?: number;

  gutterAlign?: string;

  // Snap to minimum size offset in pixels.
  snapOffset?: number;

  dragInterval?: number;

  // Direction to split: horizontal or vertical.
  direction?: "horizontal" | "vertical";

  // Cursor to display while dragging.
  cursor?: string;

  // Callback on drag.
  onDrag?(): void;

  // Callback on drag start.
  onDragStart?(): void;

  // Callback on drag end.
  onDragEnd?(): void;

  // Called to create each gutter element
  gutter?(index: number, direction: "horizontal" | "vertical"): HTMLElement;

  // Called to set the style of each element.
  elementStyle?(
    dimension: "width" | "height",
    elementSize: number,
    gutterSize: number,
    index: number,
  ): CSSStyleDeclarationPartial;

  // Called to set the style of the gutter.
  gutterStyle?(dimension: "width" | "height", gutterSize: number, index: number): CSSStyleDeclarationPartial;

  children: ReactNode;
}

declare type Split = (props: SplitProps) => ReactElement;

export default Split;
