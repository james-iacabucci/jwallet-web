// @flow

import { type ComponentType } from 'react'

declare type Index = number

declare type Decimals = number
declare type BalanceString = string

declare type Address = string
declare type OwnerAddress = Address
declare type EthereumAddress = 'Ethereum'
declare type AssetAddress = Address | EthereumAddress

declare type AddressNames = { [Address]: ?string }

declare type SortDirection = 'asc' | 'desc'
declare type LanguageCode = 'en' | 'ko' | 'zh' | 'ja'

declare type FormFields = { [string]: ?string }
declare type SetFieldFunction<T> = ($Keys<T>, string) => void

declare type OwnPropsEmpty = {||}

declare type WorkerError = {|
  +message: string,
|}

declare type HMR = {|
  +accept: (string, (void) => void) => void,
|}

/**
 * Errors
 */
declare type InvalidFieldError = {
  +fieldName: string,
  +message: string,
}

/**
 * Custom react-router types
 */
declare type ReactRouterState = {
  +location: {
    +pathname: string,
    +hash: string,
    +key: string,
    +search: string,
  },
  +routes: [{
    +path: string,
  }],
  params: {
    [string]: string,
  },
  components: [ComponentType],
}
