import Api from '../utilities/api';

export const EDIT_ENTITY = {
  ROOT: 'EDIT_ENTITY',
  PENDING: 'EDIT_ENTITY_PENDING',
  REJECTED: 'EDIT_ENTITY_REJECTED',
  FULFILLED: 'EDIT_ENTITY_FULFILLED',
};

export function editEntity(id, data) {
  return { type: EDIT_ENTITY.ROOT, payload: Api.editEntity(id, data) };
}
