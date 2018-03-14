// @flow

import React from 'react'
import { Link } from 'react-router'

const AssetsStep = () => (
  <div className='create-wallet-assets-step'>
    <div>{'Popular assets'}</div>
    <Link to='/'>{i18n('routes.createWallet.buttonTitle.finish')}</Link>
  </div>
)

export default AssetsStep