// @flow

import {
  getWallet,
  getMnemonic,
  getPrivateKey,
  checkMnemonicType,
} from '.'

export async function getBackupData(
  wallets: Wallets,
  walletId: string,
  internalKey: Uint8Array,
  encryptionType: string,
): Promise<string> {
  const wallet: Wallet = await getWallet(wallets, walletId)

  if (checkMnemonicType(wallet.type)) {
    return getMnemonic(wallets, walletId, internalKey, encryptionType)
  } else {
    return getPrivateKey(wallet, internalKey, encryptionType)
  }
}
