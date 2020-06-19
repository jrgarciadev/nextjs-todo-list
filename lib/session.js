/* eslint-disable no-nested-ternary */
import cookie from 'js-cookie';
import redirect from './redirect';
import { decodeValue, encodeValue } from '../utils';

export const setCookie = (key, value, days = 1) => {
  if (process.browser) {
    const today = new Date();
    const resultDate = new Date(today);
    resultDate.setDate(today.getDate() + days);
    cookie.set(key, encodeValue(value), {
      expires: resultDate,
      path: '/',
    });
  }
};

export const setLocalStorage = (key, value) => {
  if (process.browser) {
    window.localStorage.setItem(key, encodeValue(value));
  }
};

export const removeLocaleStorage = (key) => {
  if (process.browser) {
    window.localStorage.removeItem(key);
  }
};

export const getLocaleStorage = (key) => {
  if (process.browser) {
    const value = window.localStorage.getItem(key);
    return decodeValue(value);
  }
  return null;
};

export const removeCookie = (key) => {
  if (process.browser) {
    cookie.remove(key, {
      expires: 1,
    });
  }
};

const getCookieFromBrowser = (key) => {
  return decodeValue(cookie.get(key));
};

const getCookieFromServer = (key, req) => {
  if (!req.headers.cookie) {
    return undefined;
  }
  const rawCookie = req.headers.cookie.split(';').find((c) => c.trim().startsWith(`${key}=`));
  if (!rawCookie) {
    return undefined;
  }
  return rawCookie.split('=')[1];
};

export const getCookie = (key, req) => {
  return process.browser ? getCookieFromBrowser(key) : req ? getCookieFromServer(key, req) : null;
};

export const getJwt = () => {
  return getLocaleStorage('idToken');
};

export const isAuthenticated = () => !!getJwt();

export const redirectIfAuthenticated = () => {
  if (isAuthenticated()) {
    redirect('/');
    return true;
  }
  return false;
};

export const redirectIfNotAuthenticated = () => {
  if (!isAuthenticated()) {
    redirect('/login');
    return true;
  }
  return false;
};
