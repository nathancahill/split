// Type definitions for Split.js
// Project: https://github.com/nathancahill/split/tree/master/packages/splitjs
// Definitions by: Ilia Choly <https://github.com/icholy>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.1

// Global variable outside module loader
export as namespace Split

// Module loader
export = Split

declare function Split(
  elements: Array<string | HTMLElement>,
  options?: Split.Options,
): Split.Instance

declare namespace Split {
  type Partial<T> = { [P in keyof T]?: T[P] }
  type CSSStyleDeclarationPartial = Partial<CSSStyleDeclaration>

  interface Options {
    /** 
     * An array of initial sizes of the elements, specified as percentage or CSS values. 
     * Example: Setting the initial sizes to 25% and 75%. 
     */
    sizes?: number[]

    /**
     * An array of minimum sizes of the elements, specified as pixel values. Example: Setting the minimum sizes to 100px and 300px, respectively.
     * 
     * Default: 100
     */
    minSize?: number | number[]

    /**
     * An array of maximum sizes of the elements, specified as pixel values.
     * Example: Setting the maximum sizes of the first element to 500px, and not setting a maximum size on the second element.
     * 
     * Default: Infinity
     */
    maxSize?: number | number[]

    /**
     * When the split is created, if expandToMin is true, the minSize for each element overrides the percentage value from the sizes option.
     * Example: The first element (#one) is set to 25% width of the parent container.
     * However, it's minSize is 300px. Using `expandToMin: true` means that the first element will always load at at least 300px, even if 25% were smaller.
     * 
     * Default: false
     */
    expandToMin?: boolean

    /**
     * Gutter size in pixels.
     * 
     * Default: 10
     */
    gutterSize?: number

    /**
     * Possible options are 'start', 'end' and 'center'. Determines how the gutter aligns between the two elements.
     * 'start' shrinks the first element to fit the gutter
     * 'end' shrinks the second element to fit the gutter
     * 'center' shrinks both elements by the same amount so the gutter sits between.
     *
     * Default: 'center'
     * 
     * Added in v1.5.3.
     */
    gutterAlign?: string

    /**
     * Snap to minimum size at this offset in pixels.
     * Example: Set to 0 to disable to snap effect.
     * 
     * Default: 30
     */
    snapOffset?: number

    /**
     * Drag this number of pixels at a time.
     * Defaults to 1 for smooth dragging, but can be set to a pixel value to give more control over the resulting sizes.
     * Works particularly well when the gutterSize is set to the same size.
     *
     * Default: 1
     * 
     * Added in v1.5.3.
     */
    dragInterval?: number

    /**
     * Direction to split in. Can be 'vertical' or 'horizontal'.
     * Determines which CSS properties are applied (ie. width/height) to each element and gutter
     * 
     * Default: 'horizontal'
     */
    direction?: 'horizontal' | 'vertical'

    /**
     * Cursor to show on the gutter (also applied to the body on dragging to prevent flickering).
     * 
     * Defaults to 'col-resize'for direction: 'horizontal' and 'row-resize' for direction: 'vertical'
     */
    cursor?: string

    /** Callback that can be added on drag (fired continously) */
    onDrag?(sizes: number[]): void

    /** Callback that can be added on drag (fired continously) */
    onDragStart?(sizes: number[]): void

    /** Callback that can be added on drag (fired continously) */
    onDragEnd?(sizes: number[]): void

    /** Optional function called to create each gutter element.  */
    gutter?(
      index: number,
      direction: 'horizontal' | 'vertical',
    ): HTMLElement

    /** Optional function called setting the CSS style of the elements.  */
    elementStyle?(
      dimension: 'width' | 'height',
      elementSize: number,
      gutterSize: number,
      index: number,
    ): CSSStyleDeclarationPartial

    /** Optional function called when setting the CSS style of the gutters. */
    gutterStyle?(
      dimension: 'width' | 'height',
      gutterSize: number,
      index: number,
    ): CSSStyleDeclarationPartial
  }

  interface Instance {
    /**
     * setSizes behaves the same as the sizes configuration option, passing an array of percents or CSS values.
     * It updates the sizes of the elements in the split.
     */
    setSizes(sizes: number[]): void

    /** 
     * getSizes returns an array of percents, suitable for using with setSizes or creation.
     */
    getSizes(): number[]

    /** 
     * collapse changes the size of element at index to 0.
     * Every element except the last is collapsed towards the front (left or top).
     * The last is collapsed towards the back.
     */
    collapse(index: number): void

    /** 
     * Destroy the instance. It removes the gutter elements, and the size CSS styles Split.js set.
     */
    destroy(preserveStyles?: boolean, preserveGutters?: boolean): void
  }
}
