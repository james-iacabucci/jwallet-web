// @flow

import { t } from 'ttag'

function checkWalletUniqueness(
  wallets: Wallets,
  uniqueProperty: string,
  propertyName: string,
): void {
  const foundWallet: ?Wallet = wallets.find((wallet: Wallet): boolean => {
    const propertyValue: string = wallet[propertyName]

    return propertyValue ? (propertyValue.toLowerCase() === uniqueProperty.toLowerCase()) : false
  })

  if (foundWallet) {
    throw new Error(t`Wallet with such ${foundWallet.name} already exists`)
  }
}

export default checkWalletUniqueness
