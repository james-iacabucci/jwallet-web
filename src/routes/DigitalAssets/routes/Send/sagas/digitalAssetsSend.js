// @flow

import { push } from 'react-router-redux'
import * as qs from 'query-string'

import {
  put,
  call,
  select,
  takeEvery,
} from 'redux-saga/effects'

import web3 from 'services/web3'
import checkETH from 'utils/digitalAssets/checkETH'
import reactRouterBack from 'utils/browser/reactRouterBack'
import checkAddressValid from 'utils/wallets/checkAddressValid'
import getTransactionValue from 'utils/transactions/getTransactionValue'
import { getPrivateKey } from 'routes/Wallets/sagas'
import { selectCurrentBlock } from 'store/selectors/blocks'
import { selectBalanceByAssetAddress } from 'store/selectors/balances'

import {
  convertEth,
  toBigNumber,
} from 'utils/numbers'

import {
  selectActiveWalletId,
  selectActiveWalletAddress,
} from 'store/selectors/wallets'

import {
  selectCurrentNetwork,
  selectCurrentNetworkId,
} from 'store/selectors/networks'

import {
  selectDigitalAsset,
  selectDigitalAssetsSend,
} from 'store/selectors/digitalAssets'

import * as comments from 'routes/modules/comments'
import * as transactions from 'routes/modules/transactions'

import * as digitalAssetsSend from '../modules/digitalAssetsSend'

function* openView(action: ExtractReturn<typeof digitalAssetsSend.openView>): Saga<void> {
  const {
    to,
    gas,
    nonce,
    asset,
    amount,
    comment,
    gasPrice,
  } = qs.parse(action.payload.query)

  if (to) {
    yield put(digitalAssetsSend.setFormFieldValue('recipient', to))
  }

  if (asset) {
    yield put(digitalAssetsSend.setFormFieldValue('assetAddress', asset))
  } else {
    yield put(digitalAssetsSend.setFormFieldValue('assetAddress', 'Ethereum'))
  }

  if (amount) {
    yield put(digitalAssetsSend.setFormFieldValue('amount', amount))
  }

  if (nonce) {
    yield put(digitalAssetsSend.setFormFieldValue('nonce', nonce))
  }

  /** TODO: question, do we need to fill gasPrice and gasLimit for transaction repeat? */
  if (gas) {
    yield put(digitalAssetsSend.setFormFieldValue('gasLimit', gas))
  }

  if (gasPrice) {
    yield put(
      digitalAssetsSend.setFormFieldValue('gasPrice', convertEth(gasPrice, 'wei', 'gwei') || '')
    )
  }

  if (gas || gasPrice) {
    yield put(digitalAssetsSend.setPriority('CUSTOM'))
  }

  if (comment) {
    yield put(digitalAssetsSend.setFormFieldValue('comment', comment))
  }

  yield* requestGasPrice()
}

function* requestGasPrice(): Saga<?BigNumber> {
  const network: ExtractReturn<typeof selectCurrentNetwork> = yield select(selectCurrentNetwork)

  if (!network) {
    throw new Error('There is no active network')
  }

  try {
    const gasPrice = toBigNumber(yield call(web3.getGasPrice, network))
    if (gasPrice.isNaN()) {
      return null
    }
    yield put(digitalAssetsSend.setInitialGasPriceValue(gasPrice.toString()))
    return gasPrice
  } catch (err) {
    return null
  }
}

