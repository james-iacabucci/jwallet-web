// @flow

import { t } from 'ttag'

import { generateAddresses } from 'utils/mnemonic'

import {
  getWallet,
  checkMnemonicType,
} from '.'

export async function getAddress(
  wallets: Wallets,
  walletId: string,
): Promise<Address> {
  const {
    type,
    address,
    bip32XPublicKey,
    addressIndex,
  }: Wallet = await getWallet(wallets, walletId)

  if (!checkMnemonicType(type)) {
    if (!address) {
      throw new Error(t`WalletDataError`)
    }

    return address
  }

  const indexStart: number = addressIndex || 0
  const indexEnd: number = indexStart + 1

  if (!bip32XPublicKey) {
    throw new Error(t`WalletDataError`)
  }

  const derivedAddresses: Address[] = await generateAddresses(bip32XPublicKey, indexStart, indexEnd)

  return derivedAddresses[0]
}
