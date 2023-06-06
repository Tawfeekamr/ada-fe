import Api from '../utilities/api';

export const DELETE_ENTITY = {
  ROOT: 'DELETE_ENTITY',
  PENDING: 'DELETE_ENTITY_PENDING',
  REJECTED: 'DELETE_ENTITY_REJECTED',
  FULFILLED: 'DELETE_ENTITY_FULFILLED',
};

export function deleteEntity(id) {
  return { type: DELETE_ENTITY.ROOT, payload: Api.deleteEntity(id) };
}
