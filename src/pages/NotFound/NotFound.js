// @flow

import React from 'react'
import { t } from 'ttag'

import {
  JThumbnail,
  JFlatButton,
} from 'components/base'

export function NotFound() {
  return (
    <div className='not-found-view'>
      <div className='content'>
        <JThumbnail
          color='white'
          image='auth-question'
          title={t`404 – Page Not Found`}
          isTransparent
          description={[
            t`The page you're looking for can't be found.`,
            t`Check the URL and try again.`,
          ]}
        />
        <div className='actions'>
          <JFlatButton
            className='back'
            to='/'
            color='white'
            label={t`Back to Home`}
          />
        </div>
      </div>
    </div>
  )
}
