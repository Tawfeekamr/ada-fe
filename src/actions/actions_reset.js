import Api from '../utilities/api';

export const RESET = {
  ROOT: 'RESET',
  PENDING: 'RESET_PENDING',
  REJECTED: 'RESET_REJECTED',
  FULFILLED: 'RESET_FULFILLED',
};

export function resetPassword(data) {
  return { type: RESET.ROOT, payload: Api.resetPassword(data) };
}
