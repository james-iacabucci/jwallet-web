// @flow

import React, { PureComponent } from 'react'

import FavoriteItem from 'components/FavoriteItem'

import {
  JText,
  JSearch,
} from 'components/base'

import './favoritesView.scss'

type Props = {|
  +remove: (FavoriteItem) => void,
  +items: Favorite[],
|}

type State = {|
  +searchQuery: string
|}

const createSymbol = (text: string): string => {
  const letters = text
    .trim()
    .split(/\s+/)
    .reduce((memo, part, idx) => {
      /* eslint-disable no-param-reassign, prefer-destructuring, fp/no-mutation */
      // reduce is designed to mutate memo
      // destructuring is not applicable, because those are strings, not arrays
      if (idx === 0) {
        memo.first = part[0]

        if (part.length > 1) {
          memo.last = part[1]
        }
      } else {
        memo.last = part[0]
      }
      /* eslint-enable no-param-reassign, prefer-destructuring, fp/no-mutation */

      return memo
    }, {
      first: '?',
      last: '?',
    })

  return (letters.first + letters.last).toUpperCase()
}

const filterFavoriteByQuery = (re: RegExp) => (favorite: Favorite): boolean =>
  re.test(favorite.name || '') || re.test(favorite.description || '')

class FavoritesIndexView extends PureComponent<Props, State> {
  static defaultProps = {
    items: [],
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      searchQuery: '',
    }
  }

  setSearchQuery = (query: string): void => {
    this.setState({ searchQuery: query.trim() })
  }

  render() {
    const {
      remove,
      items,
    }: Props = this.props

    const { searchQuery } = this.state
    const isSearched: boolean = !!searchQuery
    const searchRegExp = new RegExp(searchQuery, 'gi')
    const filterFavoriteBySearchRegExp = filterFavoriteByQuery(searchRegExp)

    const foundItems: Favorite[] = !isSearched
      ? items
      : items.filter((item: Favorite): boolean => filterFavoriteBySearchRegExp(item))

    return (
      <div className='favorites-view'>
        <header className='header'>
          <div className='container'>
            <JText value='Favorites' size='tab' color='dark' />
            <div className='actions'>
              <div className='search'>
                <JSearch
                  onChange={this.setSearchQuery}
                  placeholder='Search favorites...'
                />
              </div>
            </div>
          </div>
        </header>
        <main className='content'>
          <div className='container'>
            {foundItems.map((item: Favorite) => {
              const {
                name,
                address,
                description,
                isAddedByUser,
              }: Favorite = item

              if (!(isAddedByUser && name)) {
                return null
              }

              return (
                <div key={address} className='box'>
                  <FavoriteItem
                    remove={remove}
                    name={name}
                    address={address}
                    description={description}
                    symbol={createSymbol(name)}
                  />
                </div>
              )
            })}
          </div>
        </main>
      </div>
    )
  }
}

export default FavoritesIndexView
