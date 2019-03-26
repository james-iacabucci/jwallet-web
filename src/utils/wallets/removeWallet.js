// @flow

import { getWallet } from '.'

export async function removeWallet(wallets: Wallets, walletId: string): Promise<Wallets> {
  const wallet: Wallet = await getWallet(wallets, walletId)

  return wallets.filter(({ id }: Wallet): boolean => (wallet.id !== id))
}
