import { EDIT_ASSESSMENT } from '../actions';

export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case EDIT_ASSESSMENT:
    case EDIT_ASSESSMENT.FULFILLED:
      newState = action.payload.data;
      break;

    case EDIT_ASSESSMENT.REJECTED:
      newState = action.payload.response.data.message;
      break;
    default:
      newState = state;
  }
  return newState;
}
