// @flow

import React from 'react'

import JInput, {
  type JInputType,
  type JInputColor,
} from './JInput'

type InputValidateType = 'touched' |
  'visited' |
  'dirtySinceLastSubmit'

type Props = {|
  +input: Object,
  +meta: Object,
  +label: string,
  type?: JInputType,
  +color: JInputColor,
  placeholder?: string,
  helpMessage?: string,
  errorMessage?: string,
  validateType?: InputValidateType,
  isLoading?: boolean,
  isAutoFocus?: boolean,
  isPinCode?: boolean,
  isDisabled?: boolean,
  rows: ?number,
|}

function JInputField(props: Props) {
  const {
    input,
    meta,
    label,
    placeholder,
    color,
    type,
    validateType,
    helpMessage,
    errorMessage,
    isLoading,
    isAutoFocus,
    isDisabled,
    isPinCode,
    rows,
  } = props

  const {
    onBlur: handleBlur,
    onFocus: handleFocus,
    onChange: handleChange,
  } = input

  const error = meta.error || meta.submitError

  return (
    <JInput
      onBlur={handleBlur}
      onFocus={handleFocus}
      onChange={handleChange}
      name={input.name}
      label={label}
      value={input.value}
      placeholder={placeholder}
      helpMessage={helpMessage}
      errorMessage={errorMessage || (
        !meta[validateType] && error
          ? error
          : undefined
      )}
      color={color}
      type={type}
      isLoading={isLoading}
      isPinCode={isPinCode}
      isDisabled={isDisabled}
      isAutoFocus={isAutoFocus}
      rows={rows}
    />
  )
}

JInputField.defaultProps = {
  placeholder: undefined,
  type: 'text',
  validateType: 'touched',
  helpMessage: undefined,
  errorMessage: undefined,
  isLoading: false,
  isAutoFocus: false,
  isPinCode: false,
  isDisabled: false,
}

export default JInputField
