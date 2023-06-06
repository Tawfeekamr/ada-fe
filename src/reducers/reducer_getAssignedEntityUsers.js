import { GET_ASSIGNED_ENTITY_USERS } from '../actions';

function addData(state, payload) {
  const { entityUsers } = payload.data;
  return entityUsers;
}

export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case GET_ASSIGNED_ENTITY_USERS.ROOT:
    case GET_ASSIGNED_ENTITY_USERS.FULFILLED:
      newState = addData(state, action.payload);
      break;
    default:
      newState = state;
  }

  return newState;
}
