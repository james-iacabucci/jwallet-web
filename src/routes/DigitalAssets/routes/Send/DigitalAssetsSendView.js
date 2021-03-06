// @flow

import React, { Component } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { t } from 'ttag'

import JText from 'components/base/JText'
import ESCButton from 'components/ESCButton'
import { STEPS } from 'routes/DigitalAssets/routes/Send/modules/digitalAssetsSend'

import DigitalAssetsSendSteps from './components/Steps'

type Props = {|
  +closeView: () => void,
  +goToNextStep: () => void,
  +goToPrevStep: () => void,
  +openView: (query: string) => void,
  +setPriority: (priority: TXPriorityKey) => void,
  +setFormFieldValue: (fieldName: $Keys<DigitalAssetsSendFormFields>, value: string) => void,
  +setNonceEditable: (isEditable: boolean) => void,
  +digitalAssets: DigitalAssetWithBalance[],
  +addressNames: AddressNames,
  +selectedAsset: ?DigitalAsset,
  +location: {|
    +search: string,
  |},
  +formFieldValues: DigitalAssetsSendFormFields,
  +formFieldErrors: DigitalAssetsSendFormFields,
  +formFieldWarnings: DigitalAssetsSendFormFields,
  +sendAssetError: string,
  +ownerAddress: ?OwnerAddress,
  +priority: TXPriorityKey,
  +currentStep: DigitalAssetsSendStepIndex,
  +gasValues: GasValues,
  +isLoading: boolean,
  +isPotentiallyFail: boolean,
  +fiatCurrency: FiatCurrency,
|}

class DigitalAssetsSendView extends Component<Props> {
  componentDidMount() {
    const {
      openView,
      location,
    }: Props = this.props

    openView(location.search)
  }

  componentWillUnmount() {
    this.props.closeView()
  }

  setFormFieldValue = (fieldName: $Keys<DigitalAssetsSendFormFields>) =>
    (value: string) => this.props.setFormFieldValue(fieldName, value)

  render() {
    const {
      setPriority,
      goToNextStep,
      goToPrevStep,
      digitalAssets,
      addressNames,
      selectedAsset,
      formFieldValues,
      formFieldErrors,
      formFieldWarnings,
      setNonceEditable,
      sendAssetError,
      ownerAddress,
      priority,
      currentStep,
      isLoading,
      gasValues,
      isPotentiallyFail,
      fiatCurrency,
    }: Props = this.props

    if (!ownerAddress) {
      return null
    }

    return (
      <div className='digital-assets-send-view'>
        <div className='header'>
          <div className='container'>
            <JText
              size='tab'
              color='gray'
              value={t`Send asset`}
            />
            <div className='actions'>
              <ESCButton
                onESC={goToPrevStep}
                iconName={(currentStep === STEPS.FORM) ? 'padding-cross' : 'arrow-left'}
                color='gray'
                isDisabled={isLoading}
              />
            </div>
          </div>
        </div>
        <div className='content'>
          <Scrollbars autoHide>
            <DigitalAssetsSendSteps
              goBack={goToPrevStep}
              setPriority={setPriority}
              goToNextStep={goToNextStep}
              setFormFieldValue={this.setFormFieldValue}
              formFieldValues={formFieldValues}
              formFieldErrors={formFieldErrors}
              formFieldWarnings={formFieldWarnings}
              addressNames={addressNames}
              digitalAssets={digitalAssets}
              selectedAsset={selectedAsset}
              ownerAddress={ownerAddress}
              priority={priority}
              currentStep={currentStep}
              isLoading={isLoading}
              gasValues={gasValues}
              sendAssetError={sendAssetError}
              setNonceEditable={setNonceEditable}
              isPotentiallyFail={isPotentiallyFail}
              fiatCurrency={fiatCurrency}
            />
          </Scrollbars>
        </div>
      </div>
    )
  }
}

export default DigitalAssetsSendView
