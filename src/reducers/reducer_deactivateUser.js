import { DEACTIVATE_USER } from '../actions';

export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case DEACTIVATE_USER:
    case DEACTIVATE_USER.FULFILLED:
      newState = action.payload.message;
      break;

    case DEACTIVATE_USER.REJECTED:
      newState = action.payload.response;
      break;
    default:
      newState = state;
  }
  return newState;
}
