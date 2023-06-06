import { GET_ASSESSMENT } from '../actions';

function getAssessment(state, payload) {
  const assessment = payload.data;
  return {
    isFetching: false,
    data: assessment,
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
    case GET_ASSESSMENT.ROOT:
    case GET_ASSESSMENT.FULFILLED:
      newState = getAssessment(state, action.payload);
      break;
    case GET_ASSESSMENT.PENDING:
      newState = {
        isFetching: true,
      };
      break;
    case GET_ASSESSMENT.REJECTED:
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
