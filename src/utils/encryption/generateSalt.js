// @flow

import { getBitcoreCrypto } from 'utils/mnemonic'

export async function generateSalt(byteCount: number): Promise<string> {
  const crypto = await getBitcoreCrypto()

  return crypto.Random.getRandomBuffer(byteCount).toString('base64')
}

export default generateSalt
