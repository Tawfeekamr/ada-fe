export const SET_CAMPAIGN_ENTITIES = {
  ROOT: 'SET_CAMPAIGN_ENTITIES',
};

export function setCampaignEntitiesList(data) {
  return { type: SET_CAMPAIGN_ENTITIES.ROOT, payload: data };
}
