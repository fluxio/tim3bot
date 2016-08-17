import joinUrl from '../join-url';

// App routes
const ROOT_PATH = '/';
const LOGIN_PATH = '/login';

// API paths
const API_ROOT = '/api';
const API_PROFILE_PATH = joinUrl(API_ROOT, 'profile');

// Auth URLs
const SLACK_LOGIN_PATH = '/auth/slack';

export {
  ROOT_PATH,
  LOGIN_PATH,
  API_PROFILE_PATH,
  SLACK_LOGIN_PATH,
};
