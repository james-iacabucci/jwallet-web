// @flow

import { actions } from 'redux-router5'

import {
  all,
  call,
  put,
  select,
  takeEvery,
} from 'redux-saga/effects'

import config from 'config'
import web3 from 'services/web3'
import { selectCurrentNetworkOrThrow } from 'store/selectors/networks'

import {
  getAddresses,
  updateWallet,
} from 'utils/wallets'

import {
  selectWalletsItems,
  selectActiveWalletIdOrThrow,
  selectWalletsAddresses,
} from 'store/selectors/wallets'

import * as blocks from 'store/modules/blocks'
import * as ticker from 'store/modules/ticker'
import * as wallets from 'store/modules/wallets'
import * as walletsAddresses from 'store/modules/walletsAddresses'

function* onOpenView(): Saga<void> {
  yield put(walletsAddresses.clean())

  yield put(walletsAddresses.getMoreRequest())
}

function* setActive(action: ExtractReturn<typeof walletsAddresses.setActive>): Saga<void> {
  const items: ExtractReturn<typeof selectWalletsItems>
    = yield select(selectWalletsItems)
  const walletId: ExtractReturn<typeof selectActiveWalletIdOrThrow>
    = yield select(selectActiveWalletIdOrThrow)

  const { addressIndex } = action.payload

  const itemsNew: Wallets = updateWallet(items, walletId, { addressIndex })
  yield put(wallets.setWalletsItems(itemsNew))
  yield put(actions.navigateTo('Wallet'))
  yield put(blocks.syncRestart())
  yield put(ticker.syncRestart())
}

function* getMoreRequest(): Saga<void> {
  const items: ExtractReturn<typeof selectWalletsItems>
    = yield select(selectWalletsItems)
  const walletId: ExtractReturn<typeof selectActiveWalletIdOrThrow>
    = yield select(selectActiveWalletIdOrThrow)

  const { iteration }: ExtractReturn<typeof selectWalletsAddresses> =
    yield select(selectWalletsAddresses)

  const startIndex: Index = config.mnemonicAddressesCount * iteration
  const endIndex: Index = (startIndex + config.mnemonicAddressesCount) - 1

  const addresses = getAddresses(items, walletId, startIndex, endIndex)
  yield put(walletsAddresses.getMoreSuccess(addresses))
}

function* getMoreSuccess(): Saga<void> {
  yield put(walletsAddresses.getBalancesRequest())
}

function getBalanceByAddress(network: Network, address: Address) {
  return call(web3.getAssetBalance, network, address, 'Ethereum')
}

function* getBalancesByAddresses(network: Network, items: OwnerAddress[]): Saga<WalletsBalances> {
  const balances: string[] = yield all(items.map(item => getBalanceByAddress(network, item)))

  return items.reduce((
    result: WalletsBalances,
    address: OwnerAddress,
    i: Index,
  ): WalletsBalances => ({
    ...result,
    [address]: balances[i],
  }), {})
}

function* getBalancesRequest(): Saga<void> {
  const network: ExtractReturn<typeof selectCurrentNetworkOrThrow>
    = yield select(selectCurrentNetworkOrThrow)

  // check, that active wallet is selected
  yield select(selectActiveWalletIdOrThrow)

  const { addresses }: ExtractReturn<typeof selectWalletsAddresses> =
    yield select(selectWalletsAddresses)

  try {
    const balances: WalletsBalances = yield getBalancesByAddresses(network, addresses)
    yield put(walletsAddresses.getBalancesSuccess(balances))
  } catch (err) {
    yield put(walletsAddresses.getBalancesError(err))
  }
}

function* onCloseView(): Saga<void> {
  yield put(walletsAddresses.clean())
}

export function* walletsAddressesRootSaga(): Saga<void> {
  yield takeEvery(walletsAddresses.SET_ACTIVE, setActive)
  yield takeEvery(walletsAddresses.ON_OPEN_VIEW, onOpenView)
  yield takeEvery(walletsAddresses.ON_CLOSE_VIEW, onCloseView)
  yield takeEvery(walletsAddresses.GET_MORE_REQUEST, getMoreRequest)
  yield takeEvery(walletsAddresses.GET_MORE_SUCCESS, getMoreSuccess)
  yield takeEvery(walletsAddresses.GET_ETH_BALANCES_REQUEST, getBalancesRequest)
}
