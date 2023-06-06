import { REMOVE_ENTITY_FROM_CAMPAIGN } from '../actions';

function updateEntity(state, payload) {
  const { message } = payload.data;

  return {
    isFetching: false,
    data: message,
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
    case REMOVE_ENTITY_FROM_CAMPAIGN.ROOT:
    case REMOVE_ENTITY_FROM_CAMPAIGN.FULFILLED:
      newState = updateEntity(state, action.payload);
      break;
    case REMOVE_ENTITY_FROM_CAMPAIGN.PENDING:
      newState = {
        isFetching: true,
      };
      break;
    default:
      newState = state;
  }

  return newState;
}
