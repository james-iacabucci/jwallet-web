// @flow

const BIP32_EXTENDABLE_PUBLIC_KEY_LENGTH: number = 111

export async function checkBip32XPublicKeyValid(bip32XPublicKey: string): Promise<boolean> {
  if (!bip32XPublicKey || (bip32XPublicKey.length !== BIP32_EXTENDABLE_PUBLIC_KEY_LENGTH)) {
    return false
  }

  const reLengthWithoutXPUB: number = BIP32_EXTENDABLE_PUBLIC_KEY_LENGTH - 4
  const re: RegExp = new RegExp(`^(xpub)([A-Z\\d]{${reLengthWithoutXPUB}})$`, 'i')

  return re.test(bip32XPublicKey)
}
