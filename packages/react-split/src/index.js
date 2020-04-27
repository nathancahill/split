import React from 'react'
import PropTypes from 'prop-types'
import Split from 'split.js'
import equal from 'lodash.isequal'

class SplitWrapper extends React.Component {
    componentDidMount() {
        const { children, gutter, ...options } = this.props

        options.gutter = this.getGutterElement(gutter)

        this.split = Split(this.parent.children, options)
    }

    componentDidUpdate(prevProps) {
        const { children, minSize, sizes, collapsed, ...options } = this.props
        const {
            minSize: prevMinSize,
            sizes: prevSizes,
            collapsed: prevCollapsed,
            children: prevChildren,
        } = prevProps

        const childrenChanged =
            (sizes && prevSizes && sizes.length !== prevSizes.length) ||
            !equal(children, prevChildren)

        const otherProps = [
            'expandToMin',
            'gutterSize',
            'gutterAlign',
            'snapOffset',
            'dragInterval',
            'direction',
            'cursor',
        ]

        let needsRecreate = otherProps
            // eslint-disable-next-line react/destructuring-assignment
            .map(prop => this.props[prop] !== prevProps[prop])
            .reduce((accum, same) => accum || same, childrenChanged)

        // Compare minSize when both are arrays, when one is an array and when neither is an array
        if (Array.isArray(minSize) && Array.isArray(prevMinSize)) {
            let minSizeChanged = false

            minSize.forEach((minSizeI, i) => {
                minSizeChanged = minSizeChanged || minSizeI !== prevMinSize[i]
            })

            needsRecreate = needsRecreate || minSizeChanged
        } else if (Array.isArray(minSize) || Array.isArray(prevMinSize)) {
            needsRecreate = true
        } else {
            needsRecreate = needsRecreate || minSize !== prevMinSize
        }

        // Destroy and re-create split if options changed
        if (needsRecreate) {
            if (childrenChanged) {
                options.sizes = sizes
            } else {
                options.sizes = this.split.getSizes()
                options.gutter = (index, direction, pairB) =>
                    pairB.previousSibling
            }
            options.minSize = minSize
            this.split.destroy(true, !childrenChanged)
            this.split = Split(
                Array.from(this.parent.children).filter(
                    // eslint-disable-next-line no-underscore-dangle
                    element => !element.__isSplitGutter,
                ),
                options,
            )
        } else if (sizes) {
            // If only the size has changed, set the size. No need to do this if re-created.
            let sizeChanged = false

            sizes.forEach((sizeI, i) => {
                sizeChanged = sizeChanged || sizeI !== prevSizes[i]
            })

            if (sizeChanged) {
                // eslint-disable-next-line react/destructuring-assignment
                this.split.setSizes(this.props.sizes)
            }
        }

        // Collapse after re-created or when collapsed changed.
        if (
            Number.isInteger(collapsed) &&
            (collapsed !== prevCollapsed || needsRecreate)
        ) {
            this.split.collapse(collapsed)
        }
    }

    componentWillUnmount() {
        this.split.destroy()
        delete this.split
    }

    // eslint-disable-next-line class-methods-use-this
    getGutterElement(customGutterFunction) {
        return (index, direction, pairElement) => {
            let gutter

            if (customGutterFunction) {
                gutter = customGutterFunction(index, direction, pairElement)
            } else {
                gutter = document.createElement('div')
                gutter.className = `gutter gutter-${direction}`
            }

            // eslint-disable-next-line no-underscore-dangle
            gutter.__isSplitGutter = true
            return gutter
        }
    }

    render() {
        const {
            sizes,
            minSize,
            expandToMin,
            gutterSize,
            gutterAlign,
            snapOffset,
            dragInterval,
            direction,
            cursor,
            gutter,
            elementStyle,
            gutterStyle,
            onDrag,
            onDragStart,
            onDragEnd,
            collapsed,
            children,
            ...rest
        } = this.props

        return (
            <div
                ref={parent => {
                    this.parent = parent
                }}
                {...rest}
            >
                {children}
            </div>
        )
    }
}

SplitWrapper.propTypes = {
    sizes: PropTypes.arrayOf(PropTypes.number),
    minSize: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.arrayOf(PropTypes.number),
    ]),
    expandToMin: PropTypes.bool,
    gutterSize: PropTypes.number,
    gutterAlign: PropTypes.string,
    snapOffset: PropTypes.number,
    dragInterval: PropTypes.number,
    direction: PropTypes.string,
    cursor: PropTypes.string,
    gutter: PropTypes.func,
    elementStyle: PropTypes.func,
    gutterStyle: PropTypes.func,
    onDrag: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,
    collapsed: PropTypes.number,
    children: PropTypes.arrayOf(PropTypes.element),
}

SplitWrapper.defaultProps = {
    sizes: undefined,
    minSize: undefined,
    expandToMin: undefined,
    gutterSize: undefined,
    gutterAlign: undefined,
    snapOffset: undefined,
    dragInterval: undefined,
    direction: undefined,
    cursor: undefined,
    gutter: undefined,
    elementStyle: undefined,
    gutterStyle: undefined,
    onDrag: undefined,
    onDragStart: undefined,
    onDragEnd: undefined,
    collapsed: undefined,
    children: undefined,
}

export default SplitWrapper
