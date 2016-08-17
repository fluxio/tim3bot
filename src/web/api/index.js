import request from './request';

import {
  API_PROFILE_PATH,
} from '../lib/constants/paths';

function checkLogin() {
  return fetchProfile()
    .then(() => true)
    .catch(() => false);
}

function fetchProfile() {
  return request(API_PROFILE_PATH);
}

export {
  checkLogin,
  fetchProfile,
};
