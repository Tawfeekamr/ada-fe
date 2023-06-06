import Api from '../utilities/api';

export const NEW_ENTITY = {
  ROOT: 'NEW_ENTITY',
  PENDING: 'NEW_ENTITY_PENDING',
  REJECTED: 'NEW_ENTITY_REJECTED',
  FULFILLED: 'NEW_ENTITY_FULFILLED',
};

export function createEntity(data) {
  return { type: NEW_ENTITY.ROOT, payload: Api.createEntity(data) };
}
