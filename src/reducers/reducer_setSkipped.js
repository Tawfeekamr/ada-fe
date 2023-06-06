import { SET_SKIPPED } from '../actions';

export default function(state = false, action) {
  let newState;
  switch (action.type) {
    case SET_SKIPPED.ROOT:
      newState = action.payload;
      break;
    default:
      newState = state;
  }
  return newState;
}
