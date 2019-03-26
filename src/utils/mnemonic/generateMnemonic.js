// @flow

import { t } from 'ttag'

import config from 'config'

import {
  getBitcoreCrypto,
  getBitcoreMnemonic,
} from '.'

async function concatEntropyBuffers(
  entropyBuffer: Buffer,
  randomBuffer: Buffer,
): Promise<Buffer> {
  const totalEntropy: Buffer = Buffer.concat([entropyBuffer, randomBuffer])

  if (totalEntropy.length !== (entropyBuffer.length + randomBuffer.length)) {
    throw new Error(t`Concatenation of entropy buffers failed`)
  }

  const crypto = await getBitcoreCrypto()

  return crypto.Hash.sha256(totalEntropy)
}

async function getHashedEntropy(
  entropy: ?string,
  randomBufferLength: number,
): Promise<?Buffer> {
  if (!entropy) {
    return null
  } else if (typeof entropy !== 'string') {
    throw new TypeError(t`Entropy is set but not a string`)
  }

  const entropyBuffer: Buffer = Buffer.from(entropy)
  const crypto = await getBitcoreCrypto()
  const randomBuffer: Buffer = crypto.Random.getRandomBuffer(randomBufferLength)
  const resultBuffer: Buffer = await concatEntropyBuffers(entropyBuffer, randomBuffer)

  return resultBuffer.slice(0, 16)
}

export async function generateMnemonic(
  entropy?: string,
  randomBufferLength?: number = config.defaultRandomBufferLength,
): Promise<string> {
  const Mnemonic = await getBitcoreMnemonic()
  const englishWords = Mnemonic.Words.ENGLISH
  const hashedEntropy: ?Buffer = await getHashedEntropy(entropy, randomBufferLength)

  const mnemonic = !hashedEntropy ? new Mnemonic(englishWords) : new Mnemonic(
    hashedEntropy,
    englishWords,
  )

  return mnemonic.toString()
}
