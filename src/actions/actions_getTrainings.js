import Api from '../utilities/api';

export const GET_TRAININGS = {
  ROOT: 'GET_TRAININGS',
  PENDING: 'GET_TRAININGS_PENDING',
  REJECTED: 'GET_TRAININGS_REJECTED',
  FULFILLED: 'GET_TRAININGS_FULFILLED',
};

export function getTrainings(entityId, qs) {
  return {
    type: GET_TRAININGS.ROOT,
    payload: Api.getTrainings(entityId, qs),
  };
}
