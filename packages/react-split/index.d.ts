import React from 'react'
import { Options } from 'split.js'

export interface SplitProps extends Options {
  collapsed?: Number
}

declare class Split extends React.Component<SplitProps, any> { }

export default Split
