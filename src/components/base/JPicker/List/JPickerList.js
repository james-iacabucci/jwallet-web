// @flow

import React, { useState } from 'react'
import classNames from 'classnames'

import handle from 'utils/eventHandlers/handle'

import { JPickerListItem } from './JPickerListItem'

import jPickerItemStyle from './jPickerList.m.scss'

type Props<T = any> = {|
  value: T,
  +onSelect: (value: T) => any,
  items: T[],
|}

class JPickerList extends React.Component<Props> {
  render() {
    return (
      <div
      className={classNames(
        jPickerItemStyle.core,
      )}
    >
      {items.map(item => (
        <JPickerListItem
          isSelected={value.id === item.id}
          isHovered={value.id === hoveredItem.id}
          value={value}
          onSelect={onSelect}
          onHover={setHoveredItemId}
        >
        </JPickerListItem>
      ))}
    </div>
    )
  }
}

function JPickerList({
  value,
  onSelect,
  items,
}: Props) {
  const [hoveredItemId, setHoveredItemId] = useState(null)

  return (

  )
}

JPickerList.defaultProps = {
}

export { JPickerList }
