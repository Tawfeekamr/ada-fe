import Api from '../utilities/api';

export const ASSIGN_ENTITIES_CAMPAIGN = {
  ROOT: 'ASSIGN_ENTITIES_CAMPAIGN',
  PENDING: 'ASSIGN_ENTITIES_CAMPAIGN_PENDING',
  REJECTED: 'ASSIGN_ENTITIES_CAMPAIGN_REJECTED',
  FULFILLED: 'ASSIGN_ENTITIES_CAMPAIGN_FULFILLED',
};

export function setCampaignEntities(campaignID, body) {
  return {
    type: ASSIGN_ENTITIES_CAMPAIGN.ROOT,
    payload: Api.assignEntitiesToCampaign(campaignID, body),
  };
}
export const CONFIGURE_CAMPAIGN = {
  ROOT: 'CONFIGURE_CAMPAIGN',
  PENDING: 'CONFIGURE_CAMPAIGN_PENDING',
  REJECTED: 'CONFIGURE_CAMPAIGN_REJECTED',
  FULFILLED: 'CONFIGURE_CAMPAIGN_FULFILLED',
};
export function setCampaignConfiguration(data) {
  return {
    type: CONFIGURE_CAMPAIGN.ROOT,
    payload: Api.setCampaignConfiguration(data),
  };
}
export const ASSIGN_ASSESSORS = {
  ROOT: 'ASSIGN_ASSESSORS',
  PENDING: 'ASSIGN_ASSESSORS_PENDING',
  REJECTED: 'ASSIGN_ASSESSORS_REJECTED',
  FULFILLED: 'ASSIGN_ASSESSORS_FULFILLED',
};
export function submitCampaignAssessors(id, data) {
  return {
    type: ASSIGN_ASSESSORS.ROOT,
    payload: Api.submitCampaignAssessors(id, data),
  };
}

export const CAMPAIGN_ENTITIES = {
  ROOT: 'CAMPAIGN_ENTITIES',
  PENDING: 'CAMPAIGN_ENTITIES_PENDING',
  REJECTED: 'CAMPAIGN_ENTITIES_REJECTED',
  FULFILLED: 'CAMPAIGN_ENTITIES_FULFILLED',
};
export function getCampaignsEntities(qs) {
  return {
    type: CAMPAIGN_ENTITIES.ROOT,
    payload: Api.getCampaignEntities(qs),
  };
}
