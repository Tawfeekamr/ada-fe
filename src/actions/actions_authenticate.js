export const AUTHENTICATE = {
  ROOT: 'AUTHENTICATE',
  PENDING: 'AUTHENTICATE_PENDING',
  REJECTED: 'AUTHENTICATE_REJECTED',
  FULFILLED: 'AUTHENTICATE_FULFILLED',
};

export function setAuthenticated(value) {
  return {
    type: AUTHENTICATE.ROOT,
    payload: value,
  };
}
