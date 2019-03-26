// @flow

import config from 'config'

const DEFAULT_NETWORK: string = 'livenet'

export async function getMnemonicOptions(options: ?MnemonicOptionsUser): Promise<MnemonicOptions> {
  return !options ? {
    passphrase: '',
    network: DEFAULT_NETWORK,
    derivationPath: config.defaultDerivationPath,
  } : {
    passphrase: options.passphrase || '',
    network: options.network || DEFAULT_NETWORK,
    derivationPath: options.derivationPath || config.defaultDerivationPath,
  }
}
