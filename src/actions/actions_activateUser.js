import Api from '../utilities/api';

export const DEACTIVATE_USER = {
  ROOT: 'DEACTIVATE_USER',
  PENDING: 'DEACTIVATE_USER_PENDING',
  REJECTED: 'DEACTIVATE_USER_REJECTED',
  FULFILLED: 'DEACTIVATE_USER_FULFILLED',
};

export const ACTIVATE_USER = {
  ROOT: 'ACTIVATE_USER',
  PENDING: 'ACTIVATE_USER_PENDING',
  REJECTED: 'ACTIVATE_USER_REJECTED',
  FULFILLED: 'ACTIVATE_USER_FULFILLED',
};

export function deactivateUser(id) {
  return {
    type: DEACTIVATE_USER.ROOT,
    payload: Api.deactivateUser(id),
  };
}

export function activateUser(id) {
  return {
    type: ACTIVATE_USER.ROOT,
    payload: Api.activateUser(id),
  };
}
