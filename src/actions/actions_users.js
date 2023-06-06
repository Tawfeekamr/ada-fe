import Api from '../utilities/api';

export const GET_USERS = {
  ROOT: 'GET_USERS',
  PENDING: 'GET_USERS_PENDING',
  REJECTED: 'GET_USERS_REJECTED',
  FULFILLED: 'GET_USERS_FULFILLED',
};

export function getUsers(qs) {
  return {
    type: GET_USERS.ROOT,
    payload: Api.getUsers(qs),
  };
}
