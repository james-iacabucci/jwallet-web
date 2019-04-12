
/* @flow */

import React from 'react'
import { storiesOf } from '@storybook/react'
// import {
//   Form,
//   Field,
// } from 'react-final-form'

import { JIcon } from 'components/base'

import { JPicker } from './JPicker'
import { JPickerItem } from './Item/Item'
import { JPickerCurrent } from './Current/JPickerCurrent'

// function formStoryWrapper(component, extraProps = {}, initialValues = { }) {
//   return (
//     <Form
//       initialValues={initialValues}
//       onSubmit={values => alert(JSON.stringify(values, false, 4))}
//       render={({
//         form,
//         handleSubmit,
//       }) => (
//         <form onSubmit={handleSubmit}>
//           <Field
//             name='foo'
//             component={component}
//             {...extraProps}
//           />
//         </form>
//       )}
//     />
//   )
// }

// +onOpen: ?(() => void),
// +onClose: ?(() => void),
// +currentRenderer: ?((props: RendererProps) => React$Node),
// +tabsRenderer: ?((props: RendererProps) => React$Node),
// +children: ?React$Node,
// +isDisabled: boolean,

function currentRenderer() {
  return (
    <JPickerCurrent
      label='Recipient'
      isEditable={false}
      iconRenderer={() => <JIcon name='star' color='blue' />}
    />
  )
}

storiesOf('base|JPicker', module)
  .add('Default', () => (
    <div className='story'>
      <JPicker
        label='Recipient'
        isEditable={false}
        iconRenderer={() => <JIcon name='star' color='blue' />}
        currentRenderer={currentRenderer}
      >
        <JPickerItem>1</JPickerItem>
        <JPickerItem>2</JPickerItem>
        <JPickerItem>3</JPickerItem>
        <JPickerItem>4</JPickerItem>
      </JPicker>
    </div>
  ))
  .add('Picker current not editable', () => (
    <div className='story'>
      <JPickerCurrent
        label='Recipient'
        isEditable={false}
        iconRenderer={() => <JIcon name='star' color='blue' />}
      />
    </div>
  ))
  .add('Picker current not editable with value', () => (
    <div className='story'>
      <JPickerCurrent
        label='Recipient'
        value='asfd afs'
        isEditable={false}
        iconRenderer={() => <JIcon name='star' color='blue' />}
      />
    </div>
  ))
  .add('Picker current with icon', () => (
    <div className='story'>
      <JPickerCurrent
        label='Recipient'
        iconRenderer={() => <JIcon name='star' color='blue' />}
      />
    </div>
  ))
  .add('Picker current without icon', () => (
    <div className='story'>
      <JPickerCurrent
        label='Recipient'
        value='abcd'
      />
    </div>
  ))
