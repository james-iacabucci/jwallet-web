// @flow strict

declare type FinalFormInput = {
  name: string,
  onBlur: (?SyntheticFocusEvent<*>) => void,
  onChange: (SyntheticInputEvent<*> | any) => void,
  onFocus: (?SyntheticFocusEvent<*>) => void,
  value: any,
  checked?: boolean,
}

declare type FinalFormMeta = {
  active?: boolean,
  data?: Object,
  dirty?: boolean,
  dirtySinceLastSubmit?: boolean,
  error?: string,
  initial?: boolean,
  invalid?: boolean,
  meta?: boolean,
  pristine?: boolean,
  submitError?: any,
  submitFailed?: boolean,
  submitSucceeded?: boolean,
  submitting?: boolean,
  touched?: boolean,
  valid?: boolean,
  visited?: boolean,
}

declare type FinalFormValidateType = 'touched' |
  'visited' |
  'dirtySinceLastSubmit'
