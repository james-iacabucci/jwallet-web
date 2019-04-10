// @flow

import React from 'react'
import classNames from 'classnames'
import { camelCase } from 'lodash-es'

import pickerCurrentStyle from './pickerCurrent.m.scss'

type Props = {
  value: string,
  onInputChange: Function,
  onInputFocus: Function,
  onInputBlur: Function,
  onClick: Function,
  isEditable: boolean,
  hasError: boolean,
  label: string,
  iconRenderer: Function,
}

function PickerCurrent({
  value,
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
      )}
      onClick={onClick}
    >
      <input
        id={id}
        type='text'
        className={pickerCurrentStyle.input}
        placeholder={value}
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

PickerCurrent.defaultProps = {
  value: '',
  lebel: '',
  editable: false,
}

export { PickerCurrent }
