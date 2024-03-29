import React from 'react'
import PropTypes from 'prop-types';

export default function BubbleChart({ width, height, children }) {
  return (
    <svg className="bubbleChart" width={width} height={height}>
      {
        children
      }
    </svg>
  )
}

BubbleChart.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  children: PropTypes.node,
}
