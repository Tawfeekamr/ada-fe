import Api from '../utilities/api';

export const GET_ENTITIES_NO_ADVISOR = {
  ROOT: 'GET_ENTITIES_NO_ADVISOR',
  PENDING: 'GET_ENTITIES_NO_ADVISOR_PENDING',
  REJECTED: 'GET_ENTITIES_NO_ADVISOR_REJECTED',
  FULFILLED: 'GET_ENTITIES_NO_ADVISOR_FULFILLED',
};

export function getEntitiesNoAdvisor() {
  const query = {
    paginate: false,
    'filters[0][field]': 'advisor_id',
    'filters[0][value]': 'NULL',
    'filters[0][operator]': '=',
  };
  return {
    type: GET_ENTITIES_NO_ADVISOR.ROOT,
    payload: Api.getEntities(query),
  };
}

export const GET_ENTITIES = {
  ROOT: 'GET_ENTITIES',
  PENDING: 'GET_ENTITIES_PENDING',
  REJECTED: 'GET_ENTITIES_REJECTED',
  FULFILLED: 'GET_ENTITIES_FULFILLED',
};

export function getEntities(query) {
  return {
    type: GET_ENTITIES.ROOT,
    payload: Api.getEntities(query),
  };
}
