// @flow

import {
  checkAddressValid,
  checkPrivateKeyValid,
} from 'utils/address'

import {
  checkMnemonicValid,
  checkBip32XPublicKeyValid,
} from 'utils/mnemonic'

export async function getTypeByInput(data: ?string): Promise<?WalletCustomType> {
  if (!data) {
    return null
  } else if (await checkMnemonicValid(data)) {
    return 'mnemonic'
  } else if (checkBip32XPublicKeyValid(data)) {
    return 'bip32Xpub'
  } else if (checkPrivateKeyValid(data)) {
    return 'privateKey'
  } else if (checkAddressValid(data) || checkAddressValid(`0x${data}`)) {
    return 'address'
  }

  return null
}
