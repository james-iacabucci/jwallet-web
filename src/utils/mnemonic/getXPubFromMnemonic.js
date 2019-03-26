// @flow

import { getPrivateHdRoot } from '.'

export async function getXPubFromMnemonic(
  mnemonic: string,
  passphrase: string,
  derivationPath: string,
  network?: ?NetworkId = null,
): Promise<string> {
  const hdRoot: HDPrivateKey = await getPrivateHdRoot(mnemonic, passphrase, derivationPath, network)

  return hdRoot.hdPublicKey.toString()
}
