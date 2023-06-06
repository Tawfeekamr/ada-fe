import { GET_CAMPAIGN_ACTIVE, GET_CAMPAIGN_INACTIVE } from '../actions';

function addCampaigns(state, payload) {
  const { campaigns } = payload.data;
  const list = {
    ar: [{}],
    en: [{}],
  };
  const campaignsData = campaigns.length ? campaigns : campaigns.data;
  if (campaignsData) {
    campaignsData.forEach((item, index) => {
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
    totalPages: campaigns.last_page,
    currentPage: campaigns.current_page,
    total: campaigns.total,
    data: campaigns.data,
    assessmentID:
      campaigns.data.length > 0 ? campaigns.data[0].assessment_id : 0,
    isFetching: false,
  };
}

function addInActiveCampaigns(state, payload) {
  const { campaigns } = payload.data;
  return {
    totalPages: campaigns.last_page,
    currentPage: campaigns.current_page,
    data: campaigns.data,
    total: campaigns.total,
    isFetching: false,
  };
}

export default function(
  state = {
    isFetching: false,
    //  list: {},
  },
  action
) {
  let newState;
  switch (action.type) {
    case GET_CAMPAIGN_ACTIVE.ROOT:
    case GET_CAMPAIGN_ACTIVE.FULFILLED:
      newState = addCampaigns(state, action.payload);
      break;
    case GET_CAMPAIGN_ACTIVE.PENDING:
      newState = {
        isFetching: true,
      };
      break;
    default:
      newState = state;
  }

  return newState;
}

export function inactiveCampaigns(
  state = {
    isFetching: false,
  },
  action
) {
  let newState;
  switch (action.type) {
    case GET_CAMPAIGN_INACTIVE.ROOT:
    case GET_CAMPAIGN_INACTIVE.FULFILLED:
      newState = addInActiveCampaigns(state, action.payload);
      break;
    case GET_CAMPAIGN_INACTIVE.PENDING:
      newState = {
        isFetching: true,
      };
      break;
    default:
      newState = state;
  }

  return newState;
}
