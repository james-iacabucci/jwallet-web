// @flow

import { connect } from 'react-redux'

import reactRouterBack from 'utils/browser/reactRouterBack'

import {
  selectFavorites,
  selectFavoritesItems,
} from 'store/selectors/favorites'

import {
  edit,
  addByUser,
  setFormFieldValue,
} from '../../modules/favorites'

import FavoritesAddressView from './FavoritesAddressView'

function mapStateToProps(state: AppState, ownProps: OwnProps) {
  const {
    formFieldValues,
    formFieldErrors,
    isLoading,
  } = selectFavorites(state)

  const { address } = ownProps.params
  const items: Favorites = selectFavoritesItems(state)

  return {
    formFieldValues,
    formFieldErrors,
    isLoading,
    foundFavorite: address ? items[address] : null,
  }
}

const mapDispatchToProps = {
  edit,
  setFormFieldValue,
  add: addByUser,
  closeClick: () => reactRouterBack({ fallbackUrl: '/favorites' }),
}

/* ::
type OwnProps = {|
  +params: {|
    +address?: string,
  |}
|}
*/

export default (
  connect/* :: < AppState, any, OwnProps, _, _ > */(mapStateToProps, mapDispatchToProps)
)(FavoritesAddressView)
