import Api from '../utilities/api';

export const FORGOT_PASSWORD = {
  ROOT: 'FORGOT_PASSWORD',
  PENDING: 'FORGOT_PASSWORD_PENDING',
  REJECTED: 'FORGOT_PASSWORD_REJECTED',
  FULFILLED: 'FORGOT_PASSWORD_FULFILLED',
};

export function forgotPassword(data) {
  return { type: FORGOT_PASSWORD.ROOT, payload: Api.forgotPassword(data) };
}
