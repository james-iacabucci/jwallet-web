// @flow

import type { CurrencyFormFieldValues } from '../routes/Currency/types'

export const INIT = '@@settings/INIT'
export const CHANGE_PAYMENT_PASSWORD = '@@settings/CHANGE_PAYMENT_PASSWORD'
export const CHANGE_LOCAL_CURRENCY = '@@settings/CHANGE_LOCAL_CURRENCY'

export function init() {
  return {
    type: INIT,
  }
}

export function changePaymentPassword(payload: PaymentPasswordForm) {
  return {
    type: CHANGE_PAYMENT_PASSWORD,
    payload,
  }
}

export function changeLocalCurrencyCode(payload: CurrencyFormFieldValues) {
  return {
    type: CHANGE_LOCAL_CURRENCY,
    currencyCode: payload.currencyCode,
  }
}

export type SettingsAction =
  ExtractReturn<typeof init>

const initialState: SettingsState = {
  localCurrencyCode: 'USD',
  defaultGasPrice: '30000',
  systemLanguageCode: 'en',
  hasPinCode: false,
}

const settings = (
  state: SettingsState = initialState,
  action: SettingsAction,
): SettingsState => {
  switch (action.type) {
    case INIT:
      return state
    case CHANGE_PAYMENT_PASSWORD:
      console.log(action, state)
      return state
    case CHANGE_LOCAL_CURRENCY:
      return {
        ...state,
        localCurrencyCode: action.currencyCode,
      }
    default:
      return state
  }
}

export default settings
