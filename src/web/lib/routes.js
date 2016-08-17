import React from 'react';
import { Route, IndexRoute } from 'react-router';

import LayoutView from '../components/layout-view';
import DashboardContainer from '../containers/dashboard-container';
import LoginView from '../components/login-view';

import {
  checkLogin,
} from '../api/index';

import {
  ROOT_PATH,
  LOGIN_PATH,
} from './constants/paths';

function redirectIfUnauthed(nextState, replace, callback) {
  checkLogin()
    .then(isLoggedIn => {
      if (!isLoggedIn) {
        replace(LOGIN_PATH);
      }

      callback();
    });
}

function redirectIfAuthed(nextState, replace, callback) {
  checkLogin()
    .then(isLoggedIn => {
      if (isLoggedIn) {
        replace(ROOT_PATH);
      }

      callback();
    });
}

export default (
  <Route
    path={ROOT_PATH}
    component={LayoutView}
  >
    <IndexRoute
      component={DashboardContainer}
      onEnter={redirectIfUnauthed}
    />
    <Route
      path={LOGIN_PATH}
      component={LoginView}
      onEnter={redirectIfAuthed}
    />
  </Route>
);
