// @flow

import React, { PureComponent } from 'react'

import classNames from 'classnames'
import {
  JText, JIcon,
} from 'components/base'

type JCheckboxColor = 'white' | 'gray'

type Props = {|
  +onChange: ?((boolean) => void),
  +name: string,
  +label: string,
  +color: JCheckboxColor,
  +children: ?React$Node,
  +isRegular: boolean,
  +isChecked: boolean,
|}

class JCheckbox extends PureComponent<Props> {
  static defaultProps = {
    color: 'gray',
    children: null,
    isRegular: false,
    isChecked: false,
  }

  handleChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    if (this.props.onChange) {
      this.props.onChange(event.target.checked)
    }
  }

  /* eslint-disable jsx-a11y/label-has-for */
  render() {
    const {
      name,
      label,
      color,
      children,
      isRegular,
      isChecked,
    } = this.props

    return (
      <div className={classNames('j-checkbox', `-${color}`)}>
        <label className='field'>
          <input
            onChange={this.handleChange}
            name={`checkbox-${name}`}
            type='checkbox'
            className='checkbox'
            defaultChecked={isChecked}
          />
          <span className='flag -unchecked'>
            <JIcon name='unchecked' color={color} />
          </span>
          <span className='flag -checked'>
            <JIcon name='checked' color={color === 'gray' ? 'blue' : color} />
          </span>
          <span className='label'>
            <JText
              color={color}
              size='normal'
              value={label}
              weight={isRegular ? null : 'bold'}
              whiteSpace='wrap'
            />
          </span>
          {children}
        </label>
      </div>
    )
  }
  /* eslint-enable jsx-a11y/label-has-for */
}

export default JCheckbox
