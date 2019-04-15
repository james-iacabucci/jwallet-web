// @flow strict

import * as React from 'react'
import classNames from 'classnames'

import handle from 'utils/eventHandlers/handle'
import { JIcon } from 'components/base'

import jPickerBodyStyle from './jPickerBody.m.scss'

type RendererProps = {
  isOpen: boolean,
  isDisabled: boolean,
}

type Props = {|
  +isOpen: boolean,
  +isDisabled: boolean,
  +currentRenderer: ?((props: RendererProps) => React$Node),
  +toggle: (isOpen: boolean) => any,
  +children: ?React$Node,
|}

function JPickerBody({
  isOpen,
  isDisabled,
  currentRenderer,
  toggle,
  children,
}: Props) {
  const currentEl = !currentRenderer ? null : currentRenderer({
    isOpen,
    isDisabled,
  })

  return (
    <div
      className={classNames(
        jPickerBodyStyle.core,
        isOpen && jPickerBodyStyle.active,
        isDisabled && jPickerBodyStyle.disabled,
      )}
    >
      <div className={jPickerBodyStyle.select}>
        <div
          onClick={isDisabled ? undefined : handle(toggle)(!isOpen)}
          className={jPickerBodyStyle.current}
        >
          {currentEl}
          <div className={jPickerBodyStyle.chevron}>
            <JIcon name={isOpen ? 'chevron-up' : 'chevron-down'} color='blue' />
          </div>
        </div>
        <div onClick={handle(toggle)(false)} className={jPickerBodyStyle.options}>
          {children}
        </div>
      </div>
      {isOpen && <div onClick={handle(toggle)(false)} className={jPickerBodyStyle.overlay} />}
    </div>
  )
}

export { JPickerBody }
