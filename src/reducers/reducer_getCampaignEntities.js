import { GET_CAMPAIGN_ENTITIES } from '../actions';

function addData(state, payload) {
  const { entities } = payload.data;
  const list = {
    ar: [{}],
    en: [{}],
  };
  const entitiesData = entities.length ? entities : entities.data;

  if (entitiesData) {
    entitiesData.forEach((item, index) => {
      list.ar[index] = {
        value: item.id,
        label: item.translations[0].name,
      };
      list.en[index] = {
        value: item.id,
        label: item.translations[1].name,
      };
    });
  }

  return {
    list,
    entitiesForCampaign: {
      id: entities.length > 0 ? entities[0].pivot.campaign_id : 0,
      data: entities,
    },
    isFetching: false,
  };
}

export default function(
  state = {
    isFetching: false,
  },
  action
) {
  let newState;
  switch (action.type) {
    case GET_CAMPAIGN_ENTITIES.ROOT:
    case GET_CAMPAIGN_ENTITIES.FULFILLED:
      newState = addData(state, action.payload);
      break;
    case GET_CAMPAIGN_ENTITIES.PENDING:
      newState = {
        isFetching: true,
      };
      break;
    default:
      newState = state;
  }

  return newState;
}
