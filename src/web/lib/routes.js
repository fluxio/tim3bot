import React from 'react';
import { Route, IndexRoute } from 'react-router';

import LayoutView from '../components/layout-view';

import {
  ROOT_PATH,
} from '../lib/paths';

export default (
  <Route
    path={ROOT_PATH}
    component={LayoutView}
  />
);
