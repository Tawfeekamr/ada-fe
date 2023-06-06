import { GET_LOGS_ACTIONS } from '../actions';

function addData(state, payload) {
  const { actions } = payload.data;

  return {
    ar: actions.map(action => ({
      label: action.label_ar,
      value: action.value,
    })),
    en: actions.map(action => ({
      label: action.label_en,
      value: action.value,
    })),
  };
}

export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case GET_LOGS_ACTIONS.ROOT:
    case GET_LOGS_ACTIONS.FULFILLED:
      newState = addData(state, action.payload);
      break;
    default:
      newState = state;
  }

  return newState;
}
