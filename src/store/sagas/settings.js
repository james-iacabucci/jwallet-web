// @flow

import {
  put,
  select,
  takeEvery,
} from 'redux-saga/effects'

import validatePassword from 'utils/password/validate'
import { router5BackOrFallbackFunctionCreator } from 'utils/browser'
import * as ticker from 'store/modules/ticker'
import * as settingsWorker from 'workers/settings/wrapper'

import * as settings from 'store/modules/settings'

export function* changePaymentPassword({ payload }: Object): Saga<void> {
  yield put(settings.changePaymentPasswordPending(true))

  const validationMessages = validatePassword(payload)

  yield put(settings.validationPasswordForm(validationMessages))

  if (!Object.keys(validationMessages).length) {
    const state = yield select()
    yield settingsWorker.changePassword(state, payload)
  }
}

export function* setFiatCurrency(): Saga<void> {
  yield put(ticker.syncRestart())
  const state = yield select()

  router5BackOrFallbackFunctionCreator(
    state.router.previousRoute,
    'Wallet',
  )()
}

export function* settingsRootSaga(): Saga<void> {
  yield takeEvery(settings.SET_FIAT_CURRENCY, setFiatCurrency)
  yield takeEvery(settings.CHANGE_PAYMENT_PASSWORD, changePaymentPassword)
}
