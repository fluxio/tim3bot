import request from './request';

import {
  API_PROFILE_PATH,
  API_TASKS_PATH,
} from '../lib/constants/paths';

function checkLogin() {
  return fetchProfile()
    .then(() => true)
    .catch(() => false);
}

function fetchProfile() {
  return request(API_PROFILE_PATH);
}

function fetchTasks() {
  return request(API_TASKS_PATH);
}

function createTask(task) {
  return request(API_TASKS_PATH, {
    method: 'post',
    body: task,
  });
}

export {
  checkLogin,
  fetchProfile,
  fetchTasks,
  createTask,
};
