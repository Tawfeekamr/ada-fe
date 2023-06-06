import { SKIP_CAMPAIGN } from '../actions';

export default function(
  state = {
    isFetching: false,
  },
  action
) {
  let newState;
  switch (action.type) {
    case SKIP_CAMPAIGN:
    case SKIP_CAMPAIGN.FULFILLED:
      newState = { isFetching: false, ...action.payload.data };
      break;
    case SKIP_CAMPAIGN.PENDING:
      newState = { isFetching: true };
      break;
    case SKIP_CAMPAIGN.REJECTED:
      newState = {
        isFetching: false,
        error: action.payload.response.data.message,
      };
      break;
    default:
      newState = state;
  }
  return newState;
}