function* checkPriority(
  digitalAsset: DigitalAsset,
  priority: TXPriorityKey,
  formFieldValues: DigitalAssetsSendFormFields,
): Saga<boolean> {
  const {
    gasPrice: userGasPrice,
    gasLimit: userGasLimit,
  } = formFieldValues

  // get the latest (before transaction sending) gas price
  const requestedGasPrice = yield* requestGasPrice()
  if (!requestedGasPrice) {
    yield put(digitalAssetsSend.setFormFieldError('gasPrice', 'Can\'t request gas price'))
    return
  }

  if (priority === 'CUSTOM') {
    const gasPrice: ?string = convertEth(userGasPrice, 'gwei', 'wei')
    const isGasPriceValid: boolean = !!gasPrice
    const isGasLimitValid: boolean = parseInt(userGasLimit, 10) > 0

    if (!isGasLimitValid) {
      yield put(digitalAssetsSend.setFormFieldError('gasLimit', 'Invalid value for gas limit'))
    }

    if (!isGasPriceValid) {
      yield put(digitalAssetsSend.setFormFieldError('gasPrice', 'Invalid value for gas price'))
    }

    if (isGasLimitValid && isGasPriceValid) {
      // convert it to WEI
      yield put(digitalAssetsSend.setFinalGasPriceValue(gasPrice))

      const gasLimit = toBigNumber(userGasLimit).toString()
      yield put(digitalAssetsSend.setFinalGasLimitValue(gasLimit))
    }
  } else {
    const txPriorityCoefficient: number = digitalAssetsSend.TXPRIORITY[priority]
    if (!txPriorityCoefficient) {
      yield put(digitalAssetsSend.setFormFieldError('gasPrice', 'Priority is not selected'))
      return
    }

    const gasPrice = requestedGasPrice.times(txPriorityCoefficient).toString()
    // save for the next step
    yield put(digitalAssetsSend.setFinalGasPriceValue(gasPrice))

    if (!digitalAsset.isCustom &&
      digitalAsset.blockchainParams &&
      digitalAsset.blockchainParams.staticGasAmount) {
      // save for the next step
      const staticGasAmount = toBigNumber(digitalAsset.blockchainParams.staticGasAmount).toString()
      yield put(digitalAssetsSend.setFinalGasLimitValue(staticGasAmount))
    } else {
      // gas limit will be estimated at transaction send by jibrel-contracts-jsapi
      yield put(digitalAssetsSend.setFinalGasLimitValue(null))
    }
  }
}

function* checkAmount(digitalAsset: DigitalAsset): Saga<void> {
  const networkId: ExtractReturn<typeof selectCurrentNetworkId> =
    yield select(selectCurrentNetworkId)

  const currentBlock: ExtractReturn<typeof selectCurrentBlock> =
    yield select(selectCurrentBlock, networkId)

  const ownerAddress: ExtractReturn<typeof selectActiveWalletAddress> =
    yield select(selectActiveWalletAddress)

  const assetBalance: ExtractReturn<typeof selectBalanceByAssetAddress> = yield select(
    selectBalanceByAssetAddress,
    networkId,
    ownerAddress,
    currentBlock ? currentBlock.number.toString() : null,
    digitalAsset.blockchainParams.address
  )

  if (!assetBalance) {
    return
  }

  const {
    formFieldValues: {
      amount,
    },
    gasSettings: {
      gasPrice,
      gasLimit,
    },
  }: ExtractReturn<typeof selectDigitalAssetsSend> = yield select(selectDigitalAssetsSend)

  const amountToSend = getTransactionValue(amount, digitalAsset.blockchainParams.decimals)
  const balance = toBigNumber(assetBalance.value)

  const feeETH = (gasPrice && gasLimit)
    ? toBigNumber(gasPrice).times(gasLimit)
    : toBigNumber(0)

  if (checkETH(digitalAsset.blockchainParams.address)) {
    if (balance.lt(amountToSend)) {
      yield put(digitalAssetsSend.setFormFieldError('amount', 'Amount exceeds balance'))
    } else {
      const amountWithFee: BigNumber = amountToSend.plus(feeETH)
      if (balance.lt(amountWithFee)) {
        // eslint-disable-next-line max-len
        yield put(digitalAssetsSend.setFormFieldError('amount', 'Amount plus blockchain fee exceeds balance'))
      }
    }
  } else {
    if (balance.lt(amountToSend)) {
      yield put(digitalAssetsSend.setFormFieldError('amount', 'Amount exceeds balance'))
      return
    }

    const ethBalance: ExtractReturn<typeof selectBalanceByAssetAddress> = yield select(
      selectBalanceByAssetAddress,
      networkId,
      ownerAddress,
      currentBlock ? currentBlock.number.toString() : null,
      'Ethereum'
    )

    if (ethBalance && toBigNumber(ethBalance.value).lt(feeETH)) {
      // eslint-disable-next-line max-len
      yield put(digitalAssetsSend.setFormFieldError('amount', 'You don\'t have enough ETH to send this transaction'))
    }
  }
}

