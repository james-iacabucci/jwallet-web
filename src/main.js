// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { syncHistoryWithStore } from 'react-router-redux'

import router from 'routes/index'
import configureStore from 'store/configureStore'
import { gaSetUserDimension, DIMENSIONS } from 'utils/analytics'

import './data/lang'

import AppContainer from './AppContainer'

import browsercheck from './browsercheck'

// ========================================================
// Browser History Setup
// ========================================================
const browserHistory = createBrowserHistory()

// ========================================================
// Store and History Instantiation
// ========================================================
// Create redux store and sync with react-router-redux. We have installed the
// react-router-redux reducer under the routerKey "router" in src/routes/index.js,
// so we need to provide a custom `selectLocationState` to inform
// react-router-redux of its location.
const initialState = window.___INITIAL_STATE__

const { store, persistor } = configureStore(initialState, browserHistory)

const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: state => state.router,
})

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE: ?HTMLElement = document.getElementById('root')

if (!MOUNT_NODE) {
  throw new Error('MOUNT_NODE does not exist')
}

// FIXME: move to analytics middleware after language selection implementation
if (navigator.language) {
  gaSetUserDimension(DIMENSIONS.LANGUAGE, navigator.language.toLowerCase())
}

const renderApp = () => {
  browsercheck()
    .then(
      () => {
        const appContainer = (
          <AppContainer
            store={store}
            routes={router}
            history={history}
            persistor={persistor}
          />
        )

        ReactDOM.render(appContainer, MOUNT_NODE)
      },
      (err) => {
        console.error(err)
      }
    )
    .catch((err) => {
      throw err
    })
}

if (!__DEV__) {
  renderApp()
} else {
  // ========================================================
  // HMR Setup
  // ========================================================
  const hmr: HMR = (module /* :: : Object */).hot

  if (hmr) {
    // Development render functions
    const renderError = (error) => {
      const RedBox = require('redbox-react').default

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }

    // Wrap render in try/catch
    const renderDev = () => {
      try {
        renderApp()
      } catch (error) {
        renderError(error)
      }
    }

    // Setup hot module replacement
    hmr.accept('./routes/index', () => {
      setTimeout(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE)

        renderDev()
      })
    })
  }

  renderApp()
}
