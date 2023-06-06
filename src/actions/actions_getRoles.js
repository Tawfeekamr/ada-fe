import Api from '../utilities/api';

export const GET_ROLES = {
  ROOT: 'GET_ROLES',
  PENDING: 'GET_ROLES_PENDING',
  REJECTED: 'GET_ROLES_REJECTED',
  FULFILLED: 'GET_ROLES_FULFILLED',
};

export function getRoles(params = {}, headers) {
  return {
    type: GET_ROLES.ROOT,
    payload: Api.getRoles(params, headers),
  };
}
