import { gaSendEvent } from 'utils/analytics'

import {
  STEPS as CREATE_STEPS,
  GO_TO_NEXT_STEP as CREATE_GO_TO_NEXT_STEP,
} from 'store/modules/walletsCreate'
import {
  STEPS as IMPORT_STEPS,
  GO_TO_NEXT_STEP as IMPORT_GO_TO_NEXT_STEP,
} from 'store/modules/walletsImport'
import {
  CREATE_SUCCESS,
} from 'store/modules/wallets'

import {
  selectWalletsCreate,
  selectWalletsImport,
} from 'store/selectors/wallets'

const CREATION_EVENTS = {
  [CREATE_STEPS.NAME]: 'NameCreated',
  [CREATE_STEPS.PASSWORD]: 'PaymentPasswordEntered',
}

const IMPORT_EVENTS = {
  [IMPORT_STEPS.NAME]: 'NameCreated',
  [IMPORT_STEPS.DATA]: 'DataImported',
  [IMPORT_STEPS.PASSWORD]: 'PaymentPasswordEntered',
}

export const newWalletEvents = (state, action) => {
  switch (action.type) {
    case CREATE_GO_TO_NEXT_STEP: {
      const walletsCreate = selectWalletsCreate(state)
      gaSendEvent('CreateWallet', CREATION_EVENTS[walletsCreate.currentStep])

      break
    }
    case CREATE_SUCCESS: {
      const walletsCreate = selectWalletsCreate(state)
      const walletsImport = selectWalletsImport(state)

      if (walletsCreate.currentStep !== CREATE_STEPS.NAME) {
        gaSendEvent('CreateWallet', 'WalletCreated')
      } else if (walletsImport.currentStep !== IMPORT_STEPS.NAME) {
        gaSendEvent('ImportWallet', 'WalletCreated')
      }

      break
    }
    case IMPORT_GO_TO_NEXT_STEP: {
      const walletsImport = selectWalletsImport(state)
      gaSendEvent('ImportWallet', IMPORT_EVENTS[walletsImport.currentStep])

      break
    }
    default: {
      // skip
    }
  }
}
