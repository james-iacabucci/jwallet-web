// @flow

import React from 'react'
import classNames from 'classnames'
import { camelCase } from 'lodash-es'

import pickerCurrentStyle from './jPickerCurrent.m.scss'

type Props = {
  +value: string,
  +inputValue: string,
  +label: string,
  +onInputChange: Function,
  +onInputFocus: Function,
  +onInputBlur: Function,
  +onClick: Function,
  +isEditable: boolean,
  +hasError: boolean,
  +iconRenderer: Function,
}

function JPickerCurrent({
  value,
  inputValue,
  label,
  isEditable,
  hasError,
  onClick,
  onInputChange,
  onInputFocus,
  onInputBlur,
  iconRenderer,
}: Props) {
  const hasValue = !!value
  const id = camelCase(`${label}currentId`)

  return (
    <div
      className={classNames(
        pickerCurrentStyle.core,
        hasError && pickerCurrentStyle.error,
        isEditable && pickerCurrentStyle.editble,
        hasValue && pickerCurrentStyle.value,
        iconRenderer && pickerCurrentStyle.hasIcon,
      )}
      onClick={onClick}
    >
      <input
        id={id}
        type='text'
        className={pickerCurrentStyle.input}
        placeholder={value}
        value={inputValue}
        disabled={!isEditable}
        onChange={onInputChange}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
      />
      <label className={pickerCurrentStyle.label} htmlFor={id}>
        {label}
      </label>
      {iconRenderer && (
        <div className={pickerCurrentStyle.icon}>
          {iconRenderer()}
        </div>
      )}
    </div>
  )
}

JPickerCurrent.defaultProps = {
  value: '',
  lebel: '',
  isEditable: true,
  editable: false,
}

export { JPickerCurrent }
