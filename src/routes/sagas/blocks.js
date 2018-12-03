// @flow

import {
  delay,
  channel,
  buffers,
  type Task,
} from 'redux-saga'

import {
  all,
  put,
  call,
  fork,
  take,
  cancel,
  select,
  cancelled,
  takeEvery,
} from 'redux-saga/effects'

import config from 'config'
import web3 from 'services/web3'
import { selectCurrentNetworkId } from 'store/selectors/networks'
import { selectActiveWalletAddress } from 'store/selectors/wallets'

import {
  selectLatestBlock,
  selectCurrentBlock,
  selectProcessingBlock,
} from 'store/selectors/blocks'

import * as balances from 'routes/modules/balances'
import * as transactions from 'routes/modules/transactions'

import { requestBalance } from './balances'
import { requestTransactions } from './transactions'
import * as blocks from '../modules/blocks'

function* latestBlockSync(networkId: NetworkId): Saga<void> {
  try {
    while (true) {
      const latestBlock: ?BlockData = yield select(selectLatestBlock, networkId)

      try {
        const block: BlockData = yield call(web3.getBlock, 'latest')

        if (!latestBlock) {
          yield put(blocks.setLatestBlock(networkId, block))
        } else {
          const isForked: boolean = (block.number < latestBlock.number)
          const isBlockMined: boolean = (block.number > latestBlock.number)

          if (isBlockMined) {
            yield put(blocks.setLatestBlock(networkId, block))
          } else if (isForked) {
            yield put(blocks.nodeForked(networkId, latestBlock, block))
          }
        }

        yield call(delay, config.latestBlockSyncTimeout)
      } catch (err) {
        yield put(blocks.latestBlockSyncError(err))
        yield call(delay, config.latestBlockSyncTimeout)
      }
    }
  } finally {
    yield put(blocks.latestBlockSyncStop())
  }
}

function* currentBlockSync(networkId: NetworkId): Saga<void> {
  while (true) {
    yield call(delay, config.currentBlockSyncTimeout)

    const latestBlock: ?BlockData = yield select(selectLatestBlock, networkId)
    const currentBlock: ?BlockData = yield select(selectCurrentBlock, networkId)
    const processingBlock: ?BlockData = yield select(selectProcessingBlock, networkId)

    if (!latestBlock) {
      continue
    }

    if (!processingBlock) {
      yield put(blocks.setProcessingBlock(networkId, latestBlock))
      continue
    }

    const {
      hash,
      isBalancesFetched,
      isBalancesLoading,
      isTransactionsFetched,
      isTransactionsLoading,
    }: BlockData = processingBlock

    if (isBalancesFetched && isTransactionsFetched) {
      const isCurrentBlockOutdated: boolean = !currentBlock || (currentBlock.hash !== hash)

      if (isCurrentBlockOutdated) {
        yield put(blocks.setCurrentBlock(networkId, processingBlock))
      }

      const isProcessingBlockOutdated: boolean = (hash !== latestBlock.hash)
      const isProcessingBlockFinished: boolean = !(isBalancesLoading || isTransactionsLoading)

      if (isProcessingBlockOutdated && isProcessingBlockFinished) {
        yield put(blocks.setProcessingBlock(networkId, latestBlock))
      }
    }
  }
}

export function* processQueue(
  requestQueue: Channel,
  networkId: NetworkId,
  ownerAddress: OwnerAddress,
  blockNumber: number,
): Saga<void> {
  while (true) {
    const request: SchedulerTask = yield take(requestQueue)

    try {
      if (request.module === 'balances') {
        yield* requestBalance(request, networkId, ownerAddress, blockNumber)
      } else if (request.module === 'transactions') {
        yield* requestTransactions(requestQueue, request, networkId, ownerAddress)
      } else {
        throw new Error(`Task handler for module ${request.module} is not defined`)
      }
    } catch (err) {
      if (request.retryCount && request.retryCount > 0) {
        yield put(requestQueue, {
          ...request,
          retryCount: request.retryCount - 1,
        })
      }

      yield put(blocks.processQueueError(err))
    }
  }
}

function* processBlock(networkId: NetworkId, ownerAddress: OwnerAddress): Saga<void> {
  try {
    while (true) {
      const currentBlock: ?BlockData = yield select(selectCurrentBlock, networkId)
      const processingBlock: ?BlockData = yield select(selectProcessingBlock, networkId)

      if (!processingBlock) {
        yield call(delay, config.processingBlockWaitTimeout)
        continue
      }

      const buffer = buffers.expanding(1)
      const requestQueue: Channel = yield channel(buffer)

      const processQueueTasks: Array<Task<typeof processQueue>> = yield all(Array
        .from({ length: 5 })
        .map(() => fork(
          processQueue,
          requestQueue,
          networkId,
          ownerAddress,
          processingBlock.number,
        ))
      )

      yield put(balances.syncStart(
        requestQueue,
        networkId,
        ownerAddress,
        processingBlock,
      ))

      yield put(transactions.syncStart(
        requestQueue,
        networkId,
        ownerAddress,
        currentBlock,
        processingBlock,
      ))

      // wait current block change
      yield take(blocks.SET_PROCESSING_BLOCK)

      yield all(processQueueTasks.map(task => cancel(task)))

      yield put(balances.syncStop())
      yield put(transactions.syncStop())

      requestQueue.close()
    }
  } finally {
    if (yield cancelled()) {
      yield put(balances.syncStop())
      yield put(transactions.syncStop())
    }
  }
}

function* syncStart(): Saga<void> {
  const networkId: ExtractReturn<typeof selectCurrentNetworkId> =
    yield select(selectCurrentNetworkId)

  const address: ExtractReturn<typeof selectActiveWalletAddress> =
    yield select(selectActiveWalletAddress)

  if (!address) {
    return
  }

  const latestSyncTask: Task<typeof latestBlockSync> = yield fork(latestBlockSync, networkId)
  const currentSyncTask: Task<typeof currentBlockSync> = yield fork(currentBlockSync, networkId)
  const processBlockTask: Task<typeof processBlock> = yield fork(processBlock, networkId, address)

  yield take(blocks.SYNC_STOP)

  yield cancel(latestSyncTask)
  yield cancel(currentSyncTask)
  yield cancel(processBlockTask)
}

function* syncRestart(): Saga<void> {
  yield put(blocks.syncStop())
  yield put(blocks.syncStart())
}

export function* blocksRootSaga(): Saga<void> {
  yield takeEvery(blocks.SYNC_START, syncStart)
  yield takeEvery(blocks.SYNC_RESTART, syncRestart)
}