function* prepareAndCheckDigitalAssetsSendData(): Saga<boolean> {
  const {
    formFieldValues,
    priority,
  }: ExtractReturn<typeof selectDigitalAssetsSend> = yield select(selectDigitalAssetsSend)

  const {
    // nonce,
    amount,
    assetAddress,
    recipient,
  }: DigitalAssetsSendFormFields = formFieldValues

  const digitalAsset: ExtractReturn<typeof selectDigitalAsset> =
    yield select(selectDigitalAsset, assetAddress)

  // simple fields
  const isRecepientAddressValid: boolean = checkAddressValid(recipient)
  const isAmountValid: boolean = (parseFloat(amount) > 0)

  if (!isRecepientAddressValid) {
    yield put(digitalAssetsSend.setFormFieldError('recipient', 'Invalid address'))
  }

  if (!isAmountValid) {
    yield put(digitalAssetsSend.setFormFieldError('amount', 'Invalid amount'))
  }

  if (!digitalAsset) {
    yield put(digitalAssetsSend.setFormFieldError('assetAddress', 'Invalid asset address'))
    return false // we can't do any other checks without digitalAsset selected
  }

  // TODO: do this in the next task
  // check nonce
  // const isNonceExist: boolean = !!nonce.trim()
  // const isNonceValid: boolean = (parseInt(nonce, 10) > 0)
  // if (isNonceExist && !isNonceValid) {
  //   yield put(digitalAssetsSend.setFormFieldError('nonce', 'Invalid nonce'))
  // }

  yield* checkPriority(
    digitalAsset,
    priority,
    formFieldValues
  )

  yield* checkAmount(digitalAsset)

  // check, that errors in the all fields are empty
  const {
    formFieldErrors,
  } = yield select(selectDigitalAssetsSend)

  const hasErrors = Object.keys(formFieldErrors).reduce(
    (res, cur) => res || formFieldErrors[cur], false
  )
  return !hasErrors
}

function* addPendingTransaction(
  hash: Hash,
  formFieldValues: DigitalAssetsSendFormFields,
  networkId: NetworkId,
  decimals: number,
): Saga<void> {
  const ownerAddress: ExtractReturn<typeof selectActiveWalletAddress> =
    yield select(selectActiveWalletAddress)

  if (!ownerAddress) {
    throw new Error('There is no active wallet')
  }

  const {
    amount,
    gasLimit,
    gasPrice,
    recipient,
    assetAddress,
  }: DigitalAssetsSendFormFields = formFieldValues

  yield put(transactions.addPendingTransaction(
    networkId,
    ownerAddress,
    assetAddress,
    {
      data: {
        gasPrice,
      },
      blockData: {
        timestamp: Date.now() / 1000,
      },
      receiptData: {
        gasUsed: parseInt(gasLimit, 10) || 0,
        status: 1,
      },
      hash,
      to: recipient,
      blockHash: null,
      blockNumber: null,
      from: ownerAddress,
      contractAddress: null,
      eventType: checkETH(assetAddress) ? 0 : 1,
      amount: getTransactionValue(amount, decimals),
      isRemoved: false,
    }
  ))
}

function* addTransactionComment(txHash: Hash, comment: string): Saga<void> {
  if (!comment) {
    return
  }

  yield put(comments.edit(txHash, comment))
}

function* sendTransactionSuccess(
  txHash: Hash,
  formFieldValues: DigitalAssetsSendFormFields,
  networkId: NetworkId,
  decimals: number,
): Saga<void> {
  const {
    comment,
    assetAddress,
  }: DigitalAssetsSendFormFields = formFieldValues

  yield put(push(`/transactions/${assetAddress}`))
  yield* addPendingTransaction(txHash, formFieldValues, networkId, decimals)
  yield* addTransactionComment(txHash, comment)
}

function* sendTransactionError(err: Error): Saga<void> {
  yield put(digitalAssetsSend.setFormFieldError('password', err.message))
}

