// @flow

import scrypt from 'scryptsy'

export async function deriveKeyFromPassword(
  password: string,
  scryptParams: ScryptParams,
  derivedKeyLength: number,
  salt: string,
): Promise<Uint8Array> {
  const {
    N,
    r,
    p,
  }: ScryptParams = scryptParams

  const derivedKey: Buffer = scrypt(password, salt, N, r, p, derivedKeyLength)

  return new Uint8Array(derivedKey)
}
