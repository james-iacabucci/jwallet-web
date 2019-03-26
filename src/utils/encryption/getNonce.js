// @flow

import nacl from 'tweetnacl'

export function getNonce(nonceLength: number): Promise<Uint8Array> {
  return Promise.resolve(nacl.randomBytes(nonceLength))
}
