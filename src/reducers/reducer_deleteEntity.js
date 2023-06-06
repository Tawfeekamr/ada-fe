import { DELETE_ENTITY } from '../actions';

export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case DELETE_ENTITY:
    case DELETE_ENTITY.FULFILLED:
      newState = action.payload.data;
      break;

    case DELETE_ENTITY.REJECTED:
      newState = action.payload.response.data.message;
      break;
    default:
      newState = state;
  }
  return newState;
}
