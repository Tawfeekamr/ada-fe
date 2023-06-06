import Api from '../utilities/api';

export const GET_ASSIGNED_ENTITY_USERS = {
  ROOT: 'GET_ASSIGNED_ENTITY_USERS',
  PENDING: 'GET_ASSIGNED_ENTITY_USERS_PENDING',
  REJECTED: 'GET_ASSIGNED_ENTITY_USERS_REJECTED',
  FULFILLED: 'GET_ASSIGNED_ENTITY_USERS_FULFILLED',
};

export function getECAssignedUsers(id) {
  return {
    type: GET_ASSIGNED_ENTITY_USERS.ROOT,
    payload: Api.getECEntityUsers(id),
  };
}
