// @flow

export async function getBitcore(): Promise<Object> {
  const { default: bitcore } = await import(/* webpackChunkName: "bitcore-lib" */ 'bitcore-lib')

  return bitcore
}

export async function getBitcoreCrypto(): Promise<Object> {
  const { crypto } = await import(/* webpackChunkName: "bitcore-lib" */ 'bitcore-lib')

  return crypto
}

export async function getBitcoreMnemonic(): Promise<Object> {
  const { default: Mnemonic } =
    await import(/* webpackChunkName: "bitcore-mnemonic" */ 'bitcore-mnemonic')

  return Mnemonic
}
