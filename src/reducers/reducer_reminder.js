import { SEND_REMINDER } from '../actions';

export default function(
  state = {
    loading: false,
  },
  action
) {
  let newState;
  switch (action.type) {
    case SEND_REMINDER.PENDING:
      newState = Object.assign({}, state, {
        loading: true,
      });
      break;
    case SEND_REMINDER.ROOT:
    case SEND_REMINDER.FULFILLED:
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
