import Api from '../utilities/api';

export const GET_ASSESSMENT = {
  ROOT: 'GET_ASSESSMENT',
  PENDING: 'GET_ASSESSMENT_PENDING',
  REJECTED: 'GET_ASSESSMENT_REJECTED',
  FULFILLED: 'GET_ASSESSMENT_FULFILLED',
};

export function getAssessmentData() {
  return {
    type: GET_ASSESSMENT.ROOT,
    payload: Api.getAssessmentData(),
  };
}

export function getAssessmentDetails(id) {
  return {
    type: GET_ASSESSMENT.ROOT,
    payload: Api.getAssessmentDetails(id),
  };
}

export function getAssessmentDataByParams(entityId, campaignId, assessmentId) {
  return {
    type: GET_ASSESSMENT.ROOT,
    payload: Api.getAssessmentDataByParams(entityId, campaignId, assessmentId),
  };
}