function* sendTransactionRequest(
  formFieldValues: DigitalAssetsSendFormFields,
  gasSettings: GasSettings
): Saga<void> {
  const {
    nonce,
    amount,
    password,
    recipient,
    assetAddress,
  } = formFieldValues

  const {
    gasLimit,
    gasPrice,
  } = gasSettings

  if (!password) {
    yield put(digitalAssetsSend.setFormFieldError('password', 'Please input password'))

    return
  }

  const network: ExtractReturn<typeof selectCurrentNetwork> = yield select(selectCurrentNetwork)

  if (!network) {
    throw new Error('There is no active network')
  }

  const walletId: ExtractReturn<typeof selectActiveWalletId> = yield select(selectActiveWalletId)

  if (!walletId) {
    throw new Error('There is no active wallet')
  }

  const digitalAsset: ExtractReturn<typeof selectDigitalAsset> =
    yield select(selectDigitalAsset, assetAddress)

  if (!digitalAsset) {
    throw new Error(`Digital asset is not found by address ${assetAddress}`)
  }

  const {
    address,
    decimals,
  }: DigitalAssetBlockchainParams = digitalAsset.blockchainParams

  yield put(digitalAssetsSend.setIsLoading(true))

  try {
    const privateKey: string = yield* getPrivateKey(walletId, password)

    const txData: SendTransactionProps = {
      to: recipient,
      gasLimit: gasLimit ? toBigNumber(gasLimit) : undefined,
      gasPrice: gasPrice ? toBigNumber(gasPrice) : undefined,
      privateKey: privateKey.substr(2),
      value: getTransactionValue(amount, decimals),
      nonce: (!Number.isNaN(parseInt(nonce, 10))) ? parseInt(nonce, 10) : undefined,
    }

    const txHash: Hash = yield call(web3.sendTransaction, network, address, txData)
    yield* sendTransactionSuccess(txHash, formFieldValues, network.id, decimals)
  } catch (err) {
    yield* sendTransactionError(err)
  }

  yield put(digitalAssetsSend.setIsLoading(false))
}

function* goToNextStep(): Saga<void> {
  const {
    formFieldValues,
    currentStep,
    finalGasSettings,
  }: ExtractReturn<typeof selectDigitalAssetsSend> = yield select(selectDigitalAssetsSend)

  switch (currentStep) {
    case digitalAssetsSend.STEPS.FORM: {
      const isDataValid: boolean = yield* prepareAndCheckDigitalAssetsSendData()

      if (isDataValid) {
        yield put(digitalAssetsSend.setCurrentStep(digitalAssetsSend.STEPS.CONFIRM))
      }

      break
    }

    case digitalAssetsSend.STEPS.CONFIRM: {
      yield* sendTransactionRequest(formFieldValues, finalGasSettings)
      break
    }

    default:
      break
  }
}

function* goToPrevStep(): Saga<void> {
  const { currentStep }: ExtractReturn<typeof selectDigitalAssetsSend> =
    yield select(selectDigitalAssetsSend)

  switch (currentStep) {
    case digitalAssetsSend.STEPS.CONFIRM:
      yield put(digitalAssetsSend.setCurrentStep(digitalAssetsSend.STEPS.FORM))
      break

    default:
      yield put(reactRouterBack({ fallbackUrl: '/digital-assets' }))
      break
  }
}

// #TODO: will be changed in the next task
function* requestGasLimit(digitalAsset: DigitalAsset): Saga<?number> {
  const {
    isCustom,
    blockchainParams: {
      staticGasAmount,
    },
  } = digitalAsset

  if (isCustom || !staticGasAmount) {
    // we can't call estimateGas for custom asset here, because we need a privateKey for it
    return null
  }

  // after gas limit reqest we will set initial gas limit
  yield put(digitalAssetsSend.setInitialGasLimitValue(String(staticGasAmount)))
  return staticGasAmount
}

