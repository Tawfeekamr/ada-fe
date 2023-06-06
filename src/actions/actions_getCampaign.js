import Api from '../utilities/api';

export const GET_CAMPAIGN = {
  ROOT: 'GET_CAMPAIGN',
  PENDING: 'GET_CAMPAIGN_PENDING',
  REJECTED: 'GET_CAMPAIGN_REJECTED',
  FULFILLED: 'GET_CAMPAIGN_FULFILLED',
};

export function getCampaignData(id) {
  return {
    type: GET_CAMPAIGN.ROOT,
    payload: Api.getCampaignData(id),
  };
}
