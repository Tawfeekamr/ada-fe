import Api from '../utilities/api';

export const GET_NOTIFICATIONS = {
  ROOT: 'GET_NOTIFICATIONS',
  PENDING: 'GET_NOTIFICATIONS_PENDING',
  REJECTED: 'GET_NOTIFICATIONS_REJECTED',
  FULFILLED: 'GET_NOTIFICATIONS_FULFILLED',
};

export function getNotifications(qs) {
  return {
    type: GET_NOTIFICATIONS.ROOT,
    payload: Api.getNotifications(qs),
  };
}
