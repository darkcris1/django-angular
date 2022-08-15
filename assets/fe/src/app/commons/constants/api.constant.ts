import { urlsafe } from 'src/app/commons/utils/http.util';
import { API_URL, API_STREAM } from './conf.constant';

// USERS

export const API_USERS = urlsafe(API_URL, 'users');
export const API_USERS_AUTH = urlsafe(API_USERS, 'auth');

export const API_USERS_LOGIN = urlsafe(API_USERS, 'login');
export const API_USERS_SIGNUP = urlsafe(API_USERS, 'signup');

// MESSAGING
export const STREAM_GLOBAL = urlsafe(API_STREAM, 'global');