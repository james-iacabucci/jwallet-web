// @flow

import { actions as router5Actions } from 'redux-router5'
import { t } from 'ttag'

import {
  put,
  select,
  takeEvery,
} from 'redux-saga/effects'

import walletsWorker from 'workers/wallets'
import getWallet from 'utils/wallets/getWallet'

import {
  fileSaver,
} from 'services'

import {
  selectWallets,
  selectWalletsItems,
  selectWalletsBackup,
} from 'store/selectors/wallets'

import * as wallets from 'store/modules/wallets'
import * as walletsBackup from 'store/modules/walletsBackup'

function* openView(action: ExtractReturn<typeof walletsBackup.openView>): Saga<void> {
  yield put(wallets.clean())
  yield put(walletsBackup.clean())

  const items: ExtractReturn<typeof selectWalletsItems> = yield select(selectWalletsItems)

  try {
    getWallet(items, action.payload.walletId)
  } catch (err) {
    yield put(router5Actions.navigateTo('Wallets'))
  }
}

function* backupWallet(walletId: string): Saga<void> {
  const {
    persist,
    password,
  }: ExtractReturn<typeof selectWallets> = yield select(selectWallets)

  if (!password) {
    yield put(
      wallets.setInvalidField('password', t`Password should not be empty`),
    )

    return
  }

  yield put(wallets.setIsLoading(true))
  yield walletsWorker.backupRequest(persist, walletId, password)
}

function* backupError(action: { payload: Error }): Saga<void> {
  yield put(wallets.setInvalidField('password', action.payload.message))
  yield put(wallets.setIsLoading(false))
}

function* backupSuccess(): Saga<void> {
  yield put(wallets.setIsLoading(false))
  yield put(walletsBackup.setCurrentStep(walletsBackup.STEPS.PRIVATE))
}

function* setNextStep(action: ExtractReturn<typeof walletsBackup.goToNextStep>): Saga<void> {
  const { walletId } = action.payload

  const { currentStep }: ExtractReturn<typeof selectWalletsBackup> =
    yield select(selectWalletsBackup)

  switch (currentStep) {
    case walletsBackup.STEPS.PASSWORD: {
      yield* backupWallet(walletId)

      break
    }

    default:
      break
  }
}

function* setPrevStep(): Saga<void> {
  const { currentStep }: ExtractReturn<typeof selectWalletsBackup> =
    yield select(selectWalletsBackup)

  switch (currentStep) {
    case walletsBackup.STEPS.PASSWORD: {
      yield put(router5Actions.navigateTo('Wallets'))

      break
    }

    case walletsBackup.STEPS.PRIVATE: {
      yield put(walletsBackup.setCurrentStep(walletsBackup.STEPS.PASSWORD))

      break
    }

    default:
      break
  }
}

function* downloadToTxt(): Saga<void> {
  const { data }: ExtractReturn<typeof selectWalletsBackup> = yield select(selectWalletsBackup)
  fileSaver.saveTXT(data, 'jwallet-backup')
}

export function* walletsBackupRootSaga(): Saga<void> {
  yield takeEvery(walletsBackup.OPEN_VIEW, openView)
  yield takeEvery(walletsBackup.GO_TO_NEXT_STEP, setNextStep)
  yield takeEvery(walletsBackup.GO_TO_PREV_STEP, setPrevStep)
  yield takeEvery(walletsBackup.BACKUP_ERROR, backupError)
  yield takeEvery(walletsBackup.BACKUP_SUCCESS, backupSuccess)
  yield takeEvery(walletsBackup.DOWNLOAD_TO_TXT, downloadToTxt)
}
