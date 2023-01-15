import React from 'react'

import {
  getContrastingColorFromHex,
  string2color,
} from '../functions.js'

export default function Tag({ tag, style, ...props }) {
  const color = string2color(tag) // TODO make sure to only run this once
  // TODO define the colors instead of generating them
  const textColor = getContrastingColorFromHex(color) // TODO make sure to only run this once

  return <button
    {...props}
    style={{
      ...style,
      backgroundColor: color,
      color: textColor,
    }}
  >
    {tag}
  </button>
}
