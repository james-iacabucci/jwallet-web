import React, { Component } from 'react'
import PropTypes from 'prop-types'

import config from 'config'

import { getFieldMessage, handleEnterKeyPress } from 'utils'

import PasswordField from 'components/PasswordField'
import { JModal, JModalButton, JTextInput } from 'components/base'

class NewKeystorePasswordModal extends Component {
  constructor(props) {
    super(props)
    this.state = { isShake: false }
  }

  render() {
    return (
      <JModal
        closeModal={this.closeModal}
        submitModal={this.submitModal}
        name='new-keystore-password'
        header={this.renderHeader()}
        body={this.renderBody()}
        footer={this.renderFooter()}
        isOpen={this.props.isOpen}
        isShake={this.state.isShake}
      />
    )
  }

  renderHeader = () => {
    return <div className='modal__title'>{'New Keystore Password'}</div>
  }

  renderBody = () => {
    return (
      <div>
        {this.renderOldPassword()}
        {this.renderNewPassword()}
      </div>
    )
  }

  renderOldPassword = () => {
    const { setOldKeystorePassword, oldPassword } = this.props

    return (
      <JTextInput
        onValueChange={setOldKeystorePassword}
        name='keystore-password'
        placeholder='Current password'
        value={oldPassword}
        errorMessage={this.getInvalidFieldMessage('oldPassword')}
        editable
        secureTextEntry
      />
    )
  }

  renderNewPassword = () => {
    const { setNewKeystorePassword, newPassword } = this.props

    return (
      <PasswordField
        onPasswordChange={setNewKeystorePassword}
        password={newPassword}
        placeholder='New password'
        errorMessage={this.getInvalidFieldMessage('newPassword')}
      />
    )
  }

  renderFooter = () => {
    return (
      <JModalButton
        onPress={this.setKeystorePassword}
        name={'new-keystore-password'}
        title={'Confirm'}
        disabled={this.isModalButtonDisabled()}
      />
    )
  }

  closeModal = () => {
    const { closeNewKeystorePasswordModal, onClose } = this.props

    if (onClose) {
      onClose()
    }

    closeNewKeystorePasswordModal()
  }

  submitModal = () => handleEnterKeyPress(this.setKeystorePassword)

  setKeystorePassword = () => {
    const { setKeystorePassword, oldPassword, newPassword } = this.props

    setKeystorePassword(oldPassword, newPassword, this.closeModal, this.setInvalid)
  }

  setInvalid = (err) => {
    const errMsg = err.message
    const fieldName = (errMsg === 'Password is incorrect') ? 'oldPassword' : 'newPassword'

    this.props.setNewKeystorePasswordInvalidField(fieldName, errMsg)
    this.shake()
  }

  isModalButtonDisabled = () => {
    const { oldPassword, newPassword } = this.props

    return !(oldPassword.length && newPassword.length)
  }

  shake = () => {
    this.setState({ isShake: true })

    setTimeout(() => this.setState({ isShake: false }), config.modalShakeTimeout)
  }

  getInvalidFieldMessage = fieldName => getFieldMessage(this.props.invalidFields, fieldName)
}

NewKeystorePasswordModal.propTypes = {
  closeNewKeystorePasswordModal: PropTypes.func.isRequired,
  setOldKeystorePassword: PropTypes.func.isRequired,
  setNewKeystorePassword: PropTypes.func.isRequired,
  setNewKeystorePasswordInvalidField: PropTypes.func.isRequired,
  setKeystorePassword: PropTypes.func.isRequired,
  invalidFields: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  })).isRequired,
  oldPassword: PropTypes.string.isRequired,
  newPassword: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
}

NewKeystorePasswordModal.defaultProps = {
  onClose: null,
}

export default NewKeystorePasswordModal
