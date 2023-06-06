import {
  GET_ASSESSMENTS,
  GET_EC_ACTIVE_ASSESSMENTS,
  GET_EC_INACTIVE_ASSESSMENTS,
} from '../actions';

function addAssessments(state, payload) {
  const { assessments } = payload.data;
  const list = {
    ar: [{}],
    en: [{}],
  };
  const assessmentsData = assessments.length ? assessments : assessments.data;
  if (assessmentsData) {
    assessmentsData.forEach((item, index) => {
      list.ar[index] = {
        value: item.id,
        label: item.translations[0].name,
      };
      list.en[index] = {
        value: item.id,
        label: item.translations[1].name,
      };
    });
  }

  return {
    data: list,
  };
}
function addECAssessment(state, payload) {
  const { campaigns } = payload.data;
  return {
    totalPages: campaigns.last_page,
    currentPage: campaigns.current_page,
    data: campaigns.data || campaigns,
    total: campaigns.total,
  };
}
function addAssessmentsPaginated(state, payload) {
  const { assessments } = payload.data;
  return {
    totalPages: assessments.last_page,
    currentPage: assessments.current_page,
    data: assessments.data,
    total: assessments.total,
  };
}

export default function(
  state = {
    isFetching: false,
    list: {},
  },
  action
) {
  let newState;
  switch (action.type) {
    case GET_ASSESSMENTS.ROOT:
    case GET_ASSESSMENTS.FULFILLED:
      newState = addAssessments(state, action.payload);
      break;
    case GET_ASSESSMENTS.PENDING:
      newState = {
        isFetching: true,
      };
      break;
    default:
      newState = state;
  }

  return newState;
}

export function activeECAssessments(state = {}, action) {
  let newState;
  switch (action.type) {
    case GET_EC_ACTIVE_ASSESSMENTS.FULFILLED:
      newState = addECAssessment(state, action.payload);
      break;
    default:
      newState = state;
  }

  return newState;
}
export function inactiveECAssessments(state = {}, action) {
  let newState;
  switch (action.type) {
    case GET_EC_INACTIVE_ASSESSMENTS.FULFILLED:
      newState = addECAssessment(state, action.payload);
      break;
    default:
      newState = state;
  }

  return newState;
}

export function assessmentsPaginated(state = {}, action) {
  let newState;
  switch (action.type) {
    case GET_ASSESSMENTS.FULFILLED:
      newState = addAssessmentsPaginated(state, action.payload);
      break;
    default:
      newState = state;
  }

  return newState;
}
