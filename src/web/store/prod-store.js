import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers/index';

function configureStore(history, initialState) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      thunk,
      routerMiddleware(history)
    )
  );
}

export default configureStore;
