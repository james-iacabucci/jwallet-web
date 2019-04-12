// @flow

import React from 'react'
import classNames from 'classnames'

import handle from 'utils/eventHandlers/handle'

import jPickerItemStyle from './jPickerListItem.m.scss'

type Props<T = any> = {|
  +isSelected: boolean,
  +isHovered: boolean,
  +value: T,
  +onSelect: (value: T) => any,
  +onHover: (value: T) => any,
  +onBlur: (value: T) => any,
  +children: React$Node,
|}

function JPickerListItem({
  isSelected,
  isHovered,
  value,
  onSelect,
  onHover,
  onBlur,
  children,
}: Props) {
  return (
    <div
      onClick={onSelect ? handle(onSelect)(value) : undefined}
      onHover={onHover ? handle(onHover)(value) : undefined}
      onBlur={onBlur ? handle(onBlur)(value) : undefined}
      className={classNames(
        jPickerItemStyle.core,
        isSelected && jPickerItemStyle.selected,
        isHovered && jPickerItemStyle.hover,
      )}
    >
      <div className={jPickerItemStyle.item}>{children}</div>
    </div>
  )
}

JPickerListItem.defaultProps = {
  onSelect: () => {},
  onHover: null,
  onBlur: null,
  value: null,
  isSelected: false,
  isHovered: false,
}

export { JPickerListItem }
