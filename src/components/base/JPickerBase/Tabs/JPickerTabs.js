// @flow strict

import * as React from 'react'
import { t } from 'ttag'

import classNames from 'classnames'

import tabsStyle from './jPickerTabs.m.scss'

type Tab = 'contacts' | 'wallets'
type TabClickHandler = (tabName: Tab) => any

type Props = {|
  activeTab: Tab,
  onTabClick: TabClickHandler,
|}

const handleTabClick = (onTabClick: TabClickHandler, tabName: Tab) => (e) => {
  e.stopPropagation()

  onTabClick(tabName)
}

function JPickerTabs({
  activeTab,
  onTabClick,
}: Props) {
  return (
    <div className={tabsStyle.core}>
      <button
        type='button'
        onClick={handleTabClick(onTabClick, 'contacts')}
        className={classNames(
          tabsStyle.button,
          tabsStyle.wallets,
          activeTab === 'contacts' && tabsStyle.active,
        )}
      >
        {t`Contacts`}
      </button>
      <button
        type='button'
        onClick={handleTabClick(onTabClick, 'wallets')}
        className={classNames(
          tabsStyle.button,
          tabsStyle.wallets,
          activeTab === 'wallets' && tabsStyle.active,
        )}
      >
        {t`My Wallets`}
      </button>
    </div>
  )
}

JPickerTabs.defaultProps = {
  activeTab: 'contacts',
}

export { JPickerTabs }
