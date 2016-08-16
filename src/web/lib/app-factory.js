import React from 'react';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from '../store';

import RootContainer from '../containers/root-container';

// Abstracts app creation so that the app is decoupled from its location in the DOM
// and its history type.
function appFactory(history) {
  const store = configureStore(history);
  const wrappedHistory = syncHistoryWithStore(history, store);

  return (
    <RootContainer
      store={store}
      history={wrappedHistory}
    />
  );
}

export default appFactory;
