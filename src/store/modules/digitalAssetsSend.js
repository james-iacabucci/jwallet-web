// @flow

export const OPEN_VIEW = '@@digitalAssetsSend/OPEN_VIEW'
export const CLOSE_VIEW = '@@digitalAssetsSend/CLOSE_VIEW'

export const SET_PRIORITY = '@@digitalAssetsSend/SET_PRIORITY'
export const SET_IS_LOADING = '@@digitalAssetsSend/SET_IS_LOADING'
export const GO_TO_NEXT_STEP = '@@digitalAssetsSend/GO_TO_NEXT_STEP'
export const GO_TO_PREV_STEP = '@@digitalAssetsSend/GO_TO_PREV_STEP'
export const SET_CURRENT_STEP = '@@digitalAssetsSend/SET_CURRENT_STEP'

// Fetched from blockchain values
export const SET_REQUESTED_GAS_PRICE_VALUE = '@@digitalAssetsSend/SET_REQUESTED_GAS_PRICE_VALUE'
export const SET_REQUESTED_GAS_LIMIT_VALUE = '@@digitalAssetsSend/SET_REQUESTED_GAS_LIMIT_VALUE'

// Values that will be used with sendTransacton (transfer)
// This values can be modified on the 1st step and can't be on the 2nd
export const SET_FINAL_GAS_PRICE_VALUE = '@@digitalAssetsSend/SET_FINAL_GAS_PRICE_VALUE'
export const SET_FINAL_GAS_LIMIT_VALUE = '@@digitalAssetsSend/SET_FINAL_GAS_LIMIT_VALUE'

export const SET_FORM_FIELD_VALUE = '@@digitalAssetsSend/SET_FORM_FIELD_VALUE'
export const SET_FORM_FIELD_ERROR = '@@digitalAssetsSend/SET_FORM_FIELD_ERROR'
export const SET_FORM_FIELD_WARNING = '@@digitalAssetsSend/SET_FORM_FIELD_WARNING'
export const SET_SEND_ASSET_ERROR = '@@digitalAssetsSend/SET_SEND_ASSET_ERROR'
export const CLEAN_VALIDATION_ERRORS = '@@digitalAssetsSend/CLEAN_VALIDATION_ERRORS'
export const SET_NONCE_EDITABLE = '@@digitalAssetsSend/SET_NONCE_EDITABLE'
export const SET_NOTIFY_POTENTIALLY_FAIL = '@@digitalAssetsSend/SET_NOTIFY_POTENTIALLY_FAIL'

export const CLEAN = '@@digitalAssetsSend/CLEAN'

export const STEPS: DigitalAssetsSendSteps = {
  FORM: 0,
  CONFIRM: 1,
}

export const TXPRIORITY: TXPriority = {
  LOW: 1,
  NORMAL: 1.5,
  HIGH: 2,
  CUSTOM: 0,
}

export function openView(params: Object) {
  return {
    type: OPEN_VIEW,
    payload: {
      params,
    },
  }
}

export function closeView() {
  return {
    type: CLOSE_VIEW,
  }
}

export function setPriority(priority: TXPriorityKey) {
  return {
    type: SET_PRIORITY,
    payload: {
      priority,
    },
  }
}

export function setIsLoading(isLoading: boolean) {
  return {
    type: SET_IS_LOADING,
    payload: {
      isLoading,
    },
  }
}

export function setRequestedGasPrice(value: ?string) {
  return {
    type: SET_REQUESTED_GAS_PRICE_VALUE,
    payload: {
      value,
    },
  }
}

export function setRequestedGasLimit(value: ?string) {
  return {
    type: SET_REQUESTED_GAS_LIMIT_VALUE,
    payload: {
      value,
    },
  }
}

export function setFinalGasPrice(value: ?string) {
  return {
    type: SET_FINAL_GAS_PRICE_VALUE,
    payload: {
      value,
    },
  }
}

