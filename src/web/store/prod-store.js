import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';

import apiMiddleware from '../lib/middleware/api-middleware';
import rootReducer from '../reducers/index';

function configureStore(history, initialState) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      thunk,
      apiMiddleware,
      routerMiddleware(history)
    )
  );
}

export default configureStore;
