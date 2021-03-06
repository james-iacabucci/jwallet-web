// @flow

import { combineReducers, type Reducer } from 'redux'
import { routerReducer as router } from 'react-router-redux'

import type { AppAction } from 'routes'

import blocks from 'routes/modules/blocks'
import ticker from 'routes/modules/ticker'
import balances from 'routes/modules/balances'
import comments from 'routes/modules/comments'
import networks from 'routes/modules/networks'
import upgrade from 'routes/Upgrade/modules/upgrade'
import transactions from 'routes/modules/transactions'
import settings from 'routes/Settings/modules/settings'
import favorites from 'routes/Favorites/modules/favorites'

// digital assets
import digitalAssets from 'routes/DigitalAssets/modules/digitalAssets'
import digitalAssetsAdd from 'routes/DigitalAssets/routes/AddAsset/modules/addAsset'
import digitalAssetsEdit from 'routes/DigitalAssets/routes/EditAsset/modules/editAsset'
import digitalAssetsSend from 'routes/DigitalAssets/routes/Send/modules/digitalAssetsSend'
import digitalAssetsGrid from 'routes/DigitalAssets/routes/Grid/modules/digitalAssetsGrid'
import digitalAssetsManage from 'routes/DigitalAssets/routes/Manage/modules/digitalAssetsManage'

// wallets
import wallets from 'routes/Wallets/modules/wallets'
import walletsCreate from 'routes/Wallets/routes/Create/modules/walletsCreate'
import walletsImport from 'routes/Wallets/routes/Import/modules/walletsImport'
import walletsBackup from 'routes/Wallets/routes/Backup/modules/walletsBackup'
import walletsAddresses from 'routes/Wallets/routes/Addresses/modules/walletsAddresses'
import walletsRenameAddress from 'routes/Wallets/routes/RenameAddress/modules/walletsRenameAddress'

import persistReducers from './persistReducers'

export function makeRootReducer() {
  const rootReducer: Reducer<AppState, AppAction> = combineReducers({
    router,
    upgrade,
    // wallets
    walletsCreate,
    walletsImport,
    walletsBackup,
    walletsRenameAddress,
    // digitalAssets
    digitalAssetsAdd,
    digitalAssetsEdit,
    digitalAssetsSend,
    digitalAssetsGrid,
    digitalAssetsManage,
    ...persistReducers({
      blocks,
      ticker,
      wallets,
      balances,
      comments,
      networks,
      settings,
      favorites,
      transactions,
      digitalAssets,
      walletsAddresses,
    }),
  })

  return rootReducer
}
