import { ACTIVATE_USER } from '../actions';

export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case ACTIVATE_USER:
    case ACTIVATE_USER.FULFILLED:
      newState = action.payload.message;
      break;

    case ACTIVATE_USER.REJECTED:
      newState = action.payload.response;
      break;
    default:
      newState = state;
  }
  return newState;
}
