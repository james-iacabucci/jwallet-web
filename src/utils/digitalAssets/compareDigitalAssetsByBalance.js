// @flow

import { BigNumber } from 'bignumber.js'

function compareDigitalAssetsByBalance(
  first: ?Balance,
  second: ?Balance,
  direction: SortDirection,
): number {
  if (!(first && second)) {
    return 0
  }

  const firstNum = new BigNumber(first.value)
  const secondNum = new BigNumber(second.value)

  if (firstNum.gt(secondNum)) {
    return (direction === 'asc') ? 1 : -1
  } else if (firstNum.lt(secondNum)) {
    return (direction === 'asc') ? -1 : 1
  } else {
    return 0
  }
}

export default compareDigitalAssetsByBalance