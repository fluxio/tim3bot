import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';

import { DEBUG } from './lib/config';

import './main.scss';

const root = document.getElementById('root');

function renderApp() {
  // Load the code via commonjs so that it can be dynamically replaced
  // for hot loading.
  const appFactory = require('./lib/app-factory').default;

  ReactDOM.render(appFactory(browserHistory), root);
}

function renderError(error) {
  const RedBox = require('redbox-react');

  ReactDOM.render(<RedBox error={error} />, root);
}

let render = renderApp;

if (DEBUG && module.hot) {
  render = () => {
    try {
      renderApp();
    } catch (error) {
      renderError(error);
    }
  };
  module.hot.accept('./lib/app-factory', () => {
    setTimeout(render);
  });
}

// In prod, this will simply render the app.
// In dev, this will hot load the app (i.e., relevant modules will get updated
// when the code changes). It will also show a red box with a stack trace if
// there is an error.
render();
