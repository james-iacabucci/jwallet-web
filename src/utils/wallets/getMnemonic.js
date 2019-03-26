// @flow

import { t } from 'ttag'

import { decryptData } from 'utils/encryption'

import {
  getWallet,
  checkMnemonicType,
} from '.'

export async function getMnemonic(
  wallets: Wallets,
  walletId: string,
  internalKey: Uint8Array,
  encryptionType: string,
): Promise<string> {
  const {
    encrypted,
    type,
    isReadOnly,
  }: Wallet = await getWallet(wallets, walletId)

  if (
    isReadOnly ||
    !checkMnemonicType(type) ||
    !encrypted.mnemonic
  ) {
    throw new Error(t`WalletDataError`)
  }

  return decryptData({
    encryptionType,
    key: internalKey,
    data: encrypted.mnemonic,
  })
}
