import React, { PropTypes } from 'react';
import { Provider, connect } from 'react-redux';
import { Router } from 'react-router';

import routes from '../lib/routes';

function Root({ store, history }) {
  return (
    <Provider store={store}>
      <Router
        history={history}
        routes={routes}
      />
    </Provider>
  );
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default connect(state => state, {})(Root);
