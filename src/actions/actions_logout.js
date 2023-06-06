import Api from '../utilities/api';

export const LOGOUT_USER = {
  ROOT: 'LOGOUT_USER',
  PENDING: 'LOGOUT_USER_PENDING',
  REJECTED: 'LOGOUT_USER_REJECTED',
  FULFILLED: 'LOGOUT_USER_FULFILLED',
};

export function logoutUser() {
  return { type: LOGOUT_USER.ROOT, payload: Api.logout() };
}
