import { RESET } from '../actions';

export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case RESET:
    case RESET.FULFILLED:
      newState = Object.assign({}, state, {
        ...action.payload.data.message,
      });
      break;
    case RESET.PENDING:
      newState = Object.assign({}, state, {
        isLoading: 1,
      });
      break;
    case RESET.REJECTED:
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
