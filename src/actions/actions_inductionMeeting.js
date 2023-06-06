import Api from '../utilities/api';

export const INDUCTION_MEETING = {
  ROOT: 'INDUCTION_MEETING',
  PENDING: 'INDUCTION_MEETING_PENDING',
  REJECTED: 'INDUCTION_MEETING_REJECTED',
  FULFILLED: 'INDUCTION_MEETING_FULFILLED',
};

export function setInductionMeeting(campaignId, entityId, data) {
  return {
    type: INDUCTION_MEETING.ROOT,
    payload: Api.setInductionMeeting(campaignId, entityId, data),
  };
}
