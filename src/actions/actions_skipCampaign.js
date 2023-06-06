import Api from '../utilities/api';

export const SKIP_CAMPAIGN = {
  ROOT: 'SKIP_CAMPAIGN',
  PENDING: 'SKIP_CAMPAIGN_PENDING',
  REJECTED: 'SKIP_CAMPAIGN_REJECTED',
  FULFILLED: 'SKIP_CAMPAIGN_FULFILLED',
};

export function skipCampaign(campaignId, assessmentID, reason) {
  return {
    type: SKIP_CAMPAIGN.ROOT,
    payload: Api.skipCampaign(campaignId, assessmentID, reason),
  };
}
