import { CREATE_EVIDENCE } from '../actions';

export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case CREATE_EVIDENCE:
    case CREATE_EVIDENCE.FULFILLED:
      newState = action.payload.data;
      break;

    case CREATE_EVIDENCE.REJECTED:
      newState =
        action.payload.response && action.payload.response.data
          ? action.payload.response.data.message
          : 'Please Check Your Internet Connection';
      break;
    default:
      newState = state;
  }
  return newState;
}
