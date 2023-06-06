import { GET_DASHBOARD_CHART_DATA } from '../actions';

export default function(state = { entities: [] }, action) {
  let newState;
  switch (action.type) {
    case GET_DASHBOARD_CHART_DATA.ROOT:
    case GET_DASHBOARD_CHART_DATA.FULFILLED:
      newState = action.payload.data;
      break;
    default:
      newState = state;
  }

  return newState;
}
