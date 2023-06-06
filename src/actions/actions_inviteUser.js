import Api from '../utilities/api';

export const INVITE_USER = {
  ROOT: 'INVITE_USER',
  PENDING: 'INVITE_USER_PENDING',
  REJECTED: 'INVITE_USER_REJECTED',
  FULFILLED: 'INVITE_USER_FULFILLED',
};

export function inviteUser(data) {
  return { type: INVITE_USER.ROOT, payload: Api.inviteUser(data) };
}
