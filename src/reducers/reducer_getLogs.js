import { GET_LOGS } from '../actions';

function addData(state, payload) {
  const { logs } = payload.data;
  if (Object.prototype.hasOwnProperty.call(logs, 'data'))
    return {
      totalPages: logs.last_page,
      currentPage: logs.current_page,
      data: logs.data,
      total: logs.total,
      isFetching: false,
    };
  return logs;
}

export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case GET_LOGS.PENDING:
      newState = {
        ...state,
        isFetching: true,
      };
      break;
    case GET_LOGS.ROOT:
    case GET_LOGS.FULFILLED:
      newState = addData(state, action.payload);
      break;
    default:
      newState = state;
  }

  return newState;
}
