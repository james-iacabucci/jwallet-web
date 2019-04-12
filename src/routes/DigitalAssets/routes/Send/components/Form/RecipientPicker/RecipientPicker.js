// @flow strict

import * as React from 'react'
import classNames from 'classnames'

import {
  JFieldMessage,
  JIcon,
} from 'components/base'
import { getErrorMessage } from 'utils/form'

import { PickerCurrent } from './Current/JPickerCurrent'
import pickerStyle from './recipientPicker.m.scss'

type RendererParams = {|
  +isOpen: boolean,
  +isDisabled: boolean,
  +onClick: Function,
|}

type Props = {|
  +children: React$Node,
  +className: string,
  +isDisabled: boolean,
  +infoMessage: string,
  +validateType: FinalFormValidateType,
  +meta: FinalFormMeta,

  +currentRenderer: (params: RendererParams) => React$Node,
  +tabsRenderer: ?((params: RendererParams) => React$Node),
|}

type StateProps = {|
  isOpen: boolean,
|}

class RecipientPicker extends React.Component<Props, StateProps> {
  static defaultProps = {
    className: '',
    currentRenderer: ({
      isOpen,
      onClick,
    }) => <PickerCurrent isEditable={isOpen} label='My Picker' onClick={onClick} />,
    isDisabled: false,
    tabsRenderer: null,
    meta: {},
    validateType: 'touched',
  }

  state: StateProps = {
    isOpen: false,
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClose)
  }

  handleOpen = () => {
    this.setState({ isOpen: true }, () => {
      document.addEventListener('click', this.handleClose)
    })
  }

  handleClose = () => {
    document.removeEventListener('click', this.handleClose)
    this.setState({ isOpen: false })
  }

  toggle = () => {
    if (this.state.isOpen) {
      this.close()
    } else {
      this.open()
    }
  }

  render() {
    const {
      children,
      className,
      isDisabled,
      infoMessage,
      meta,
      validateType,
    } = this.props

    const { isOpen } = this.state

    const errorMessage = getErrorMessage(meta, validateType)
    const hasError = !!errorMessage
    const hasInfo = !!infoMessage
    const hasMessage = (hasError || hasInfo)
    const messageTheme = hasError
      ? 'error'
      : 'info'

    const rendererParams = {
      isDisabled,
      isOpen,
      onClick: this.handleOpen,
    }

    return (
      <div className={classNames(
        pickerStyle.core,
        isDisabled && pickerStyle.disabled,
        isOpen && pickerStyle.open,
        className,
      )}
      >
        <div className={classNames(pickerStyle.wrap)}>
          {this.props.currentRenderer(rendererParams)}
          <div className={pickerStyle.chevron}>
            <JIcon name={isOpen ? 'chevron-up' : 'chevron-down'} color='blue' />
          </div>
          <div className={pickerStyle.options}>
            {this.props.tabsRenderer && (
              <div className={pickerStyle.tabs}>
                {this.props.tabsRenderer(rendererParams)}
              </div>
            )}
            <div className={pickerStyle.list}>
              {children}
            </div>
          </div>
        </div>
        {isOpen && <div onClick={this.handleClose} className='overlay' />}
        {hasMessage && (
          <JFieldMessage
            theme={messageTheme}
            message={errorMessage || infoMessage}
            className={pickerStyle.fieldMessage}
          />
        )}
      </div>
    )
  }
}

export { RecipientPicker }
