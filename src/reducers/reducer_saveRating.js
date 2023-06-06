import { SAVE_RATING } from '../actions';

export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case SAVE_RATING:
    case SAVE_RATING.FULFILLED:
      newState = action.payload.data;
      break;

    case SAVE_RATING.REJECTED:
      newState = action.payload.response.data;
      break;
    default:
      newState = state;
  }
  return newState;
}
