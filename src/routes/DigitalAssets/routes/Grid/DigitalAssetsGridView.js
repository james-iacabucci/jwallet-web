// @flow

import React, { Component } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'

import { JSearch, JTabs, JIcon } from 'components/base'

import {
  PopupButton,
  DigitalAssetsGrid,
  type DigitalAssetsGridItemType,
} from 'components'

const DIGITAL_ASSETS_TABS = {
  '/digital-assets': 'Digital assets',
  '/custom-asset/add': 'Transactions',
}

type Props = {
  openView: () => void,
  closeView: () => void,
  setSearchQuery: (string) => void,
  items: DigitalAssetsGridItemType,
  searchQuery: string,
}

class DigitalAssetsView extends Component<Props> {
  componentDidMount() {
    this.props.openView()
    console.log('MOUNT: DigitalAssetsLayout')
  }

  componentWillUnmount() {
    this.props.closeView()
    console.log('UNMOUNT: DigitalAssetsLayout')
  }

  render() {
    const {
      items,
      searchQuery,
      setSearchQuery,
    } = this.props

    return (
      <div className='digital-assets-grid-view'>
        <div className='header'>
          <JTabs tabs={DIGITAL_ASSETS_TABS} />
          <div className='actions'>
            <div className='search'>
              <JSearch
                onChange={setSearchQuery}
                value={searchQuery}
                placeholder='Search asset...'
              />
            </div>
            <div className='filter'>
              <PopupButton
                icon='filter'
              />
            </div>
            <div className='setting'>
              <JIcon
                size='medium'
                color='gray'
                name='setting-grid'
              />
            </div>
          </div>
        </div>
        <div className='content'>
          <Scrollbars autoHide>
            <DigitalAssetsGrid
              items={items}
            />
          </Scrollbars>
        </div>
      </div>
    )
  }
}

export default DigitalAssetsView
