// @flow

import { t } from 'ttag'

import decryptData from 'utils/encryption/decryptData'

import {
  getWallet,
  checkMnemonicType,
} from '.'

function getMnemonic(
  wallets: Wallets,
  walletId: string,
  internalKey: Uint8Array,
  encryptionType: string,
): string {
  const {
    encrypted,
    type,
    isReadOnly,
  }: Wallet = getWallet(wallets, walletId)

  if (
    isReadOnly ||
    !checkMnemonicType(type) ||
    !encrypted.mnemonic
  ) {
    throw new Error(t`WalletDataError`)
  }

  return decryptData({
    // $FlowFixMe
    encryptionType,
    key: internalKey,
    data: encrypted.mnemonic,
  })
}

export default getMnemonic
