// @flow

import React from 'react'

import JText from 'components/base/JText'

type Props = {|
  +addressNames: AddressNames,
  +selectedAsset: DigitalAsset,
  +formFieldValues: DigitalAssetsSendFormFields,
  +priority: TXPriorityKey,
  +ownerAddress: OwnerAddress,
|}

function DigitalAssetsSendConfirmCard({
  addressNames,
  selectedAsset,
  formFieldValues,
  priority,
  ownerAddress,
}: Props) {
  const {
    amount,
    // gasLimit,
    // gasPrice,
    recepient,
  }: DigitalAssetsSendFormFields = formFieldValues

  const {
    symbol,
  }: DigitalAsset = selectedAsset

  const toName: ?string = addressNames[recepient]
  const fromName: ?string = addressNames[ownerAddress]

  return (
    <div className='digital-assets-send-confirm-card'>
      <div className='content'>
        <div className='amount'>
          <JText
            value={`${amount} ${symbol}`}
            size='header'
            color='dark'
            weight='bold'
          />
        </div>
        <div className='fee'>
          <JText value={`Fee — ${priority}ETH`} color='gray' />
        </div>
        <div className='field'>
          <div className='direction'>
            <JText value={`From${fromName ? ` — ${fromName}` : ''}`} color='dark' />
          </div>
          <div className='address'>
            <JText value={ownerAddress} color='blue' />
          </div>
        </div>
        <div className='field'>
          <div className='direction'>
            <JText value={`To${toName ? ` — ${toName}` : ''}`} color='dark' />
          </div>
          <div className='address'>
            <JText value={recepient} color='blue' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DigitalAssetsSendConfirmCard