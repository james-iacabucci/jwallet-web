// @flow

import {
  getWallet,
  appendWallet,
  removeWallet,
} from '.'

export async function updateWallet(
  wallets: Wallets,
  walletId: string,
  updatedData: WalletUpdatedData,
): Promise<Wallets> {
  const {
    encrypted,
    name,
    network,
    derivationPath,
    customType,
    bip32XPublicKey,
    addressIndex,
    isReadOnly,
    isSimplified,
  }: WalletUpdatedData = updatedData

  const wallet: Wallet = await getWallet(wallets, walletId)

  const newWallet: Wallet = {
    ...wallet,
    encrypted: encrypted || wallet.encrypted,
    name: name || wallet.name,
    network: network || wallet.network,
    customType: customType || wallet.customType,
    derivationPath: derivationPath || wallet.derivationPath,
    bip32XPublicKey: bip32XPublicKey || wallet.bip32XPublicKey,
    addressIndex: (addressIndex != null) ? addressIndex : wallet.addressIndex,
    isReadOnly: (typeof (isReadOnly) === 'boolean') ? isReadOnly : wallet.isReadOnly,
    isSimplified: (typeof (isSimplified) === 'boolean') ? isSimplified : wallet.isSimplified,
  }

  const newWallets: Wallets = await removeWallet(wallets, walletId)

  return appendWallet(newWallets, newWallet)
}
