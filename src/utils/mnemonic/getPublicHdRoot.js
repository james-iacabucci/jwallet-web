// @flow

import { getBitcore } from '.'

export async function getPublicHdRoot(bip32XPublicKey: string): Promise<HDPublicKey> {
  const bitcore = await getBitcore()

  return new bitcore.HDPublicKey(bip32XPublicKey)
}
