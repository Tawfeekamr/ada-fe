import Api from '../utilities/api';

export const CREATE_ASSESSMENT = {
  ROOT: 'CREATE_ASSESSMENT',
  PENDING: 'CREATE_ASSESSMENT_PENDING',
  REJECTED: 'CREATE_ASSESSMENT_REJECTED',
  FULFILLED: 'CREATE_ASSESSMENT_FULFILLED',
};

export function createAssessment(data) {
  return {
    type: CREATE_ASSESSMENT.ROOT,
    payload: Api.createAssessment(data),
  };
}
