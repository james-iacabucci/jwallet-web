// @flow
import React from 'react'
import PasswordField from 'components/PasswordField/index'

type PProps = {
  onChange: (name: string, value: mixed) => void,
  isLoading: ?boolean,
  values: ?Object,
}

const text = {
  passwordNew: 'New security password',
  passwordNewConfirm: 'Repeat security password',
}

const handlerChange = name => f => value => f(name, value)

function PasswordFieldFinalFormAdapter(props: PProps) {
  const { onChange, isLoading, values } = props

  return (
    <PasswordField
      onChange={handlerChange('passwordNew')(onChange)}
      onChangeConfirm={handlerChange('passwordNewConfirm')(onChange)}
      invalidFields={{}}
      value={values ? values.passwordNew : ''}
      placeholder={text.passwordNew}
      valueConfirm={values ? values.passwordNewConfirm : ''}
      placeholderConfirm={text.passwordNewConfirm}
      isDisabled={Boolean(isLoading)}
      color='gray'
    />
  )
}

export default PasswordFieldFinalFormAdapter
