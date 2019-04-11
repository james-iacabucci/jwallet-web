// @flow

import React, { PureComponent } from 'react'
import classNames from 'classnames'

import { JIcon } from 'components/base'

import handleTargetValue from 'utils/eventHandlers/handleTargetValue'

type JInputValue = string | number
type JInputOnChangeHandler = (string) => void
type JInputIconPosition = 'left' | 'right'
export type JInputColor = 'gray' | 'white'
export type JInputType = 'text' | 'password'
type JInputSideBorderRadius = 'all' | 'top' | 'left' | 'bottom' | 'right'

type Props = {|
  +onChange: ?JInputOnChangeHandler,
  onFocus?: Function,
  onBlur?: Function,
  +name: ?string,
  +label: ?string,
  +value: ?JInputValue,
  +placeholder: ?string,
  +infoMessage: ?string,
  +errorMessage: ?string,
  +color: JInputColor,
  +type: JInputType,
  +iconPosition: ?JInputIconPosition,
  +sideBorderRadius: JInputSideBorderRadius,
  +rows: ?number,
  +isLoading: boolean,
  +isPinCode: boolean,
  +isDisabled: boolean,
  +isAutoFocus: boolean,
  +isVirtualHalfSize: boolean,
  withIndicator?: boolean,
|}

type ChildrenProps = {|
  +onChange: ?Function,
  onBlur?: Function,
  onFocus?: Function,
  +name: ?string,
  +className: string,
  +value: ?JInputValue,
  +placeholder: ?string,
  +disabled: boolean,
  +autoFocus: boolean,
|}

const noop = () => {}

const MAX_ROWS = 12

class JInput extends PureComponent<Props> {
  static defaultProps = {
    onChange: null,
    onFocus: noop,
    onBlur: noop,
    name: '',
    label: '',
    value: '',
    type: 'text',
    sideBorderRadius: 'all',
    iconPosition: null,
    color: 'white',
    placeholder: '',
    infoMessage: null,
    errorMessage: null,
    rows: 0,
    isLoading: false,
    isPinCode: false,
    isDisabled: false,
    isAutoFocus: false,
    isVirtualHalfSize: false,
    withIndicator: false,
  }

  componentDidUpdate() {
    if (this.textarea.current) {
      const { current } = this.textarea

      while (
        current.clientHeight < current.scrollHeight &&
        current.rows <= MAX_ROWS
      ) {
        // mutating the DOM
        // eslint-disable-next-line fp/no-mutation
        current.rows += 1
      }
    }
  }

  textarea = React.createRef()

  render() {
    const {
      onChange,
      onBlur,
      onFocus,
      type,
      name,
      rows,
      color,
      label,
      value,
      sideBorderRadius,
      placeholder,
      infoMessage,
      errorMessage,
      iconPosition,
      isLoading,
      isPinCode,
      isDisabled,
      isAutoFocus,
      isVirtualHalfSize,
      withIndicator,
    } = this.props

    const isMultiline: boolean = !!rows
    const labelOrPlaceholder: ?string = label || placeholder
    const hasTopLabel: boolean = (color === 'gray') && !!labelOrPlaceholder

    const baseProps: ChildrenProps = {
      name,
      value,
      onChange: onChange ? handleTargetValue(onChange) : undefined,
      className: `input -side-border-radius-${sideBorderRadius}`,
      disabled: isDisabled,
      autoFocus: isAutoFocus,
      placeholder: labelOrPlaceholder,
      onBlur,
      onFocus,
    }

    const children = isMultiline
      ? <textarea {...baseProps} rows={rows} ref={this.textarea} />
      : <input {...baseProps} type={type} />

    return (
      <div
        className={classNames(
          `j-input -${type} -${color}`,
          !!value && '-value',
          infoMessage && '-info',
          isLoading && '-loading',
          isPinCode && '-pincode',
          errorMessage && '-error',
          isDisabled && '-disabled',
          hasTopLabel && '-has-label',
          isMultiline && '-multiline',
          isVirtualHalfSize && '-virtual-half-size',
          withIndicator && '-with-indicator',
          iconPosition && `-icon-posotion-${iconPosition}`,
        )}
      >
        {children}
        {hasTopLabel && <div className='label'>{labelOrPlaceholder}</div>}
        {!errorMessage && infoMessage && <div className='info'>{infoMessage}</div>}
        {errorMessage && <div className='error'>{errorMessage}</div>}
        <div className='loader' />
        {isDisabled && (
          <div className='lock'>
            <JIcon
              color={color}
              name='padding-lock'
            />
          </div>
        )}
      </div>
    )
  }
}

export default JInput
