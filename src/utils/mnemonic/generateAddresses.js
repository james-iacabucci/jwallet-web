// @flow

import { getAddressFromPublicKey } from 'utils/address'

import { getPublicHdRoot } from '.'

function generateAddress(hdRoot: HDPublicKey, index: number): string {
  const generatedKey: HDPublicKey = hdRoot.derive(index)
  const publicKey: string = generatedKey.publicKey.toString()

  return getAddressFromPublicKey(publicKey)
}

export async function generateAddresses(
  bip32XPublicKey: string,
  start: ?number,
  end: ?number,
): Promise<string[]> {
  const hdRoot: HDPublicKey = await getPublicHdRoot(bip32XPublicKey)
  const startIndex: number = start || 0
  const endIndex: number = end || startIndex
  const addressesCount: number = endIndex - startIndex

  // generate range from 0 to addressesCount
  return Array
    .from(new Array(addressesCount + 1).keys())
    .map((currentIndex: number): string => generateAddress(
      hdRoot,
      startIndex + currentIndex,
    ))
}
