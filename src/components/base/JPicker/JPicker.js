// @flow strict

import * as React from 'react'

import { JPickerBody } from './JPickerBody'
import { JPickerList } from './List/JPickerList'
import { DefaultItem } from './List/DefaultItem'

type Props = {|
  items: any[],
  isDisabled: boolean,
  onOpen: Function,
  onClose: Function,
|}

type ComponentState = {|
  isOpen: boolean,
|}

class JPicker extends React.Component<Props, ComponentState> {
  state = {
    isOpen: false,
  }

  toggle = (isOpen: boolean) => {
    const {
      onOpen,
      onClose,
    } = this.props

    this.setState(
      { isOpen },
      () => isOpen
        ? onOpen && onOpen()
        : onClose && onClose(),
    )
  }

  render() {
    return (
      <React.Fragment>
        <JPickerBody
          isOpen={this.state.isOpen}
          toggle={this.toggle}
          isDisabled={this.props.isDisabled}
        >
          <JPickerList>
          ..
          </JPickerList>
        </JPickerBody>
      </React.Fragment>
    )
  }
}

export default JPicker
