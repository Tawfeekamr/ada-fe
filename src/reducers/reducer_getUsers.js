import { GET_USERS } from '../actions';

function addData(state, payload) {
  const { users } = payload.data;
  return {
    totalPages: users.last_page,
    currentPage: users.current_page,
    data: users.data,
    total: users.total,
  };
}

export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case GET_USERS.ROOT:
    case GET_USERS.FULFILLED:
      newState = addData(state, action.payload);
      break;
    default:
      newState = state;
  }

  return newState;
}
