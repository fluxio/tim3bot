import joinUrl from '../join-url';

// App routes
export const ROOT_PATH = '/';
export const LOGIN_PATH = '/login';

// API paths
const API_ROOT = '/api';
export const API_PROFILE_PATH = joinUrl(API_ROOT, 'profile');
export const API_TASKS_PATH = joinUrl(API_ROOT, 'tasks');

// Auth URLs
const AUTH_ROOT = '/auth';
export const SLACK_LOGIN_PATH = joinUrl(AUTH_ROOT, 'slack');
export const LOGOUT_PATH = joinUrl(AUTH_ROOT, 'logout');
