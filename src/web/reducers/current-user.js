import { handleActions } from 'redux-actions';

import { SET_CURRENT_USER } from '../lib/constants/actions';

function setCurrentUser(state, { payload }) {
  return payload;
}

const currentUserReducer = handleActions({
  [SET_CURRENT_USER]: setCurrentUser,
}, {});

export default currentUserReducer;
