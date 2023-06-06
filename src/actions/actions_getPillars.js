import Api from '../utilities/api';

export const GET_PILLARS = {
  ROOT: 'GET_PILLARS',
  PENDING: 'GET_PILLARS_PENDING',
  REJECTED: 'GET_PILLARS_REJECTED',
  FULFILLED: 'GET_PILLARS_FULFILLED',
};

export function getPillars(assessmentID) {
  return {
    type: GET_PILLARS.ROOT,
    payload: Api.getPillars(assessmentID),
  };
}
