import { GET_USER_DATA, LOGIN_USER } from "../actions";

export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case LOGIN_USER.FULFILLED:
    case GET_USER_DATA.FULFILLED:
      newState = true;
      break;
    case LOGIN_USER.REJECTED:
    case GET_USER_DATA.REJECTED:
      newState = false;
      break;
    // case AUTHENTICATE.ROOT:
    //   newState = action.payload;
    //   break;
    default:
      newState = state;
  }
  return newState;
}
