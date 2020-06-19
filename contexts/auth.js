/* eslint-disable react/prop-types */
import React, { createContext, useState } from 'react';
import {
  isAuthenticated,
  setLocalStorage,
  getLocaleStorage,
  removeLocaleStorage,
} from '../lib/session';

export const AuthContext = createContext();

const Provider = ({ children }) => {
  const [userLoaded, setUserLoaded] = useState(() => isAuthenticated());
  const [user, setUser] = useState(() => getLocaleStorage('user'));
  const value = {
    userLoaded,
    user,
    activateAuth: (authUser, token) => {
      setUser(authUser);
      setUserLoaded(true);
      setLocalStorage('user', authUser);
      setLocalStorage('idToken', token);
    },
    removeAuth: () => {
      setUserLoaded(false);
      setUser(null);
      removeLocaleStorage('user');
      removeLocaleStorage('idToken');
    },
    updateUser: (newUserData) => {
      setLocalStorage('user', newUserData);
    },
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default { Provider, Consumer: AuthContext.Consumer };
