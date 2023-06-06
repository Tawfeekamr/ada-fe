import { SELF_ASSESSMENT_END_DATE } from '../actions';

export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case SELF_ASSESSMENT_END_DATE:
    case SELF_ASSESSMENT_END_DATE.FULFILLED:
      newState = action.payload.data;
      break;

    case SELF_ASSESSMENT_END_DATE.REJECTED:
      newState = action.payload.response.data;
      break;
    default:
      newState = state;
  }
  return newState;
}
