// @flow

import { WalletNotFoundError } from '..'

const walletId = '123'

describe('WalletNotFoundError', () => {
  test('exists', () => {
    expect(WalletNotFoundError).toBeDefined()
  })

  test('can be thrown', () => {
    const fn = () => {
      throw new WalletNotFoundError({ walletId })
    }

    expect(fn).toThrow(WalletNotFoundError)
  })

  test('has correct name', () => {
    try {
      throw new WalletNotFoundError({ walletId })
    } catch (err) {
      expect(err.name).toEqual('WalletNotFoundError')
    }
  })

  test('can be checked by instanceof', () => {
    try {
      throw new WalletNotFoundError({ walletId })
    } catch (err) {
      expect(err instanceof WalletNotFoundError).toBe(true)
      expect(err instanceof Error).toBe(true)
    }
  })

  test('has stacktrace', () => {
    try {
      throw new WalletNotFoundError({ walletId })
    } catch (err) {
      expect(err.stack).toBeDefined()
      expect(err.stack).not.toBeNull()
    }
  })

  test('has walletId', () => {
    try {
      throw new WalletNotFoundError({ walletId })
    } catch (err) {
      expect(err.data.walletId).toBeDefined()
    }
  })
})
