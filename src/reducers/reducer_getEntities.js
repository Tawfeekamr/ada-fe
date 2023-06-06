import { GET_ENTITIES } from '../actions';

function addData(state, payload) {
  const { entities } = payload.data;
  return {
    totalPages: entities.last_page,
    currentPage: entities.current_page,
    data: entities.data,
    total: entities.total,
  };
}

export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case GET_ENTITIES.FULFILLED:
      newState = addData(state, action.payload);
      break;
    default:
      newState = state;
  }

  return newState;
}
