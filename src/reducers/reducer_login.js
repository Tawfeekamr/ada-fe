import { LOGIN_USER } from '../actions';

export default function(
  state = {
    isFetching: false,
    authenticated: false,
  },
  action
) {
  let newState;
  switch (action.type) {
    case LOGIN_USER:
    case LOGIN_USER.FULFILLED:
      newState = Object.assign({}, state, {
        authenticated: !!action.payload.data,
        ...action.payload.data,
      });

      break;
    case LOGIN_USER.PENDING:
      newState = Object.assign({}, state, {
        authenticated: false,
      });
      break;
    case LOGIN_USER.REJECTED:
      newState = Object.assign({}, state, {
        authenticated: false,
        error: action.payload.response.data.message,
      });
      break;
    default:
      newState = state;
  }
  return newState;
}
