import Api from '../utilities/api';

export const DELETE_FILE = {
  ROOT: 'DELETE_FILE',
  PENDING: 'DELETE_FILE_PENDING',
  REJECTED: 'DELETE_FILE_REJECTED',
  FULFILLED: 'DELETE_FILE_FULFILLED',
};

export function deleteFile(id) {
  return {
    type: DELETE_FILE.ROOT,
    payload: Api.deleteFile(id),
  };
}
