// @flow

import { all, put, call, fork, take, cancel, select, takeEvery } from 'redux-saga/effects'

import type { Task, Channel } from 'redux-saga'

import { keystore, blockExplorer } from 'services'
import { checkETH, checkJNT } from 'utils/digitalAssets'

import {
  selectNetworkId,
  selectTransactions,
  selectDigitalAssets,
  selectWalletsPersist,
  selectCurrentBlockNumber,
} from 'store/stateSelectors'

import * as transactions from '../modules/transactions'

type TransactionMethodName =
  'getETHTransactions' |
  'getERC20Transactions' |
  'getJNTTransactions'

function getMethodName({ address }: DigitalAsset): TransactionMethodName {
  if (checkETH(address)) {
    return 'getETHTransactions'
  } else if (checkJNT(address)) {
    return 'getJNTTransactions'
  }

  return 'getERC20Transactions'
}

function putRequest(
  // $FlowFixMe
  requestQueue: Channel<SchedulerTask>,
  digitalAssets: DigitalAssets,
  owner: Address,
  assetAddress: Address,
  networkId: NetworkId,
  currentBlock: number,
) {
  const digitalAsset: DigitalAsset = digitalAssets[assetAddress]
  const name: TransactionMethodName = getMethodName(digitalAsset)

  const {
    address,
    decimals,
  }: DigitalAsset = digitalAsset

  const task: SchedulerTask = {
    method: {
      name,
      payload: {
        owner,
        address,
        decimals,
        networkId,
        currentBlock,
      },
    },
    module: 'transactions',
    priority: 0,
    retryCount: 3,
  }

  // $FlowFixMe
  return put(requestQueue, task)
}

export function* requestTransactionsLoop(
  requestQueue: Channel<SchedulerTask>,
  owner: Address,
  networkId: NetworkId,
  currentBlock: number,
): Saga<void> {
  try {
    while (true) {
      const digitalAssets: ExtractReturn<typeof selectDigitalAssets> =
        yield select(selectDigitalAssets)

      yield all(Object
        .keys(digitalAssets)
        .filter((assetAddress: Address): boolean => !!digitalAssets[assetAddress].isActive)
        .map((address: Address) => putRequest(
          requestQueue,
          digitalAssets,
          owner,
          address,
          networkId,
          currentBlock,
        ))
      )
    }
  } finally {
    //
  }
}

function getLoadingTransactions(txs: Transactions): Transactions {
  return Object.keys(txs).reduce((result: Transactions, hash: Hash): Transactions => {
    const {
      gasUsed,
      timestamp,
    }: Transaction = txs[hash]

    // gasUsed is fetched from transactionReceipt, timestamp is fetched from block
    if (gasUsed && timestamp) {
      return result
    }

    return {
      ...result,
      [hash]: txs[hash],
    }
  }, {})
}

function* checkLoadingTransactions(networkId: NetworkId, owner: Address): Saga<void> {
  const {
    persist,
    isLoading,
  }: ExtractReturn<typeof selectTransactions> = yield (selectTransactions)

  const itemsByNetworkId = persist.items[networkId]

  if (!itemsByNetworkId) {
    return
  }

  const itemsByOwner = itemsByNetworkId[owner]

  if (!itemsByOwner) {
    return
  }

  const loadingTransactions = Object
    .keys(itemsByOwner)
    .reduce((result: Transactions, asset: Address): Transactions => {
      const itemsByAsset = itemsByOwner[asset]

      if (!itemsByAsset) {
        return result
      }

      return getLoadingTransactions(itemsByAsset)
    }, {})

  const isCurrentlyLoading: boolean = !!Object.keys(loadingTransactions)

  if (isLoading !== isCurrentlyLoading) {
    yield put(transactions.setIsLoading(isCurrentlyLoading))
  }
}

export function* requestTransactions(task: SchedulerTask): Saga<void> {
  const {
    name,
    owner,
    networkId,
  } = task

  switch (name) {
    case 'getETHTransactions': {
      const txs: Transactions = yield call(blockExplorer.getETHTransactions, owner, networkId)
      yield put(transactions.setItems(networkId, owner, 'Ethereum', txs))
      break
    }

    default: {
      console.log(task)
      break
    }
  }

  yield* checkLoadingTransactions(owner, networkId)
}

export function* syncStart(requestQueue: Channel<SchedulerTask>): Saga<void> {
  const { items, activeWalletId }: WalletsPersist = yield select(selectWalletsPersist)

  if (!activeWalletId) {
    throw new Error('Active wallet is not found')
  }

  const networkId: NetworkId = yield select(selectNetworkId)
  const owner: ?Address = keystore.getAddress(items, activeWalletId)
  const currentBlock: number = yield select(selectCurrentBlockNumber)

  const requestTasks: Array<Task<typeof requestTaskProcess>> = yield all(Array
    .from({ length: 5 })
    .map(() => fork(requestTaskProcess, requestQueue))
  )

  const requestTransactionsTask: Task<typeof requestTransactionsLoop> = yield fork(
    requestTransactionsLoop,
    requestQueue,
    owner,
    networkId,
    currentBlock,
  )

  yield take(transactions.SYNC_STOP)
  yield cancel(requestTransactionsTask)
  yield all(requestTasks.map(requestTask => cancel(requestTask)))
}

export function* transactionsRootSaga(): Saga<void> {
  yield takeEvery(transactions.SYNC_START, syncStart)
}
