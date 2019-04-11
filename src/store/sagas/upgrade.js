// @flow

import {
  put,
  select,
  takeEvery,
} from 'redux-saga/effects'

import walletsWorker from 'workers/wallets'
import { router5BackOrFallbackFunctionCreator } from 'utils/browser'
import { selectWallets } from 'store/selectors/wallets'

import * as wallets from 'store/modules/wallets'

import * as upgrade from '../modules/upgrade'

function* upgradeSuccess(action: ExtractReturn<typeof upgrade.upgradeSuccess>): Saga<void> {
  yield put(wallets.setWalletsItems(action.payload.items))
  const state = yield select()

  router5BackOrFallbackFunctionCreator(
    state.router.previousRoute,
    'Wallet',
  )()
}

function* submitMnemonicRequest(
  action: ExtractReturn<typeof upgrade.submitMnemonicRequest>,
): Saga<void> {
  const {
    password,
    mnemonic,
    passphrase,
    derivationPath,
  } = action.payload

  const walletsData: ExtractReturn<typeof selectWallets> = yield select(selectWallets)

  walletsWorker.upgradeRequest(
    walletsData,
    password,
    mnemonic,
    passphrase,
    derivationPath,
  )
}

function* submitPrivateKeyRequest(
  action: ExtractReturn<typeof upgrade.submitPrivateKeyRequest>,
): Saga<void> {
  const {
    password,
    privateKey,
  } = action.payload

  const walletsData: ExtractReturn<typeof selectWallets> = yield select(selectWallets)
  walletsWorker.upgradeRequest(walletsData, password, privateKey)
}

function* clean(): Saga<void> {
  yield put(upgrade.clean())
}

export function* upgradeRootSaga(): Saga<void> {
  yield takeEvery(upgrade.OPEN_VIEW, clean)
  yield takeEvery(upgrade.UPGRADE_SUCCESS, upgradeSuccess)
  yield takeEvery(upgrade.SUBMIT_MNEMONIC_REQUEST, submitMnemonicRequest)
  yield takeEvery(upgrade.SUBMIT_PRIVATE_KEY_REQUEST, submitPrivateKeyRequest)
}
