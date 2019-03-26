// @flow

import {
  getBitcore,
  getBitcoreMnemonic,
} from '.'

export async function getHdPath(
  mnemonic: string,
  passphrase: string,
  derivationPath: string,
  network: ?NetworkId,
): Promise<string> {
  const Mnemonic = await getBitcoreMnemonic()
  const hdRoot: string = new Mnemonic(mnemonic.trim()).toHDPrivateKey(passphrase, network).xprivkey
  const bitcore = await getBitcore()
  const hdRootKey: HDPrivateKey = new bitcore.HDPrivateKey(hdRoot)

  return hdRootKey.derive(derivationPath).xprivkey
}
