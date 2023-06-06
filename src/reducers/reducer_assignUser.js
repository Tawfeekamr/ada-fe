import { ASSIGN_USER, DEASSIGN_USER } from '../actions';

export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case ASSIGN_USER:
    case ASSIGN_USER.FULFILLED:
      newState = action.payload.data;
      break;

    case ASSIGN_USER.REJECTED:
      newState = action.payload.response.data;
      break;
    default:
      newState = state;
  }
  return newState;
}

export function deassignUser(
  state = {
    loading: false,
  },
  action
) {
  let newState;
  switch (action.type) {
    case DEASSIGN_USER.PENDING:
      newState = Object.assign({}, state, {
        loading: true,
      });
      break;
    case DEASSIGN_USER.ROOT:
    case DEASSIGN_USER.FULFILLED:
      newState = Object.assign({}, state, {
        loading: false,
        ...action.payload,
      });
      break;
    default:
      newState = state;
  }
  return newState;
}
