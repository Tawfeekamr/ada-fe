import Api from "../utilities/api";

export const GET_USERS_FILTER = {
  ROOT: "GET_USERS_FILTER",
  PENDING: "GET_USERS_FILTER_PENDING",
  REJECTED: "GET_USERS_FILTER_REJECTED",
  FULFILLED: "GET_USERS_FILTER_FULFILLED"
};

export function getFilterdUsers(qs) {
  return {
    type: GET_USERS_FILTER.ROOT,
    payload: Api.getFilterdData(qs)
  };
}
