// @flow

import { isEmpty } from 'ramda'
import { push } from 'react-router-redux'

import keystore from 'services/keystore'
import isMnemonicType from 'utils/isMnemonicType'

/**
 * Funds
 */
import * as receiveFunds from 'routes/Funds/routes/ReceiveFunds/modules/receiveFunds'
import * as sendFunds from 'routes/Funds/routes/SendFunds/modules/sendFunds'

/**
 * Digital Assets
 */
import * as addCustomAsset from 'routes/AddCustomAsset/modules/addCustomAsset'

/**
 * Wallets
 */
import * as wallets from 'routes/Wallets/modules/wallets'
import * as mnemonicAddresses from 'routes/Wallets/routes/Addresses/modules/mnemonicAddresses'
import * as editWallet from 'routes/Wallets/routes/EditWallet/modules/editWallet'
import * as backupWallet from 'routes/Wallets/routes/BackupWallet/modules/backupWallet'
import * as changeWalletPassword from 'routes/Wallets/routes/ChangeWalletPassword/modules/changeWalletPassword' // eslint-disable-line max-len
import * as removeWallet from 'routes/Wallets/routes/RemoveWallet/modules/removeWallet'

export const redirect = (store: Store) => (next: Next) => (action: FSA) => {
  const { type, payload }: FSA = action
  const goToLocation = (location: string): void => store.dispatch(push(location))

  switch (type) {
    /**
     * Funds
     */
    case receiveFunds.CLOSE:
    case sendFunds.CLOSE:
    case sendFunds.SEND_SUCCESS: {
      goToLocation('/')
      break
    }

    /**
     * Digital Assets
     */
    case addCustomAsset.ADD_SUCCESS: {
      goToLocation('/')
      break
    }

    /**
     * Wallets
     */
    case wallets.OPEN: {
      try {
        const wallets: Wallets = store.getState().wallets.items

        if (isEmpty(wallets)) {
          goToLocation('/wallets/start')
        }
      } catch (err) {
        goToLocation('/wallets/start')
      }

      break
    }

    case mnemonicAddresses.OPEN: {
      try {
        const walletId: ?WalletId = store.getState().wallets.activeWalletId

        if (!walletId) {
          goToLocation('/wallets')
        } else {
          const { type }: Wallet = keystore.getWallet(walletId)

          if (!isMnemonicType(type)) {
            goToLocation('/wallets')
          }
        }
      } catch (err) {
        goToLocation('/wallets')
      }

      break
    }

    case editWallet.OPEN:
    case backupWallet.OPEN:
    case removeWallet.OPEN: {
      try {
        const walletId: ?WalletId = store.getState().wallets.activeWalletId

        if (!walletId) {
          goToLocation('/wallets')
        }
      } catch (err) {
        goToLocation('/wallets')
      }

      break
    }

    case changeWalletPassword.OPEN: {
      try {
        const walletId: ?WalletId = store.getState().wallets.activeWalletId

        if (!walletId) {
          goToLocation('/wallets')
        } else {
          const { isReadOnly }: Wallet = keystore.getWallet(walletId)

          if (isReadOnly) {
            goToLocation('/wallets')
          }
        }
      } catch (err) {
        goToLocation('/wallets')
      }

      break
    }

    case wallets.SET_ACTIVE_SUCCESS: {
      if (isMnemonicType(payload.walletType)) {
        goToLocation('/wallets/addresses')
      } else if (payload.walletAction) {
        goToLocation(`/wallets/${payload.walletAction}`)
      } else {
        goToLocation('/')
      }

      break
    }

    case mnemonicAddresses.SET_ACTIVE_SUCCESS: {
      const { walletAction }: WalletsData = store.getState().wallets

      if (walletAction) {
        goToLocation(`/wallets/${walletAction}`)
      } else {
        goToLocation('/')
      }

      break
    }

    case editWallet.EDIT_SUCCESS:
    case backupWallet.BACKUP_SUCCESS:
    case changeWalletPassword.CHANGE_PASSWORD_SUCCESS: {
      goToLocation('/')
      break
    }

    case removeWallet.REMOVE_SUCCESS: {
      goToLocation('/wallets')
      break
    }

    default: break
  }

  return next(action)
}
