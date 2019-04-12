// @flow

import React from 'react'
import { t } from 'ttag'

import {
  JInput,
  JRaisedButton,
} from 'components/base'

type Props = {|
  +submit: () => void,
  +onChange: (value: string) => void,
  +value: string,
  +errorMessage: string,
  +isLoading: boolean,
|}

function DigitalAssetsSendConfirmPassword({
  submit,
  onChange,
  value,
  errorMessage,
  isLoading,
}: Props) {
  return (
    <div className='digital-assets-send-confirm-password'>
      <div className='form'>
        <JInput
          onChange={onChange}
          value={value}
          errorMessage={errorMessage}
          color='gray'
          type='password'
          name='password'
          placeholder={t`Payment password`}
          isDisabled={isLoading}
        />
        <div className='actions'>
          <JRaisedButton
            onClick={submit}
            isLoading={isLoading}
          >{t`Send asset`}
          </JRaisedButton>
        </div>
      </div>
    </div>
  )
}

export default DigitalAssetsSendConfirmPassword
