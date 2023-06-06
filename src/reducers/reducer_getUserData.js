import { GET_USER_DATA, LOGIN_USER } from '../actions';

const getUserData = (state, action) => {
  return { ...state, ...action.payload.data };
};

const setUserData = (state, action) => {
  return { ...state, ...action.payload };
};

export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case LOGIN_USER.FULFILLED:
      newState = { ...action.payload.data.user_details };
      break;
    case GET_USER_DATA:
    case GET_USER_DATA.FULFILLED:
      newState = getUserData(state, action);
      break;
    case GET_USER_DATA.SET:
      newState = setUserData(state, action);
      break;
    case GET_USER_DATA.REJECTED:
      newState = Object.assign({}, state, {
        isFetching: false,
        // error: action.payload.response.data.message,
      });
      break;
    default:
      newState = state;
  }
  return newState;
}
