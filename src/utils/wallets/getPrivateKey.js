// @flow

import { t } from 'ttag'

import { decryptData } from 'utils/encryption'
import { getPrivateKeyFromMnemonic } from 'utils/mnemonic'

import { checkMnemonicType } from '.'

export async function getPrivateKey(
  wallet: Wallet,
  internalKey: Uint8Array,
  encryptionType: string,
): Promise<string> {
  const {
    encrypted,
    type,
    isReadOnly,
  }: Wallet = wallet

  if (isReadOnly) {
    throw new Error(t`WalletDataError`)
  }

  if (checkMnemonicType(type)) {
    const {
      addressIndex,
      derivationPath,
    }: Wallet = wallet

    if (
      !encrypted.mnemonic ||
      !encrypted.passphrase ||
      !derivationPath
    ) {
      throw new Error(t`WalletDataError`)
    }

    const mnemonic: string = await decryptData({
      encryptionType,
      key: internalKey,
      data: encrypted.mnemonic,
    })

    return getPrivateKeyFromMnemonic(
      mnemonic,
      addressIndex || 0,
      await decryptData({
        encryptionType,
        key: internalKey,
        // $FlowFixMe
        data: encrypted.passphrase,
      }),
      derivationPath,
    )
  } else {
    if (!encrypted.privateKey) {
      throw new Error(t`WalletDataError`)
    }

    return decryptData({
      encryptionType,
      key: internalKey,
      data: encrypted.privateKey,
    })
  }
}
