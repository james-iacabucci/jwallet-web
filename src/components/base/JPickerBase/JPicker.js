// @flow strict

import * as React from 'react'

import {
  JPickerBody,
  JPickerList,
  DefaultItem,
  JPickerCurrent,
} from '.'

import {
  JPickerTabs,
} from './Tabs/JPickerTabs'

type Props = {|
  items: any[],
  label: string,
  isDisabled: boolean,
  onOpen: Function,
  onClose: Function,
  meta: FinalFormMeta,
  input: FinalFormInput,
|}

class JPicker extends React.Component<Props> {
  handleItemClick = (itemKey: string) => {
    const {
      input: {
        onChange,
      },
    } = this.props

    onChange(itemKey)
  }

  render() {
    const {
      label,
      items,
      input,
      meta,
      isDisabled,
    } = this.props

    const activeItemKey = input.value
    const activeItem = items.find(item => item.key === activeItemKey)

    return (
      <React.Fragment>
        <JPickerBody
          isOpen={meta.active || false}
          onOpen={input.onFocus}
          onClose={input.onBlur}
          isDisabled={isDisabled}
          currentRenderer={({ isOpen }) => (
            <JPickerCurrent
              isEditable={isOpen}
              label={label}
              value={activeItem ? activeItem.title : ''}
            />
          )}
        >
          <JPickerList
            onItemClick={this.handleItemClick}
            activeItemKey={activeItemKey}
          >
            {items.map(item => (
              <DefaultItem {...item} key={item.key} />
            ))}
          </JPickerList>
        </JPickerBody>
      </React.Fragment>
    )
  }
}

export { JPicker }
