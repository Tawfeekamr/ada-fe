import { CREATE_ASSESSMENT } from '../actions';

export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case CREATE_ASSESSMENT:
    case CREATE_ASSESSMENT.FULFILLED:
      newState = action.payload.data;
      break;

    case CREATE_ASSESSMENT.REJECTED:
      newState = action.payload.response.data.message;
      break;
    default:
      newState = state;
  }
  return newState;
}
