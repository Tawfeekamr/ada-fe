import { LOGOUT_USER } from '../actions';

export default function(
  state = {
    isFetching: false,
    authenticated: false,
  },
  action
) {
  let newState;
  switch (action.type) {
    case LOGOUT_USER:
    case LOGOUT_USER.FULFILLED:
      newState = Object.assign({}, state, {
        authenticated: false,
      });

      break;
    case LOGOUT_USER.PENDING:
      newState = Object.assign({}, state, {
        authenticated: false,
      });
      break;
    case LOGOUT_USER.REJECTED:
      newState = Object.assign({}, state, {
        authenticated: false,
      });
      break;
    default:
      newState = state;
  }
  return newState;
}
