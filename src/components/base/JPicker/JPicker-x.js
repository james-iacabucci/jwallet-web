// @flow

import React, { PureComponent } from 'react'
import classNames from 'classnames'

import { JIcon } from 'components/base'
import handle from 'utils/eventHandlers/handle'

import jPickerStyle from './jPicker.m.scss'

type RendererProps = {
  isOpen: boolean,
  isDisabled: boolean,
}

type Props = {|
  +onOpen: ?(() => void),
  +onClose: ?(() => void),
  +currentRenderer: ?((props: RendererProps) => React$Node),
  +children: ?React$Node,
  +isDisabled: boolean,
|}

type ComponentState = {|
  +isOpen: boolean,
|}

class JPicker extends PureComponent<Props, ComponentState> {
  static defaultProps = {
    onOpen: null,
    onClose: null,
    children: null,
    currentRenderer: null,
    isDisabled: false,
    infoMessage: '',
    errorMessage: '',
  }

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
    const {
      children,
      currentRenderer,
      isDisabled,
    } = this.props

    const {
      isOpen,
    } = this.state

    const currentEl = !currentRenderer ? null : currentRenderer({
      isOpen,
      isDisabled,
    })

    const countClass = (React.Children.count(children) < 4)
      ? `count-${React.Children.count(children)}`
      : null

    return (
      <div
        className={classNames(
          jPickerStyle.core,
          isOpen && jPickerStyle.active,
          isDisabled && jPickerStyle.disabled,
          jPickerStyle[countClass],
        )}
      >
        <div className={jPickerStyle.select}>
          <div
            onClick={isDisabled ? undefined : handle(this.toggle)(!isOpen)}
            className={jPickerStyle.current}
          >
            {currentEl}
            <div className={jPickerStyle.chevron}>
              <JIcon name={isOpen ? 'chevron-up' : 'chevron-down'} color='blue' />
            </div>
          </div>
          <div onClick={handle(this.toggle)(false)} className={jPickerStyle.options}>
            {children}
          </div>
        </div>
        {isOpen && <div onClick={handle(this.toggle)(false)} className={jPickerStyle.overlay} />}
      </div>
    )
  }
}

export { JPicker }
