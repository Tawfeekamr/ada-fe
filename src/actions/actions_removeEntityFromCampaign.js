import Api from '../utilities/api';

export const REMOVE_ENTITY_FROM_CAMPAIGN = {
  ROOT: 'REMOVE_ENTITY_FROM_CAMPAIGN',
  PENDING: 'REMOVE_ENTITY_FROM_CAMPAIGN_PENDING',
  REJECTED: 'REMOVE_ENTITY_FROM_CAMPAIGN_REJECTED',
  FULFILLED: 'REMOVE_ENTITY_FROM_CAMPAIGN_FULFILLED',
};

export function removeEntityFromCampaign(campaignId, entityId) {
  return {
    type: REMOVE_ENTITY_FROM_CAMPAIGN.ROOT,
    payload: Api.removeEntityFromCampaign(campaignId, entityId),
  };
}