export function setFinalGasLimit(value: ?string) {
  return {
    type: SET_FINAL_GAS_LIMIT_VALUE,
    payload: {
      value,
    },
  }
}

export function goToNextStep() {
  return {
    type: GO_TO_NEXT_STEP,
  }
}

export function goToPrevStep() {
  return {
    type: GO_TO_PREV_STEP,
  }
}

export function setCurrentStep(currentStep: DigitalAssetsSendStepIndex) {
  return {
    type: SET_CURRENT_STEP,
    payload: {
      currentStep,
    },
  }
}

export function setFormFieldValue(
  fieldName: $Keys<DigitalAssetsSendFormFields>,
  value: string,
) {
  return {
    type: SET_FORM_FIELD_VALUE,
    payload: {
      value,
      fieldName,
    },
  }
}

export function setFormFieldError(
  fieldName: $Keys<DigitalAssetsSendFormFields>,
  message: string,
) {
  return {
    type: SET_FORM_FIELD_ERROR,
    payload: {
      message,
      fieldName,
    },
  }
}

export function setFormFieldWarning(
  fieldName: $Keys<DigitalAssetsSendFormFields>,
  message: string,
) {
  return {
    type: SET_FORM_FIELD_WARNING,
    payload: {
      message,
      fieldName,
    },
  }
}

export function setSendAssetError(message: string) {
  return {
    type: SET_SEND_ASSET_ERROR,
    payload: {
      message,
    },
  }
}

export function cleanValidationErrors() {
  return {
    type: CLEAN_VALIDATION_ERRORS,
  }
}

export function setNonceEditable(isEditable: boolean) {
  return {
    type: SET_NONCE_EDITABLE,
    payload: {
      isEditable,
    },
  }
}

export function setIsPotentiallyFail(willFail: boolean) {
  return {
    type: SET_NOTIFY_POTENTIALLY_FAIL,
    payload: {
      willFail,
    },
  }
}

export type DigitalAssetsSendAction =
  ExtractReturn<typeof openView> |
  ExtractReturn<typeof closeView> |
  ExtractReturn<typeof setPriority> |
  ExtractReturn<typeof setIsLoading> |
  ExtractReturn<typeof goToNextStep> |
  ExtractReturn<typeof goToPrevStep> |
  ExtractReturn<typeof setCurrentStep> |
  ExtractReturn<typeof setFormFieldValue> |
  ExtractReturn<typeof setFormFieldError> |
  ExtractReturn<typeof setFormFieldWarning> |
  ExtractReturn<typeof setRequestedGasPrice> |
  ExtractReturn<typeof setRequestedGasLimit> |
  ExtractReturn<typeof setFinalGasLimit> |
  ExtractReturn<typeof setFinalGasPrice> |
  ExtractReturn<typeof cleanValidationErrors> |
  ExtractReturn<typeof setNonceEditable> |
  ExtractReturn<typeof setIsPotentiallyFail>

const initialState: DigitalAssetsSendState = {
  formFieldValues: {
    nonce: '',
    amount: '',
    comment: '',
    gasLimit: '',
    gasPrice: '',
    password: '',
    recipient: '',
    amountFiat: '',
    assetAddress: '',
  },
  formFieldErrors: {
    nonce: '',
    amount: '',
    comment: '',
    gasLimit: '',
    gasPrice: '',
    password: '',
    recipient: '',
    amountFiat: '',
    assetAddress: '',
  },
  formFieldWarnings: {
    nonce: '',
    amount: '',
    comment: '',
    gasLimit: '',
    gasPrice: '',
    password: '',
    recipient: '',
    amountFiat: '',
    assetAddress: '',
  },
  currentStep: STEPS.FORM,
  priority: 'NORMAL',
  isLoading: false,
  sendAssetError: '',
  requestedGasValues: {
    gasPrice: null,
    gasLimit: null,
  },
  finalGasValues: {
    gasPrice: null,
    gasLimit: null,
  },
  isPotentiallyFail: false,
}

