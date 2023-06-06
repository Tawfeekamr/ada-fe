import { INVITE_USER } from '../actions';

export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case INVITE_USER:
    case INVITE_USER.FULFILLED:
      newState = { ...action.payload.data, isLoading: false };
      break;
    case INVITE_USER.PENDING:
      newState = { ...state, isLoading: true };
      break;
    case INVITE_USER.REJECTED:
      newState = { ...action.payload.response.data, isLoading: false };
      break;
    default:
      newState = state;
  }
  return newState;
}
