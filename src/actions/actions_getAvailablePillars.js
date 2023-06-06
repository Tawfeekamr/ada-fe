import Api from '../utilities/api';

export const GET_CAMPAIGN_PILLARS = {
  ROOT: 'GET_CAMPAIGN_PILLARS',
  PENDING: 'GET_CAMPAIGN_PILLARS_PENDING',
  REJECTED: 'GET_CAMPAIGN_PILLARS_REJECTED',
  FULFILLED: 'GET_CAMPAIGN_PILLARS_FULFILLED',
};

export function getAvailablePillars(campaignID) {
  return {
    type: GET_CAMPAIGN_PILLARS.ROOT,
    payload: Api.getCampaignPillars(campaignID),
  };
}
