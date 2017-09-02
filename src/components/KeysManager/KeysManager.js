import React from 'react'
import PropTypes from 'prop-types'

import JbDropdown from 'components/base/JbDropdown'

import KeysManagerPopover from './KeysManagerPopover'
import KeysManagerTitle from './KeysManagerTitle'

function KeysManager(props) {
  const {
    setActiveKey,
    addNewKeys,
    importKeys,
    backupKeys,
    clearKeys,
    keys,
    active,
  } = props

  const { privateKey, balance, code } = keys[active]
  const title = <KeysManagerTitle privateKey={privateKey} balance={balance} code={code} />

  return (
    <JbDropdown
      className='keys-manager'
      parentClassName='header__keys-manager pull-right'
      title={title}
    >
      <KeysManagerPopover
        setActiveKey={setActiveKey}
        addNewKeys={addNewKeys}
        importKeys={importKeys}
        backupKeys={backupKeys}
        clearKeys={clearKeys}
        keys={keys}
        active={active}
      />
    </JbDropdown>
  )
}

KeysManager.propTypes = {
  setActiveKey: PropTypes.func.isRequired,
  addNewKeys: PropTypes.func.isRequired,
  importKeys: PropTypes.func.isRequired,
  backupKeys: PropTypes.func.isRequired,
  clearKeys: PropTypes.func.isRequired,
  keys: PropTypes.array.isRequired,
  active: PropTypes.number.isRequired,
}

export default KeysManager
