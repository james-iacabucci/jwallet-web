// @flow

import { getBitcoreMnemonic } from '.'

export async function checkMnemonicValid(mnemonic: string): Promise<boolean> {
  try {
    const Mnemonic = await getBitcoreMnemonic()

    return Mnemonic.isValid(mnemonic, Mnemonic.Words.ENGLISH)
  } catch (err) {
    return false
  }
}
