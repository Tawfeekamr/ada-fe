import Api from '../utilities/api';

export const SEND_REMINDER = {
  ROOT: 'SEND_REMINDER',
  PENDING: 'SEND_REMINDER_PENDING',
  REJECTED: 'SEND_REMINDER_REJECTED',
  FULFILLED: 'SEND_REMINDER_FULFILLED',
};

export function sendReminder(id) {
  return { type: SEND_REMINDER.ROOT, payload: Api.sendReminder(id) };
}
