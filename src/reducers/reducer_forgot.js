import { FORGOT_PASSWORD } from '../actions';

export default function(
  state = {
    isFetching: false,
  },
  action
) {
  let newState;
  switch (action.type) {
    case FORGOT_PASSWORD:
    case FORGOT_PASSWORD.FULFILLED:
      newState = Object.assign({}, state, {
        ...action.payload.message,
      });

      break;
    case FORGOT_PASSWORD.PENDING:
      newState = Object.assign({}, state, {});
      break;
    case FORGOT_PASSWORD.REJECTED:
      newState = Object.assign({}, state, {
        error: action.payload.response.data.message,
      });
      break;
    default:
      newState = state;
  }
  return newState;
}
