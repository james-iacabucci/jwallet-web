// @flow

import { t } from 'ttag'

import { checkMnemonicType } from 'utils/wallets'

import {
  decryptData,
  encryptData,
} from 'utils/encryption'

export async function reEncryptWallet(
  wallet: Wallet,
  internalKey: Uint8Array,
  encryptionType: string,
  internalKeyNew: Uint8Array,
  encryptionTypeNew: string,
): Promise<Wallet> {
  const {
    type,
    encrypted,
    isReadOnly,
  }: Wallet = wallet

  if (isReadOnly) {
    return wallet
  }

  if (checkMnemonicType(type) && encrypted.mnemonic && encrypted.passphrase) {
    const mnemonic: string = await decryptData({
      encryptionType,
      key: internalKey,
      data: encrypted.mnemonic,
    })

    const passphrase: string = await decryptData({
      encryptionType,
      key: internalKey,
      // $FlowFixMe
      data: encrypted.passphrase,
    })

    return {
      ...wallet,
      encrypted: {
        ...encrypted,
        mnemonic: await encryptData({
          data: mnemonic,
          key: internalKeyNew,
          encryptionType: encryptionTypeNew,
        }),
        passphrase: await encryptData({
          data: passphrase,
          key: internalKeyNew,
          encryptionType: encryptionTypeNew,
        }),
      },
    }
  } else if (!checkMnemonicType(type) && encrypted.privateKey) {
    const privateKey: string = await decryptData({
      encryptionType,
      key: internalKey,
      data: encrypted.privateKey,
    })

    return {
      ...wallet,
      encrypted: {
        ...encrypted,
        privateKey: await encryptData({
          data: privateKey,
          key: internalKeyNew,
          encryptionType: encryptionTypeNew,
        }),
      },
    }
  }

  throw new Error(t`WalletDataError`)
}
