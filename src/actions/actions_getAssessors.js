import Api from '../utilities/api';

export const GET_ASSESSORS = {
  ROOT: 'GET_ASSESSORS',
  PENDING: 'GET_ASSESSORS_PENDING',
  REJECTED: 'GET_ASSESSORS_REJECTED',
  FULFILLED: 'GET_ASSESSORS_FULFILLED',
};

export function getAssessors() {
  return {
    type: GET_ASSESSORS.ROOT,
    payload: Api.getAssessors(),
  };
}
export function getEntityUsers() {
  return {
    type: GET_ASSESSORS.ROOT,
    payload: Api.getUsers(),
  };
}
