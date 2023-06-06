import { GET_TRAININGS } from '../actions';

function addData(state, payload) {
  const { trainings } = payload.data;
  return {
    totalPages: trainings.last_page,
    currentPage: trainings.current_page,
    data: trainings.data,
    total: trainings.total,
  };
}

export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case GET_TRAININGS.ROOT:
    case GET_TRAININGS.FULFILLED:
      newState = addData(state, action.payload);
      break;
    default:
      newState = state;
  }

  return newState;
}
