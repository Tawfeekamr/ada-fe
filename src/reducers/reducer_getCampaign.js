import { GET_CAMPAIGN } from '../actions';

function getCampaign(state, payload) {
  const { campaign } = payload.data;

  return {
    isFetching: false,
    data: campaign,
  };
}

export default function(
  state = {
    isFetching: true,
  },
  action
) {
  let newState;
  switch (action.type) {
    case GET_CAMPAIGN.ROOT:
    case GET_CAMPAIGN.FULFILLED:
      newState = getCampaign(state, action.payload);
      break;
    case GET_CAMPAIGN.PENDING:
      newState = {
        isFetching: true,
      };
      break;
    case GET_CAMPAIGN.REJECTED:
      newState = {
        isFetching: false,
      };
      break;
    default:
      newState = state;
  }

  return newState;
}
