// @flow

const MNEMONIC_WALLET_TYPE = 'mnemonic'

export async function checkMnemonicType(walletType: ?WalletType): Promise<boolean> {
  return (walletType === MNEMONIC_WALLET_TYPE)
}
