// @flow

import { connect } from 'react-redux'

import { selectCurrentBlock } from 'store/selectors/blocks'
import { selectCurrentNetworkId } from 'store/selectors/networks'
import { getDigitalAssetsWithBalance } from 'utils/digitalAssets'
import { selectActiveWalletAddress } from 'store/selectors/wallets'
import { selectBalancesByBlockNumber } from 'store/selectors/balances'
import { selectActiveDigitalAssets } from 'store/selectors/digitalAssets'

import { AssetPicker } from './AssetPicker'

function mapStateToProps(state: AppState) {
  const networkId: NetworkId = selectCurrentNetworkId(state)
  const ownerAddress: ?OwnerAddress = selectActiveWalletAddress(state)
  const activeAssets: DigitalAsset[] = selectActiveDigitalAssets(state)
  const currentBlock: ?BlockData = selectCurrentBlock(state, networkId)
  const currentBlockNumber = currentBlock ? currentBlock.number : 0

  const assetsBalances: ?Balances = !ownerAddress ? null : selectBalancesByBlockNumber(
    state,
    networkId,
    ownerAddress,
    currentBlockNumber.toString(),
  )

  const assetsWithBalance: DigitalAssetWithBalance[] = getDigitalAssetsWithBalance(
    activeAssets,
    assetsBalances,
  )

  return {
    digitalAssets: assetsWithBalance,
  }
}

/* ::
type OwnProps = {|
  +meta: FinalFormMeta,
  +input: FinalFormInput
|}
*/

const AssetPickerEnchanced = (
  connect/* :: < AppState, any, OwnProps, _, _> */(mapStateToProps)
)(AssetPicker)

export { AssetPickerEnchanced as AssetPicker }
