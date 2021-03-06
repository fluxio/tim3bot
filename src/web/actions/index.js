import { createAction } from 'redux-actions';
import {
  push as navigate,
} from 'react-router-redux';

import * as api from '../api';
import * as actions from '../lib/constants/actions';
import * as entityKeys from '../lib/constants/entity-keys';
import * as methods from '../lib/constants/methods';
import {
  COMPLETE,
} from '../lib/constants/task-states';

const callApi = createAction(actions.CALL_API);
const setCurrentUser = createAction(actions.SET_CURRENT_USER);

function fetchProfile() {
  return dispatch => {
    function request() {
      return api.fetchProfile()
        .then(profile => {
          dispatch(setCurrentUser({ ...profile }));

          return profile;
        })
        .catch(() => {
          dispatch(setCurrentUser({}));

          return {};
        });
    }

    return dispatch(callApi({
      request,
      key: entityKeys.USERS_KEY,
      method: methods.FETCH,
    }));
  };
}

function fetchTasks() {
  return dispatch => (
    dispatch(callApi({
      key: entityKeys.TASKS_KEY,
      method: methods.LIST,
      request: api.fetchTasks,
    }))
  );
}

function createTask(task) {
  return dispatch => (
    dispatch(callApi({
      key: entityKeys.TASKS_KEY,
      method: methods.CREATE,
      request: () => (api.createTask(task)),
    }))
  );
}

function completeTask({ id }) {
  return dispatch => (
    dispatch(callApi({
      key: entityKeys.TASKS_KEY,
      method: methods.UPDATE,
      request: () => (api.updateTask({
        id,
        state: COMPLETE,
      })),
    }))
  );
}

export {
  fetchProfile,
  fetchTasks,
  createTask,
  completeTask,
};
