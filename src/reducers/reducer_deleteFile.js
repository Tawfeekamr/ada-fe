import { DELETE_FILE } from '../actions';

export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case DELETE_FILE:
    case DELETE_FILE.FULFILLED:
      newState = action.payload.data;
      break;

    case DELETE_FILE.REJECTED:
      newState = action.payload.response.data.message;
      break;
    default:
      newState = state;
  }
  return newState;
}
