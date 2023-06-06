import { GET_CAMPAIGNS } from '../actions';

function addData(state, payload) {
  const { campaigns } = payload.data;
  return {
    totalPages: campaigns.last_page,
    currentPage: campaigns.current_page,
    data: campaigns.data,
    total: campaigns.total,
  };
}

export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case GET_CAMPAIGNS.ROOT:
    case GET_CAMPAIGNS.FULFILLED:
      newState = addData(state, action.payload);
      break;
    default:
      newState = state;
  }

  return newState;
}
