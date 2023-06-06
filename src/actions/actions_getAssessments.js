import Api from '../utilities/api';

export const GET_ASSESSMENTS = {
  ROOT: 'GET_ASSESSMENTS',
  PENDING: 'GET_ASSESSMENTS_PENDING',
  REJECTED: 'GET_ASSESSMENTS_REJECTED',
  FULFILLED: 'GET_ASSESSMENTS_FULFILLED',
};

export const GET_EC_ACTIVE_ASSESSMENTS = {
  ROOT: 'GET_EC_ACTIVE_ASSESSMENTS',
  PENDING: 'GET_EC_ACTIVE_ASSESSMENTS_PENDING',
  REJECTED: 'GET_EC_ACTIVE_ASSESSMENTS_REJECTED',
  FULFILLED: 'GET_EC_ACTIVE_ASSESSMENTS_FULFILLED',
};
export const GET_EC_INACTIVE_ASSESSMENTS = {
  ROOT: 'GET_EC_INACTIVE_ASSESSMENTS',
  PENDING: 'GET_EC_INACTIVE_ASSESSMENTS_PENDING',
  REJECTED: 'GET_EC_INACTIVE_ASSESSMENTS_REJECTED',
  FULFILLED: 'GET_EC_INACTIVE_ASSESSMENTS_FULFILLED',
};
export function getAssessments(qs) {
  return {
    type: GET_ASSESSMENTS.ROOT,
    payload: Api.getAssessments(qs),
  };
}
export function getEcAssessments(active, query) {
  return {
    type: active
      ? GET_EC_ACTIVE_ASSESSMENTS.ROOT
      : GET_EC_INACTIVE_ASSESSMENTS.ROOT,
    payload: Api.getECAssessments(active, query),
  };
}
