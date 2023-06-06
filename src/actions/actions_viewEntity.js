import Api from '../utilities/api';

export const VIEW_ENTITY = {
  ROOT: 'VIEW_ENTITY',
  PENDING: 'VIEW_ENTITY_PENDING',
  REJECTED: 'VIEW_ENTITY_REJECTED',
  FULFILLED: 'VIEW_ENTITY_FULFILLED',
};

export function viewEntity(id) {
  return { type: VIEW_ENTITY.ROOT, payload: Api.viewEntity(id) };
}
