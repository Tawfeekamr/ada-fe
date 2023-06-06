import Api from '../utilities/api';

export const CHECK_RESET_TOKEN = {
  ROOT: 'CHECK_RESET_TOKEN',
  PENDING: 'CHECK_RESET_TOKEN_PENDING',
  REJECTED: 'CHECK_RESET_TOKEN_REJECTED',
  FULFILLED: 'CHECK_RESET_TOKEN_FULFILLED',
};

export function checkResetTokenValidity(data) {
  return {
    type: CHECK_RESET_TOKEN.ROOT,
    payload: Api.checkResetTokenValidity(data),
  };
}