function digitalAssetsSend(
  state: DigitalAssetsSendState = initialState,
  action: DigitalAssetsSendAction,
): DigitalAssetsSendState {
  switch (action.type) {
    case CLOSE_VIEW:
      return {
        ...state,
        formFieldErrors: initialState.formFieldErrors,
        formFieldValues: {
          ...state.formFieldValues,
          password: '',
        },
        currentStep: initialState.currentStep,
      }

    case SET_PRIORITY:
      return {
        ...state,
        priority: action.payload.priority,
        formFieldErrors: {
          ...state.formFieldErrors,
          gasPrice: '',
          gasLimit: '',
        },
        formFieldWarnings: {
          ...state.formFieldWarnings,
          gasPrice: '',
          gasLimit: '',
        },
      }

    case SET_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload.isLoading,
      }

    case SET_FORM_FIELD_VALUE: {
      const {
        value,
        fieldName,
      } = action.payload

      return {
        ...state,
        formFieldErrors: {
          ...state.formFieldErrors,
          [fieldName]: '',
        },
        formFieldWarnings: {
          ...state.formFieldWarnings,
          [fieldName]: '',
        },
        formFieldValues: {
          ...state.formFieldValues,
          [fieldName]: value,
        },
      }
    }

    case SET_FORM_FIELD_ERROR: {
      const {
        message,
        fieldName,
      } = action.payload

      return {
        ...state,
        formFieldErrors: {
          ...state.formFieldErrors,
          [fieldName]: message,
        },
        formFieldWarnings: {
          ...state.formFieldWarnings,
          [fieldName]: '',
        },
      }
    }

    case SET_FORM_FIELD_WARNING: {
      const {
        message,
        fieldName,
      } = action.payload

      return {
        ...state,
        formFieldErrors: {
          ...state.formFieldErrors,
          [fieldName]: '',
        },
        formFieldWarnings: {
          ...state.formFieldWarnings,
          [fieldName]: message,
        },
      }
    }

    case SET_CURRENT_STEP:
      return {
        ...state,
        formFieldErrors: initialState.formFieldErrors,
        formFieldValues: {
          ...state.formFieldValues,
          password: '',
        },
        currentStep: action.payload.currentStep,
      }

    case SET_REQUESTED_GAS_PRICE_VALUE: {
      const { value } = action.payload

      return {
        ...state,
        requestedGasValues: {
          ...state.requestedGasValues,
          gasPrice: value,
        },
      }
    }

    case SET_REQUESTED_GAS_LIMIT_VALUE: {
      const { value } = action.payload

      return {
        ...state,
        requestedGasValues: {
          ...state.requestedGasValues,
          gasLimit: value,
        },
      }
    }

    case SET_FINAL_GAS_PRICE_VALUE: {
      const { value } = action.payload

      return {
        ...state,
        finalGasValues: {
          ...state.finalGasValues,
          gasPrice: value,
        },
      }
    }

    case SET_FINAL_GAS_LIMIT_VALUE: {
      const { value } = action.payload

      return {
        ...state,
        finalGasValues: {
          ...state.finalGasValues,
          gasLimit: value,
        },
      }
    }

    case SET_SEND_ASSET_ERROR: {
      const { message } = action.payload

      return {
        ...state,
        sendAssetError: message,
      }
    }

    case SET_NOTIFY_POTENTIALLY_FAIL: {
      const { willFail } = action.payload

      return {
        ...state,
        isPotentiallyFail: willFail,
      }
    }

    case CLEAN_VALIDATION_ERRORS: {
      return {
        ...state,
        formFieldErrors: initialState.formFieldErrors,
        sendAssetError: '',
        isPotentiallyFail: false,
      }
    }

    case OPEN_VIEW:
      return initialState

    default:
      return state
  }
}

export default digitalAssetsSend
