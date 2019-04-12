
/* @flow */

import React from 'react'
import { storiesOf } from '@storybook/react'
// import {
//   Form,
//   Field,
// } from 'react-final-form'

import { JIcon } from 'components/base'

// import { RecipientPicker } from './RecipientPicker'
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

storiesOf('base|JPicker', module)
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
