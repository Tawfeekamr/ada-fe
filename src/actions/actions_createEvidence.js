import Api from '../utilities/api';

export const CREATE_EVIDENCE = {
  ROOT: 'CREATE_EVIDENCE',
  PENDING: 'CREATE_EVIDENCE_PENDING',
  REJECTED: 'CREATE_EVIDENCE_REJECTED',
  FULFILLED: 'CREATE_EVIDENCE_FULFILLED',
};

export function createEvidence(files, id) {
  return {
    type: CREATE_EVIDENCE.ROOT,
    payload: Api.createEvidence(files, id),
  };
}
