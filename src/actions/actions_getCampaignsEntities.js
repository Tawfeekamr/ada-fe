import Api from '../utilities/api';

export const GET_CAMPAIGN_ENTITIES = {
  ROOT: 'GET_CAMPAIGN_ENTITIES',
  PENDING: 'GET_CAMPAIGN_ENTITIES_PENDING',
  REJECTED: 'GET_CAMPAIGN_ENTITIES_REJECTED',
  FULFILLED: 'GET_CAMPAIGN_ENTITIES_FULFILLED',
};

export function getActiveCampaignEntities(id) {
  return {
    type: GET_CAMPAIGN_ENTITIES.ROOT,
    payload: Api.getActiveCampaignsEntities(id),
  };
}
