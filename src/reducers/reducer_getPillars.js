import { GET_PILLARS } from '../actions';

const getRoles = (state, action) => {
  const list = {
    ar: [{}],
    en: [{}],
  };
  action.payload.data.pillars.forEach((item, index) => {
    list.ar[index] = {
      value: item.translations[0].pillar_id,
      label: item.translations[0].name,
    };
    list.en[index] = {
      value: item.translations[1].pillar_id,
      label: item.translations[1].name,
    };
  });
  return Object.assign({}, state, {
    data: list,
  });
};
export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case GET_PILLARS:
    case GET_PILLARS.FULFILLED:
      newState = getRoles(state, action);
      break;
    case GET_PILLARS.REJECTED:
      newState = Object.assign({}, state, {
        error: action.payload.response
          ? action.payload.response.data.message
          : action.payload.response,
      });
      break;
    default:
      newState = state;
  }
  return newState;
}
