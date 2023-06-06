import { NEW_ENTITY } from '../actions';

export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case NEW_ENTITY:
    case NEW_ENTITY.FULFILLED:
      newState = action.payload.data;
      break;

    case NEW_ENTITY.REJECTED:
      newState = action.payload.response.data;
      break;
    default:
      newState = state;
  }
  return newState;
}
