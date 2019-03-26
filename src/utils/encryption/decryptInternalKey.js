// @flow

import config from 'config'

import {
  getNonce,
  decryptData,
} from '.'

export async function decryptInternalKey(
  internalKey: ?EncryptedData,
  derivedKey: Uint8Array,
  encryptionType: string,
): Promise<Uint8Array> {
  if (!internalKey) {
    return getNonce(config.defaultDerivationKeyLength)
  }

  const key: string = await decryptData({
    encryptionType,
    key: derivedKey,
    data: internalKey,
  })

  return new Uint8Array(key.split(',').map(i => parseInt(i, 10)))
}
