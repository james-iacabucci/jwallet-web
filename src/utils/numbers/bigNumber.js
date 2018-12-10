// @flow

import BigNumber from 'bignumber.js'

// @TODO:
// Web3 can not work with bignumbe, grater than 4
// This is tempotaty fix for work wuth BigNumber < 7.0.0
// After successfull update we need to remove it completely
if (!BigNumber.BigNumber) {
  // eslint-disable-next-line fp/no-mutation
  BigNumber.BigNumber = BigNumber
}

export { BigNumber }
export default BigNumber
