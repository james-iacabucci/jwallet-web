
/* @flow */

import React from 'react'
import { storiesOf } from '@storybook/react'
import {
  Form,
  Field,
} from 'react-final-form'

import { JIcon } from 'components/base'

import { RecipientPicker } from './RecipientPicker'
import { PickerCurrent } from './Current/JPickerCurrent'

function formStoryWrapper(component, extraProps = {}, initialValues = { }) {
  return (
    <Form
      initialValues={initialValues}
      onSubmit={values => alert(JSON.stringify(values, false, 4))}
      render={({
        form,
        handleSubmit,
      }) => (
        <form onSubmit={handleSubmit}>
          <Field
            name='foo'
            component={component}
            {...extraProps}
          />
        </form>
      )}
    />
  )
}

storiesOf('RecipientPicker', module)
  .add('Default', () => (
    <div className='story'>
      {formStoryWrapper(RecipientPicker, {
        label: 'Label',
      })}
    </div>
  ))
  .add('Disabled', () => (
    <div className='story'>
      {formStoryWrapper(RecipientPicker, {
        label: 'Disabled',
        disabled: true,
      }, { foo: 'Some text' })}
    </div>
  ))
  .add('Error and message', () => (
    <div className='story'>
      {formStoryWrapper(RecipientPicker, {
        label: 'Title',
        infoMessage: 'Hello world',
        validate: () => 'Some error',
      })}
    </div>
  ))
  .add('Picker current', () => (
    <div className='story'>
      <PickerCurrent
        label='Recipient'
        value=''
        iconRenderer={() => <JIcon name='star' color='blue' />}
      />
    </div>
  ))
