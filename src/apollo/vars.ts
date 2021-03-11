import { makeVar } from "@apollo/client";
import { AUTH_TOKEN_NAME } from "../constants";

export const getTokenFromLS = () => localStorage.getItem(AUTH_TOKEN_NAME);
export const setTokenToLS = (token: string) =>
  localStorage.setItem(AUTH_TOKEN_NAME, token);
export const removeTokenFromLS = () => localStorage.removeItem(AUTH_TOKEN_NAME);
export const isLoggedInVar = makeVar(Boolean(getTokenFromLS()));
export const authTokenVar = makeVar(getTokenFromLS());
export const makeLogin = (token: string) => {
  setTokenToLS(token);
  isLoggedInVar(true);
  authTokenVar(token);
};
export const makeLogout = () => {
  removeTokenFromLS();
  isLoggedInVar(false);
  authTokenVar(null);
};

export const darkModeVar = makeVar(false);
