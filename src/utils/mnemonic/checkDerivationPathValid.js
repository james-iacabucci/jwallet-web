// @flow

import { getBitcore } from '.'

export async function checkDerivationPathValid(derivationPath: string): Promise<boolean> {
  const bitcore = await getBitcore()

  return bitcore.HDPrivateKey.isValidPath(derivationPath)
}
