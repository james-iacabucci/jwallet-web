// @flow strict

import * as React from 'react'
import classNames from 'classnames'

import { JFieldMessage } from 'components/base'
import { getErrorMessage } from 'utils/form'

import pickerStyle from './recipientPicker.module.scss'

type RendererParams = {|
  +isOpened: boolean,
  +isDisabled: boolean,
|}

// type PickerKey = 'UP' | 'DOWN' | 'RIGHT' | 'LEFT'

type Props = {|
  +children: React$Node,
  +className: string,
  +isDisabled: boolean,
  +infoMessage: string,
  +validateType: FinalFormValidateType,
  +meta: FinalFormMeta,
  // +onKeyPress: (key: PickerKey) => any,
  +currentRenderer: (params: RendererParams) => React$Node,
  +tabsRenderer: ?((params: RendererParams) => React$Node),
|}

type StateProps = {|
  isOpened: boolean,
|}

class RecipientPicker extends React.Component<Props, StateProps> {
  static defaultProps = {
    className: '',
    currentRenderer: null,
    isDisabled: false,
    tabsRenderer: null,
    meta: {},
    validateType: 'touched',
  }

  state: StateProps = {
    isOpened: false,
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.close)
  }

  open = () => {
    this.setState({ isOpened: true }, () => {
      document.addEventListener('click', this.close)
    })
  }

  close = () => {
    document.removeEventListener('click', this.close)
    this.setState({ isOpened: false })
  }

  toggle = () => {
    if (this.state.isOpened) {
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

    const { isOpened } = this.state

    const errorMessage = getErrorMessage(meta, validateType)
    const hasError = !!errorMessage
    const hasInfo = !!infoMessage
    const hasMessage = (hasError || hasInfo)
    const messageTheme = hasError
      ? 'error'
      : 'info'

    const rendererParams = {
      isDisabled,
      isOpened,
    }

    return (
      <div className={classNames(
        pickerStyle.core,
        isDisabled && pickerStyle.disabled,
        isOpened && pickerStyle.opened,
        className,
      )}
      >
        <div className={classNames(pickerStyle.wrap)}>
          <div className={pickerStyle.current}>
            {this.props.currentRenderer(rendererParams)}
          </div>
          <div className={pickerStyle.chevron} />
        </div>
        <div className={pickerStyle.popdown}>
          <div className={pickerStyle.current}>
            {this.props.currentRenderer(rendererParams)}
          </div>
          {this.props.tabsRenderer && (
            <div className={pickerStyle.tabs}>
              {this.props.tabsRenderer(rendererParams)}
            </div>
          )}
          <div className={pickerStyle.list}>
            {children}
          </div>
        </div>
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
