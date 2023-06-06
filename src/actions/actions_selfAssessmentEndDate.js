import Api from '../utilities/api';

export const SELF_ASSESSMENT_END_DATE = {
  ROOT: 'SELF_ASSESSMENT_END_DATE',
  PENDING: 'SELF_ASSESSMENT_END_DATE_PENDING',
  REJECTED: 'SELF_ASSESSMENT_END_DATE_REJECTED',
  FULFILLED: 'SELF_ASSESSMENT_END_DATE_FULFILLED',
};

export function setNewSelfAssessmentDate(campaignId, entityId, newDate) {
  return {
    type: SELF_ASSESSMENT_END_DATE.ROOT,
    payload: Api.setNewSelfAssessmentDate(campaignId, entityId, newDate),
  };
}
