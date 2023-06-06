import { GET_ROLES } from '../actions';

const getRoles = (state, action) => {
  const list = {
    ar: [{}],
    en: [{}],
  };
  action.payload.data.roles.forEach((item, index) => {
    list.ar[index] = {
      value: item.translations[0].role_id,
      label: item.translations[0].name,
    };
    list.en[index] = {
      value: item.translations[1].role_id,
      label: item.translations[1].name,
    };
  });
  return Object.assign({}, state, {
    isFetching: false,
    list,
  });
};
export default function(
  state = {
    isFetching: false,
    list: [],
  },
  action
) {
  let newState;
  switch (action.type) {
    case GET_ROLES:
    case GET_ROLES.FULFILLED:
      newState = getRoles(state, action);
      break;
    case GET_ROLES.PENDING:
      newState = Object.assign({}, state, {
        isFetching: true,
      });
      break;
    case GET_ROLES.REJECTED:
      newState = Object.assign({}, state, {
        isFetching: false,
        error: action.payload.response.data.message,
      });
      break;
    default:
      newState = state;
  }
  return newState;
}
