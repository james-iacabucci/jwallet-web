// @flow

import React from 'react'
import classNames from 'classnames'

import { JPickerListItem } from './JPickerListItem'

import jPickerListStyle from './jPickerList.m.scss'

type PickerItem<T> = {|
  key: string,
  component?: any,
  title: string,
  description?: string,
  iconName?: string,
|} & T

type Props<T> = {|
  +items: PickerItem<T>[],
  +activeItem: PickerItem<T>,
  +onItemClick: (item: PickerItem<T>) => any,
|}

type ComponentState<T> = {|
  focusedItem: ?PickerItem<T>,
|}

class JPickerList<T = *> extends React.Component<Props<T>, ComponentState<T>> {
  state: ComponentState<T> = {
    focusedItem: null,
  }

  handleItemFocus = (item: PickerItem<T>) => {
    this.setState({ focusedItem: item })
  }

  handleItemBlur = () => {
    this.setState({ focusedItem: null })
  }

  render() {
    const {
      activeItem,
      items,
      onItemClick,
    } = this.props

    const {
      focusedItem,
    } = this.state

    const count = items.length

    return (
      <div
        className={classNames(
          jPickerListStyle.core,
          jPickerListStyle[`count-${count}`],
        )}
      >
        {items.map(item => (
          <JPickerListItem
            key={item.key}
            isSelected={!!activeItem && activeItem.key === item.key}
            isFocused={!!focusedItem && item.key === focusedItem.key}
            data={item}
            onClick={onItemClick}
            onFocus={this.handleItemFocus}
            onBlur={this.handleItemBlur}
            component={item.component || undefined}
          />
        ))}
      </div>
    )
  }
}

export { JPickerList }
