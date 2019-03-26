// @flow

import config from 'config'

import { getNonce } from '.'

const SALT_BYTES_COUNT = 32

export async function getPasswordOptions(passwordHint: string): Promise<PasswordOptions> {
  const nonce: Uint8Array = await getNonce(SALT_BYTES_COUNT)

  return {
    passwordHint: passwordHint || '',
    scryptParams: config.defaultScryptParams,
    salt: Buffer.from(nonce).toString('base64'),
    encryptionType: config.defaultEncryptionType,
    saltBytesCount: SALT_BYTES_COUNT,
    derivedKeyLength: config.defaultDerivationKeyLength,
  }
}
