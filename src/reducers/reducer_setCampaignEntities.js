import { SET_CAMPAIGN_ENTITIES } from '../actions';

export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case SET_CAMPAIGN_ENTITIES.ROOT:
      newState = state;
      break;
    default:
      newState = state;
  }
  return newState;
}
