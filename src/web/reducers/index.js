import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import entities from './entities';
import currentUser from './current-user';

export default combineReducers({
  entities,
  currentUser,
  routing: routerReducer,
});
