// @flow

import { t } from 'ttag'

import config from 'config'
import strip0x from 'utils/address/strip0x'
import { encryptData } from 'utils/encryption'

import {
  getWallet,
  checkMnemonicType,
} from 'utils/wallets'

import { updateWallet } from '.'

type UpgradeWalletData = {|
  +items: Wallets,
  +mnemonicOptions: ?MnemonicOptions,
  +data: string,
  +walletId: WalletId,
  +encryptionType: string,
  +internalKey: Uint8Array,
|}

async function addMnemonic(
  wallets: Wallets,
  wallet: Wallet,
  mnemonic: string,
  mnemonicOptions: MnemonicOptions,
  internalKey: Uint8Array,
  encryptionType: string,
): Promise<Wallets> {
  const {
    id,
    type,
    bip32XPublicKey,
  }: Wallet = wallet

  if (!checkMnemonicType(type) || !bip32XPublicKey) {
    throw new Error(t`WalletDataError`)
  }

  const {
    network,
    passphrase,
    derivationPath,
  }: MnemonicOptions = mnemonicOptions

  return updateWallet(wallets, id, {
    network,
    derivationPath,
    encrypted: {
      mnemonic: await encryptData({
        encryptionType,
        data: mnemonic,
        key: internalKey,
      }),
      passphrase: await encryptData({
        encryptionType,
        key: internalKey,
        data: passphrase.trim().toLowerCase(),
      }),
      privateKey: null,
    },
    customType: config.mnemonicWalletType,
    isReadOnly: false,
  })
}

async function addPrivateKey(
  wallets: Wallets,
  wallet: Wallet,
  privateKey: string,
  internalKey: Uint8Array,
  encryptionType: string,
): Promise<Wallets> {
  const {
    id,
    type,
    address,
  }: Wallet = wallet

  if (checkMnemonicType(type) || !address) {
    throw new Error(t`WalletDataError`)
  }

  return updateWallet(wallets, id, {
    encrypted: {
      privateKey: await encryptData({
        encryptionType,
        key: internalKey,
        data: strip0x(privateKey),
      }),
      mnemonic: null,
      passphrase: null,
    },
    customType: 'privateKey',
    isReadOnly: false,
  })
}

export async function upgradeWallet({
  items,
  mnemonicOptions,
  data,
  walletId,
  internalKey,
  encryptionType,
}: UpgradeWalletData): Promise<Wallets> {
  const wallet: Wallet = await getWallet(items, walletId)

  if (!wallet.isReadOnly) {
    throw new Error(t`WalletDataError`)
  }

  const preparedData: string = data.trim().toLowerCase()

  if (checkMnemonicType(wallet.type)) {
    if (!mnemonicOptions) {
      throw new Error(t`WalletDataError`)
    }

    return addMnemonic(items, wallet, preparedData, mnemonicOptions, internalKey, encryptionType)
  }

  return addPrivateKey(items, wallet, preparedData, internalKey, encryptionType)
}
