// @flow strict

import { t } from 'ttag'

import React, {
  Fragment,
  Component,
} from 'react'

import {
  Form,
  Field,
  type FormRenderProps,
} from 'react-final-form'

import {
  getTypeByInput,
  checkMnemonicType,
} from 'utils/wallets'

import {
  JTextArea,
  JInputField,
  JRaisedButton,
} from 'components/base'

import {
  TitleHeader,
  PasswordInput,
} from 'components'

import walletsImportStyle from './walletsImport.m.scss'

export type WalletsImportBackHandler = () => void
export type WalletsImportStep = 'DATA' | 'PASSWORD'
type WalletsImportSteps = { [WalletsImportStep]: WalletsImportStep }

export type WalletsImportSubmitPayload = {|
  +goToPasswordStep: Function,
  +values: FormFields,
  +currentStep: WalletsImportStep,
|}

type Props = {|
  onBack?: ?WalletsImportBackHandler,
  getInfoDataMessage: string => ?string,
  getSuccessDataMessage: string => ?string,
  +validate: (FormFields, WalletsImportStep) => ?FormFields,
  +submit: WalletsImportSubmitPayload => Promise<?FormFields>,
|}

type StateProps = {|
  +currentStep: WalletsImportStep,
|}

export const STEPS: WalletsImportSteps = {
  DATA: 'DATA',
  PASSWORD: 'PASSWORD',
}

const WALLETS_IMPORT_INITIAL_VALUES: FormFields = {
  name: '',
  data: '',
  password: '',
  passphrase: '',
  derivationPath: '',
  walletType: null,
}

export class WalletsImportView extends Component<Props, StateProps> {
  static defaultProps = {
    onBack: null,
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      currentStep: STEPS.DATA,
    }
  }

  setCurrentStep = (currentStep: WalletsImportStep) => {
    this.setState({ currentStep })
  }

  getTitle = (): string => {
    switch (this.state.currentStep) {
      case STEPS.DATA:
        return t`Import wallet`

      case STEPS.PASSWORD:
        return t`Enter Security Password to Protect Your Wallet`

      default:
        return ''
    }
  }

  goBack = () => {
    const { onBack }: Props = this.props

    return onBack ? onBack() : undefined
  }

  goToDataStep = () => {
    this.setCurrentStep(STEPS.DATA)
  }

  goToPasswordStep = () => {
    this.setCurrentStep(STEPS.PASSWORD)
  }

  handleBack = () => {
    if (!this.props.onBack) {
      return null
    }

    switch (this.state.currentStep) {
      case STEPS.DATA:
        return this.goBack

      case STEPS.PASSWORD:
        return this.goToDataStep

      default:
        return null
    }
  }

  handleChange = (change: FormFieldChange) => (event: SyntheticInputEvent<HTMLInputElement>) => {
    const data: string = event.target.value
    const walletType: ?WalletCustomType = getTypeByInput(data)

    change('data', data)
    change('walletType', walletType)
  }

  validate = (values: FormFields): ?FormFields => {
    const { validate }: Props = this.props
    const { currentStep }: StateProps = this.state

    return validate(values, currentStep)
  }

  handleSubmit = async (values: FormFields): Promise<?FormFields> => {
    const {
      goToPasswordStep,
      props,
      state,
    } = this

    const { submit }: Props = props
    const { currentStep }: StateProps = state

    return submit({
      goToPasswordStep,
      values,
      currentStep,
    })
  }

  renderWalletsImportDataStep = ({
    handleSubmit,
    form,
    values = {},
    submitting: isSubmitting,
  }: FormRenderProps) => {
    const {
      getInfoDataMessage,
      getSuccessDataMessage,
    }: Props = this.props

    return (
      <form
        onSubmit={handleSubmit}
        className={walletsImportStyle.form}
      >
        <Field
          component={JInputField}
          label={t`Wallet Name`}
          name='name'
          isDisabled={isSubmitting}
        />
        <Field
          component={JTextArea}
          onChange={this.handleChange(form.change)}
          label={t`Address, Key, Mnemonic`}
          infoMessage={getInfoDataMessage(values.data) || getSuccessDataMessage(values.data)}
          name='data'
          isDisabled={isSubmitting}
        />
        {checkMnemonicType(values.walletType) && (
          <Fragment>
            <Field
              component={JInputField}
              label={t`Mnemonic Passphrase (Optional)`}
              name='passphrase'
              isDisabled={isSubmitting}
            />
            <Field
              component={JInputField}
              label={t`Derivation Path (Optional)`}
              name='derivationPath'
              isDisabled={isSubmitting}
            />
          </Fragment>
        )}
        <JRaisedButton
          type='submit'
          isLoading={isSubmitting}
        >
          {t`Import`}
        </JRaisedButton>
      </form>
    )
  }

  renderWalletsImportPasswordStep = ({
    handleSubmit,
    values = {},
    submitting: isSubmitting,
  }: FormRenderProps) => (
    <form
      onSubmit={handleSubmit}
      className={walletsImportStyle.form}
    >
      <Field
        component={PasswordInput}
        value={values.password}
        label={t`Security Password`}
        theme='white-icon'
        name='password'
        isDisabled={isSubmitting}
      />
      <JRaisedButton
        type='submit'
        isLoading={isSubmitting}
      >
        {t`Import`}
      </JRaisedButton>
    </form>
  )

  renderWalletsImportForm = (formRenderProps: FormRenderProps) => {
    switch (this.state.currentStep) {
      case STEPS.DATA:
        return this.renderWalletsImportDataStep(formRenderProps)

      case STEPS.PASSWORD:
        return this.renderWalletsImportPasswordStep(formRenderProps)

      default:
        return null
    }
  }

  render() {
    return (
      <div className={walletsImportStyle.core}>
        <TitleHeader
          onBack={this.handleBack()}
          title={this.getTitle()}
        />
        <Form
          validate={this.validate}
          onSubmit={this.handleSubmit}
          render={this.renderWalletsImportForm}
          initialValues={WALLETS_IMPORT_INITIAL_VALUES}
        />
      </div>
    )
  }
}
