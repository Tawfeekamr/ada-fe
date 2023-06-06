import { GET_CAMPAIGN_PILLARS } from '../actions';

const getPillars = (state, action) => {
  const list = {
    ar: [{}],
    en: [{}],
  };
  const { pillars, assessment, entity } = action.payload.data;
  pillars.forEach((item, index) => {
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
    assessment,
    entity,
    isFetching: false,
  });
};
export default function(
  state = {
    isFetching: false,
  },
  action
) {
  let newState;
  switch (action.type) {
    case GET_CAMPAIGN_PILLARS:
    case GET_CAMPAIGN_PILLARS.FULFILLED:
      newState = getPillars(state, action);
      break;
    case GET_CAMPAIGN_PILLARS.PENDING:
      newState = { isFetching: true };
      break;
    case GET_CAMPAIGN_PILLARS.REJECTED:
      newState = Object.assign({}, state, {
        error: action.payload.response
          ? action.payload.response.data.message
          : action.payload.response,
        isFetching: false,
      });
      break;
    default:
      newState = state;
  }
  return newState;
}
