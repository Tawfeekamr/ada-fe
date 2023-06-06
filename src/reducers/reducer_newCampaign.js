import {
  CONFIGURE_CAMPAIGN,
  ASSIGN_ASSESSORS,
  CAMPAIGN_ENTITIES,
  ASSIGN_ENTITIES_CAMPAIGN,
} from '../actions';

function addEntitiesData(state, payload) {
  const { entities } = payload.data;
  if (entities.data.length > 0) {
    /* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["entity"] }] */
    entities.data.forEach(entity => {
      entity.nameTranslations = {};
      entity.nameTranslations.ar = entity.translations[0].name;
      entity.nameTranslations.en = entity.translations[1].name;
    });
  }
  return {
    totalPages: entities.last_page,
    currentPage: entities.current_page,
    data: entities.data,
    isLoading: false,
  };
}

export default function configureCampaign(state = {}, action) {
  let newState;
  switch (action.type) {
    case CONFIGURE_CAMPAIGN:
    case CONFIGURE_CAMPAIGN.FULFILLED:
      newState = action.payload.data;
      break;
    case CONFIGURE_CAMPAIGN.REJECTED:
      newState = action.payload.response.data;
      break;
    default:
      newState = state;
  }
  return newState;
}
export function assignEntitiesForCampaign(state = {}, action) {
  let newState;
  switch (action.type) {
    case ASSIGN_ENTITIES_CAMPAIGN:
    case ASSIGN_ENTITIES_CAMPAIGN.FULFILLED:
      newState = action.payload.data;
      break;
    case ASSIGN_ENTITIES_CAMPAIGN.REJECTED:
      newState = action.payload.response.data;
      break;
    default:
      newState = state;
  }
  return newState;
}

export function getEntitiesCampaign(
  state = {
    isLoading: false,
  },
  action
) {
  let newState;
  switch (action.type) {
    case CAMPAIGN_ENTITIES:
    case CAMPAIGN_ENTITIES.FULFILLED:
      newState = addEntitiesData(state, action.payload);
      break;
    case CAMPAIGN_ENTITIES.PENDING:
      newState = {
        isLoading: true,
      };
      break;
    case CAMPAIGN_ENTITIES.REJECTED:
      newState = action.payload.response.data.message;
      break;
    default:
      newState = state;
  }
  return newState;
}
export function assignAssessors(state = {}, action) {
  let newState;
  switch (action.type) {
    case ASSIGN_ASSESSORS:
    case ASSIGN_ASSESSORS.FULFILLED:
      newState = action.payload.data;
      break;
    case ASSIGN_ASSESSORS.REJECTED:
      newState = action.payload.response.data.message;
      break;
    default:
      newState = state;
  }
  return newState;
}
