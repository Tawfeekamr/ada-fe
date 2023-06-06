import Api from '../utilities/api';

export const ASSIGN_USER = {
  ROOT: 'ASSIGN_USER',
  PENDING: 'ASSIGN_USER_PENDING',
  REJECTED: 'ASSIGN_USER_REJECTED',
  FULFILLED: 'ASSIGN_USER_FULFILLED',
};
export const DEASSIGN_USER = {
  ROOT: 'DEASSIGN_USER',
  PENDING: 'DEASSIGN_USER_PENDING',
  REJECTED: 'DEASSIGN_USER_REJECTED',
  FULFILLED: 'DEASSIGN_USER_FULFILLED',
};

export function assignUser(id, data) {
  return { type: ASSIGN_USER.ROOT, payload: Api.assignUser(id, data) };
}

export function deassignUser(id, data) {
  return { type: DEASSIGN_USER.ROOT, payload: Api.deassignUser(id, data) };
}
