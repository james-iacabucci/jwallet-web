// @flow

import {
  getHdPath,
  getBitcore,
} from '.'

export async function getPrivateHdRoot(
  mnemonic: string,
  passphrase: string,
  derivationPath: string,
  network: ?NetworkId,
): Promise<HDPrivateKey> {
  const hdPath: string = await getHdPath(mnemonic, passphrase, derivationPath, network)
  const bitcore = await getBitcore()

  return new bitcore.HDPrivateKey(hdPath)
}
