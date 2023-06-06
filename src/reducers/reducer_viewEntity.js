import { VIEW_ENTITY } from '../actions';

function getEntity(state, payload) {
  const { entity } = payload.data;
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
    case VIEW_ENTITY.ROOT:
    case VIEW_ENTITY.FULFILLED:
      newState = getEntity(state, action.payload);
      break;
    case VIEW_ENTITY.PENDING:
      newState = {
        isFetching: true,
      };
      break;
    case VIEW_ENTITY.REJECTED:
      newState = {
        isFetching: false,
        hasErrors: true,
        data: action.payload.response.data.message,
      };
      break;
    default:
      newState = state;
  }

  return newState;
}
