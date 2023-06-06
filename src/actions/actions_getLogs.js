import Api from '../utilities/api';

export const GET_LOGS = {
  ROOT: 'GET_LOGS',
  PENDING: 'GET_LOGS_PENDING',
  REJECTED: 'GET_LOGS_REJECTED',
  FULFILLED: 'GET_LOGS_FULFILLED',
};

export function getLogs(qs) {
  return {
    type: GET_LOGS.ROOT,
    payload: Api.getLogs(qs),
  };
}
