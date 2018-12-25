// @flow

import React, { PureComponent } from 'react'

import JText from 'components/base/JText'

type Props = {|
  +symbol: string,
  +balance: ?BalanceString,
  +color: 'blue' | 'gray',
  +size: 'small' | 'normal' | 'header',
|}

class AssetBalance extends PureComponent<Props> {
  static defaultProps = {
    color: 'gray',
    size: 'normal',
  }

  render() {
    const {
      symbol,
      size,
      color,
      balance,
    } = this.props

    return (
      <div className='asset-balance'>
        <div className='balance'>
          <JText
            weight='bold'
            size={size}
            color={color}
            value={balance || '0'}
          />
        </div>
        <div className='symbol'>
          <JText
            weight='bold'
            fontCase='upper'
            size={size}
            color={color}
            value={symbol}
          />
        </div>
      </div>
    )
  }
}

export default AssetBalance
