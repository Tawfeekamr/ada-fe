import { GET_ENTITIES_NO_ADVISOR } from '../actions';

const getEntitiesNoAdvisorMap = (state, action) => {
  const list = {
    ar: [{}],
    en: [{}],
  };
  action.payload.data.entities.forEach((item, index) => {
    list.ar[index] = {
      value: item.translations[0].entity_id,
      label: item.translations[0].name,
    };
    list.en[index] = {
      value: item.translations[1].entity_id,
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
    list: {},
  },
  action
) {
  let newState;
  switch (action.type) {
    case GET_ENTITIES_NO_ADVISOR:
    case GET_ENTITIES_NO_ADVISOR.FULFILLED:
      newState = getEntitiesNoAdvisorMap(state, action);
      break;
    case GET_ENTITIES_NO_ADVISOR.PENDING:
      // newState = logIn({ isLoading: true });
      newState = Object.assign({}, state, {
        isFetching: true,
      });
      break;
    case GET_ENTITIES_NO_ADVISOR.REJECTED:
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
