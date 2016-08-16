import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { routerMiddleware } from 'react-router-redux';

import rootReducer from '../reducers/index';
import DevTools from '../components/dev-tools';

function configureStore(history, initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(
        thunk,
        createLogger(),
        routerMiddleware(history)
      ),
      DevTools.instrument()
    )
  );

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

export default configureStore;
