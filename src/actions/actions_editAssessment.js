import Api from '../utilities/api';

export const EDIT_ASSESSMENT = {
  ROOT: 'EDIT_ASSESSMENT',
  PENDING: 'EDIT_ASSESSMENT_PENDING',
  REJECTED: 'EDIT_ASSESSMENT_REJECTED',
  FULFILLED: 'EDIT_ASSESSMENT_FULFILLED',
};

export function editAssessment(id, data) {
  return {
    type: EDIT_ASSESSMENT.ROOT,
    payload: Api.editAssessment(id, data),
  };
}
