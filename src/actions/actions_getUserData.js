import Api from '../utilities/api';

export const GET_USER_DATA = {
  ROOT: 'GET_USER_DATA',
  PENDING: 'GET_USER_DATA_PENDING',
  REJECTED: 'GET_USER_DATA_REJECTED',
  FULFILLED: 'GET_USER_DATA_FULFILLED',
  SET: 'GET_USER_DATA_SET',
};

export function getUserData(attributes) {
  return {
    type: GET_USER_DATA.ROOT,
    payload: Api.getUserInfo(attributes).then(res => {
      return res;
    }),
  };
}
export function setUserData(data) {
  return {
    type: GET_USER_DATA.SET,
    payload: data,
  };
}
