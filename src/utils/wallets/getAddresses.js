// @flow

import { t } from 'ttag'

import { generateAddresses } from 'utils/mnemonic'

import {
  getWallet,
  checkMnemonicType,
} from '.'

export async function getAddresses(
  wallets: Wallets,
  walletId: string,
  start: number,
  end: number,
): Promise<Address[]> {
  const {
    type,
    bip32XPublicKey,
  }: Wallet = await getWallet(wallets, walletId)

  if (!checkMnemonicType(type) || !bip32XPublicKey) {
    throw new Error(t`WalletDataError`)
  }

  return generateAddresses(bip32XPublicKey, start, end)
}
