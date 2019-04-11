// @flow

import createSagaMiddleware from 'redux-saga'

import { persistStore } from 'redux-persist'
import {
  reduxPlugin,
  router5Middleware,
} from 'redux-router5'

import {
  compose,
  createStore,
  applyMiddleware,
} from 'redux'

import sagas from './sagas'
import workers from '../workers'
import middlewares from '../middlewares'
import { makeRootReducer } from './reducers'

const sagaMiddleware = createSagaMiddleware()

function configureStore({
  initialState = {},
  router,
}: {
  initialState: $Shape<AppState>,
  router: Object,
}) {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [
    sagaMiddleware,
    router5Middleware(router),
    // redirect,
    ...middlewares,
  ]

  if (__DEV__ && !window.localStorage.hideReduxLogger) {
    const { logger } = require('redux-logger')

    /* eslint-disable fp/no-mutating-methods */
    middleware.push(logger)
    /* eslint-enable fp/no-mutating-methods */
  }

  // ======================================================
  // Store Enhancers, redux developer tools
  // ======================================================
  const composeEnhancers =
    typeof window === 'object' && __DEV__ &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      }) : compose

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const rootReducer = makeRootReducer()
  const enhancer = composeEnhancers(
    applyMiddleware(...middleware),
  )
  const store = createStore(rootReducer, initialState, enhancer)
  const persistor = persistStore(store)
  router.usePlugin(reduxPlugin(store.dispatch))

  // ======================================================
  // Run sagas
  // ======================================================
  sagas.forEach(saga => sagaMiddleware.run(saga))

  // ======================================================
  // Start workers
  // ======================================================
  workers.forEach(worker => worker.run(store))

  return {
    store,
    persistor,
  }
}

export default configureStore