function* setPriority(): Saga<void> {
  const {
    formFieldValues: {
      assetAddress,
    },
    priority,
  }: ExtractReturn<typeof selectDigitalAssetsSend> = yield select(selectDigitalAssetsSend)

  // force reset warnings, when asset address changed
  yield put(digitalAssetsSend.setFormFieldWarning('gasLimit', ''))
  yield put(digitalAssetsSend.setFormFieldWarning('gasPrice', ''))

  if (priority === 'CUSTOM') {
    // request and set gas price
    const gasPrice = yield* requestGasPrice()
    if (gasPrice.gt(0)) {
      yield put(
        digitalAssetsSend.setFormFieldValue('gasPrice', convertEth(gasPrice, 'wei', 'gwei'))
      )
    }

    // request set gas limit
    if (!assetAddress) {
      return
    }

    const digitalAsset: ExtractReturn<typeof selectDigitalAsset> =
      yield select(selectDigitalAsset, assetAddress)

    if (!digitalAsset) {
      return
    }

    const gasLimit = yield* requestGasLimit(digitalAsset)
    if (gasLimit) {
      yield put(digitalAssetsSend.setFormFieldValue('gasLimit', String(gasLimit)))
    }
  }
}

function* checkGasLimitWarning(newGasLimit: string): Saga<void> {
  const {
    formFieldWarnings,
    initialGasSettings,
  }: DigitalAssetsSendState = yield select(selectDigitalAssetsSend)

  // Priority warnings
  const gasLimit = parseInt(newGasLimit, 10)
  const initialGasLimit = parseInt(initialGasSettings.gasLimit, 10)

  if (!Number.isNaN(gasLimit) &&
      !Number.isNaN(initialGasLimit) &&
      gasLimit < initialGasLimit) {
    yield put(
      digitalAssetsSend.setFormFieldWarning('gasLimit', 'Seems this transaction can fail')
    )
  } else if (formFieldWarnings.gasLimit) {
    yield put(digitalAssetsSend.setFormFieldWarning('gasLimit', ''))
  }
}

function* checkGasPriceWarning(newGasPrice: void | string | BigNumber): Saga<void> {
  const {
    formFieldWarnings,
    initialGasSettings,
  }: DigitalAssetsSendState = yield select(selectDigitalAssetsSend)

  // Priority warnings
  try {
    const gasPrice = toBigNumber(newGasPrice)
    const initialGasPrice = toBigNumber(initialGasSettings.gasPrice)

    if (gasPrice.lt(initialGasPrice.times(0.5)) || gasPrice.lt(21000)) {
      yield put(
        digitalAssetsSend.setFormFieldWarning('gasPrice', 'Seems gas price too small')
      )
    } else if (formFieldWarnings.gasPrice) {
      yield put(digitalAssetsSend.setFormFieldWarning('gasPrice', ''))
    }
  } catch (err) {
    // when toBigNumber throws exception - user input is invald, it is error, not warning
    if (formFieldWarnings.gasPrice) {
      yield put(digitalAssetsSend.setFormFieldWarning('gasPrice', ''))
    }
  }
}

function* setFormField(
  action: ExtractReturn<typeof digitalAssetsSend.setFormFieldValue>
): Saga<void> {
  const {
    payload: {
      fieldName,
      value,
    },
  } = action

  // const {
  //   priority,
  //   formFieldWarnings,
  //   initialGasSettings,
  // }: DigitalAssetsSendState = yield select(selectDigitalAssetsSend)

  if (fieldName === 'assetAddress' && value !== '') {
    yield* setPriority()
  }

  if (fieldName === 'gasLimit') {
    yield* checkGasLimitWarning(value)
  }

  if (fieldName === 'gasPrice') {
    yield* checkGasPriceWarning(convertEth(value, 'gwei', 'wei'))
  }
}

export function* digitalAssetsSendRootSaga(): Saga<void> {
  yield takeEvery(digitalAssetsSend.OPEN_VIEW, openView)
  yield takeEvery(digitalAssetsSend.GO_TO_NEXT_STEP, goToNextStep)
  yield takeEvery(digitalAssetsSend.GO_TO_PREV_STEP, goToPrevStep)
  yield takeEvery(digitalAssetsSend.SET_PRIORITY, setPriority)
  yield takeEvery(digitalAssetsSend.SET_FORM_FIELD_VALUE, setFormField)
}
