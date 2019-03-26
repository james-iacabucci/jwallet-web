// @flow

import { encryptData } from '.'

export async function encryptInternalKey(
  internalKey: Uint8Array,
  derivedKey: Uint8Array,
  encryptionType: string,
): Promise<EncryptedData> {
  return encryptData({
    encryptionType,
    key: derivedKey,
    data: internalKey.toString(),
  })
}
