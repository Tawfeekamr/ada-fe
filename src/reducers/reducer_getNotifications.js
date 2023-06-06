import { GET_NOTIFICATIONS } from '../actions';

function addData(state, payload) {
  const { notifications } = payload.data;
  if (Object.prototype.hasOwnProperty.call(notifications, 'data'))
    return {
      totalPages: notifications.last_page,
      currentPage: notifications.current_page,
      data: notifications.data,
      total: notifications.total,
      isFetching: false,
    };
  return notifications;
}

export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case GET_NOTIFICATIONS.PENDING:
      newState = {
        ...state,
        isFetching: true,
      };
      break;
    case GET_NOTIFICATIONS.ROOT:
    case GET_NOTIFICATIONS.FULFILLED:
      newState = addData(state, action.payload);
      break;
    default:
      newState = state;
  }

  return newState;
}
