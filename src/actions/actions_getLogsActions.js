import Api from '../utilities/api';

export const GET_LOGS_ACTIONS = {
  ROOT: 'GET_LOGS_ACTIONS',
  PENDING: 'GET_LOGS_ACTIONS_PENDING',
  REJECTED: 'GET_LOGS_ACTIONS_REJECTED',
  FULFILLED: 'GET_LOGS_ACTIONS_FULFILLED',
};

export function getLogsActions() {
  return {
    type: GET_LOGS_ACTIONS.ROOT,
    payload: Api.getLogsActions(),
  };
}
