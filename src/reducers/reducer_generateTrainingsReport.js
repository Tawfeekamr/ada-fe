import { GENERATE_TRAININGS_REPORT } from '../actions';

function addData(state, payload) {
  const { url } = payload.data;

  return {
    data: url,
    isFetching: false,
  };
}

export default function(
  state = {
    isFetching: false,
  },
  action
) {
  let newState;
  switch (action.type) {
    case GENERATE_TRAININGS_REPORT.ROOT:
    case GENERATE_TRAININGS_REPORT.FULFILLED:
      newState = addData(state, action.payload);
      break;
    case GENERATE_TRAININGS_REPORT.PENDING:
      newState = {
        isFetching: true,
      };
      break;
    case GENERATE_TRAININGS_REPORT.REJECTED:
      newState = {
        isFetching: false,
      };
      break;
    default:
      newState = state;
  }

  return newState;
}
