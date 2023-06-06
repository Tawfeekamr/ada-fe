import Api from '../utilities/api';

export const GET_CAMPAIGNS = {
  ROOT: 'GET_CAMPAIGNS',
  PENDING: 'GET_CAMPAIGNS_PENDING',
  REJECTED: 'GET_CAMPAIGNS_REJECTED',
  FULFILLED: 'GET_CAMPAIGNS_FULFILLED',
};

export function getCampaigns(qs) {
  return {
    type: GET_CAMPAIGNS.ROOT,
    payload: Api.getCampaigns(qs),
  };
}
