// @flow

declare type QRCodeAppearanceConfig = {|
  +size: number,
  +errorCorrectionLevel: string,
  +color: {|
    +light: string,
    +dark: string,
  |},
|}

declare type JSONFormatConfig = {|
  +type: string,
  +size: number,
|}

type BlockExplorerAPILink = 'api-blockchain-service.jwallet.network' |
  'api-blockchain-service.jwallet.develop.stacks.jdev.network'

declare type AppConfig = {|
  +searchTimeout: number,
  +resetIncorrectPincodeTimeout: number,
  +modalOpeningClosingTimeout: number,
  +popoverClickTimeout: number,
  +popoverOpeningClosingTimeout: number,
  +defaultAppearableTimeout: number,
  +mobileWidth: number,
  +accountsLoadingCount: number,
  +popoverShakeTimeout: number,
  +qrCodeDefaultAppearance: QRCodeAppearanceConfig,
  +urlRe: RegExp,
  +modalShakeTimeout: number,
  +addressesPerIteration: number,
  +getBalancesIntervalTimeout: number,
  +getTransactionsIntervalTimeout: number,
  +defaultDecimals: number,
  +jsonFormat: JSONFormatConfig,
  +blockExplorerApiOptions: RequestOptions,
  +maxPasswordLength: number,
  +delayBeforeFormClean: number,
  +defaultDerivationPath: string,
  +balanceLoadingTimeout: number,
  +copyToBufferTimeout: number,
  +walletIdInitTimeout: number,
  +blockExplorerUILink: 'etherscan.io',
  +blockExplorerAPILink: BlockExplorerAPILink,
  +supportedLanguages: LanguageCode[],
  +mnemonicAddressesCount: number,
  +landingURL: 'https://jwallet.network',
  +deleteConfirmTimeout: number,
  +latestBlockSyncTimeout: number,
  +currentBlockSyncTimeout: number,
  +processingBlockWaitTimeout: number,
  +syncTransactionsTimeout: number,
  +maxBlocksPerTransactionsRequest: number,
  +minBlocksPerTransactionsRequest: number,
  +blockExplorerMaxResponseSize: number,
  +requestQueueWorkersCount: number,
  +resyncTransactionsTimeout: number,
  +syncBalancesTimeout: number,
  +miningDelay: number,
  +addressWalletType: 'address',
  +mnemonicWalletType: 'mnemonic',
  +encryptedDataLength: number,
  +defaultSaltBytesCount: number,
  +defaultScryptParams: ScryptParams,
  +defaultEncryptionType: 'nacl.secretbox',
  +defaultDerivationKeyLength: number,
  +defaultRandomBufferLength: number,
|}
