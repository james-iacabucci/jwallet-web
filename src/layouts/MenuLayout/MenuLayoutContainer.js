// @flow

import { connect } from 'react-redux'

import getDigitalAssetsWithBalance from 'utils/digitalAssets/getDigitalAssetsWithBalance'
import { selectTickerItems } from 'store/selectors/ticker'
import { selectCurrentBlock } from 'store/selectors/blocks'
import { selectAllAddressNames } from 'store/selectors/favorites'
import { selectCurrentNetworkId } from 'store/selectors/networks'
import { selectSettingsFiatCurrency } from 'store/selectors/settings'
import { selectBalancesByBlockNumber } from 'store/selectors/balances'
import { selectActiveDigitalAssets } from 'store/selectors/digitalAssets'

import {
  selectWalletsItems,
  selectActiveWalletId,
  selectWalletsAddresses,
  selectActiveWalletAddress,
} from 'store/selectors/wallets'

import {
  openMenuLayout,
  closeMenuLayout,
} from 'routes/modules/core'

import {
  setActive,
  getMoreRequest,
} from 'routes/Wallets/routes/Addresses/modules/walletsAddresses'

import MenuLayout from './MenuLayout'

function getFiatBalance(
  assets: DigitalAssetWithBalance[],
  fiatCourses: FiatCourses,
  fiatCurrency: FiatCurrency,
): number {
  return assets.reduce((result: number, digitalAsset: DigitalAssetWithBalance): number => {
    const {
      balance,
      priceFeed,
    }: DigitalAssetWithBalance = digitalAsset

    if (!(balance && priceFeed)) {
      return result
    }

    const fiatCourseById: ?FiatCourseById = fiatCourses[priceFeed.currencyID.toString()]

    if (!fiatCourseById) {
      return result
    }

    const fiatCourse: ?FiatCourse = fiatCourseById.latest

    if (!fiatCourse) {
      return result
    }

    const fiatCourseValue: ?string = fiatCourse[fiatCurrency]

    if (!fiatCourseValue) {
      return result
    }

    return result + (parseFloat(fiatCourseValue) * parseFloat(balance.value))
  }, 0)
}

function mapStateToProps(state: AppState) {
  const items: Wallets = selectWalletsItems(state)
  const fiatCourses: FiatCourses = selectTickerItems(state)
  const networkId: NetworkId = selectCurrentNetworkId(state)
  const activeWalletId: ?WalletId = selectActiveWalletId(state)
  const addressNames: AddressNames = selectAllAddressNames(state)
  const assets: DigitalAsset[] = selectActiveDigitalAssets(state)
  const fiatCurrency: FiatCurrency = selectSettingsFiatCurrency(state)
  const ownerAddress: ?OwnerAddress = selectActiveWalletAddress(state)
  const currentBlock: ?BlockData = selectCurrentBlock(state, networkId)
  const { addresses }: WalletsAddressesState = selectWalletsAddresses(state)

  const balances: ?Balances = selectBalancesByBlockNumber(
    state,
    networkId,
    ownerAddress,
    currentBlock ? currentBlock.number.toString() : null,
  )

  const assetsWithBalance: DigitalAssetWithBalance[] = getDigitalAssetsWithBalance(
    assets,
    balances,
  )

  return {
    items,
    addresses,
    addressNames,
    activeWalletId,
    fiatCurrency,
    fiatBalance: getFiatBalance(assetsWithBalance, fiatCourses, fiatCurrency),
    isConnectionError: false,
  }
}

const mapDispatchToProps = {
  setActive,
  getMoreRequest,
  openLayout: openMenuLayout,
  closeLayout: closeMenuLayout,
}

/* ::
type OwnProps = {|
  +children: React$Node,
|}
*/

export default connect/* :: < AppState, any, OwnProps, _, _ > */(
  mapStateToProps,
  mapDispatchToProps
)(MenuLayout)
