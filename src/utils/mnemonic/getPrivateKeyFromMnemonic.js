// @flow

import { getPrivateHdRoot } from '.'

export async function getPrivateKeyFromMnemonic(
  mnemonic: string,
  addressIndex: number,
  passphrase: string,
  derivationPath: string,
  network: ?NetworkId,
): Promise<string> {
  const hdRoot: HDPrivateKey = await getPrivateHdRoot(mnemonic, passphrase, derivationPath, network)
  const generatedKey: HDPrivateKey = hdRoot.derive(addressIndex)

  return generatedKey.privateKey.toString()
}
