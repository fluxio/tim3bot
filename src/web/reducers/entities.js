import { combineReducers } from 'redux';

import {
  API_REQUEST,
  API_SUCCESS,
  API_FAILURE,
} from '../lib/constants/actions';

import * as entityKeys from '../lib/constants/entity-keys';
import * as methods from '../lib/constants/methods';

function entities(key) {
  return (state = {}, { type, payload = {} } = {}) => {
    let newState = state;

    const { method, body } = payload;

    if (type === API_SUCCESS && payload.key === key) {
      if (method === methods.LIST) {
        newState = body;
      } else if (method === methods.DELETE) {
        newState = Object.keys(state).reduce((acc, id) => {
          const ret = acc;

          if (id !== String(body.id)) {
            ret[id] = state[id];
          }

          return ret;
        }, {});
      } else {
        newState = {
          ...state,
          [body.id]: body,
        };
      }
    }

    return newState;
  };
}

function handleError(state, { type, payload = {} } = {}) {
  let newMessage = '';

  if (type === API_FAILURE) {
    const { status, message } = payload.error || {};

    if (status === 401 || status === 403) {
      newMessage = "We're sorry, but you're not allowed to access this page.";
    } else {
      newMessage = message;
    }
  }

  return newMessage;
}

function fetching(state = {}, { type, payload = {} }) {
  const { key } = payload;
  let newState = state;

  if (type === API_REQUEST) {
    newState = {
      ...state,
      [key]: true,
    };
  } else if (type === API_SUCCESS || type === API_FAILURE) {
    newState = {
      ...state,
      [key]: false,
    };
  }

  return newState;
}

export default combineReducers({
  fetching,
  [entityKeys.USERS_KEY]: entities(entityKeys.USERS_KEY),
  [entityKeys.TASKS_KEY]: entities(entityKeys.TASKS_KEY),
  error: handleError,
});
