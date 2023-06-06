import { EDIT_ENTITY } from '../actions';

function editEntity(state, payload) {
  const entity = payload.data;
  return {
    isFetching: false,
    data: entity,
  };
}

export default function(
  state = {
    isFetching: true,
    data: {},
  },
  action
) {
  let newState;
  switch (action.type) {
    case EDIT_ENTITY.ROOT:
    case EDIT_ENTITY.FULFILLED:
      newState = editEntity(state, action.payload);
      break;
    case EDIT_ENTITY.PENDING:
      newState = {
        isFetching: true,
      };
      break;
    case EDIT_ENTITY.REJECTED:
      newState = {
        isFetching: false,
        hasErrors: true,
        errors: action.payload.response.data.errors,
        message: action.payload.response.data.message,
      };
      break;
    default:
      newState = state;
  }

  return newState;
}
