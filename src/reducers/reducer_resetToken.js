import { CHECK_RESET_TOKEN } from '../actions';

export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case CHECK_RESET_TOKEN:
    case CHECK_RESET_TOKEN.FULFILLED:
      newState = Object.assign({}, state, {
        ...action.payload.data.message,
      });
      break;
    case CHECK_RESET_TOKEN.PENDING:
      newState = Object.assign({}, state, {
        isLoading: 1,
      });
      break;
    case CHECK_RESET_TOKEN.REJECTED:
      newState = Object.assign({}, state, {
        error: action.payload.response
          ? action.payload.response.data.message
          : action.payload.message,
      });
      break;
    default:
      newState = state;
  }
  return newState;
}
