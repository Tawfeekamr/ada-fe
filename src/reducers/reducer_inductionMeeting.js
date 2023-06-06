import { INDUCTION_MEETING } from '../actions';

export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case INDUCTION_MEETING:
    case INDUCTION_MEETING.FULFILLED:
      newState = action.payload.data;
      break;

    case INDUCTION_MEETING.REJECTED:
      newState = action.payload.response.data;
      break;
    default:
      newState = state;
  }
  return newState;
}
