// @flow

import React from 'react'
import classNames from 'classnames'
import { assoc } from 'ramda'

import config from 'config'
import { JButton, JIcon } from 'components/base'
import { handle, ignoreEvent } from 'utils/eventHandlers'

const getJNTEventType = ({ type, isJNT }: Transaction): '—' | 'mint' | 'burn' => {
  if (!isJNT) {
    return '—'
  }

  return (type === 'send') ? 'burn' : 'mint'
}

const getTxLink = (txHash: Hash) => `${config.blockExplorerLink}/tx/${txHash}`

const TransactionItem = ({
  setActive,
  repeat,
  data,
  assetSymbol,
  activeTxHash,
}: Props) => {
  return (
    <div
      onClick={handle(setActive)(data.transactionHash)}
      className={classNames(
        'transaction-item',
        `-${data.type}`,
        { '-active': (data.transactionHash === activeTxHash) },
      )}
    >
      <div className='main'>
        <JIcon size='large' name={`transaction-${data.type}`} />
        <div className='date'>
          <div className='label'>{'Date'}</div>
          <div className='value'>{data.date}</div>
        </div>
        <div className='address'>
          <div className='label'>{'Address'}</div>
          <div className='value'>{data.address || getJNTEventType(data)}</div>
        </div>
        <div className='amount'>
          <div className='value'>{` + ${data.amount.toFixed(3)} ${assetSymbol}`}</div>
          <div className='repeat'>
            <JButton
              onClick={ignoreEvent(repeat)(assoc('symbol', assetSymbol)(data))}
              text='Repeat'
              iconName='repeat'
              color='white'
            />
          </div>
        </div>
      </div>
      <div className='additional' onClick={ignoreEvent(/* handler */)(/* args */)}>
        <div className='item'>
          <div className='label'>{'Tx hash'}</div>
          <div className='value'>
            <a
              href={getTxLink(data.transactionHash)}
              target='_blank'
              rel='noopener noreferrer'
            >
              {data.transactionHash}
            </a>
          </div>
        </div>
        {/*
        <div className='item'>
          <div className='label'>{'Comment'}</div>
          <div className='value'>{'Some comment'}</div>
        </div>
        */}
        <div className='item'>
          <div className='label'>{'Fee'}</div>
          <div className='value'>{`${data.fee} ETH`}</div>
        </div>
        <div className='actions'>
          <div className='save'>
            {/*
            <JButton
              onClick={console.log}
              text='Save as template'
              iconName='star'
              color='white'
            />
            */}
          </div>
          <div className='repeat'>
            <JButton
              onClick={ignoreEvent(repeat)(assoc('symbol', assetSymbol)(data))}
              text='Repeat'
              iconName='repeat'
              color='white'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

type Props = {
  setActive: (txHash: Hash) => Dispatch,
  repeat: Function,
  data: Transaction,
  assetSymbol: string,
  activeTxHash: ?Hash,
}

TransactionItem.defaultProps = {
  setActive: () => {},
  repeat: () => {},
  data: {},
  assetSymbol: 'ETH',
  activeTxHash: null,
}

export default TransactionItem