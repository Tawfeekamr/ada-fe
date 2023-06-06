import Api from '../utilities/api';

export const SAVE_RATING = {
  ROOT: 'SAVE_RATING',
  PENDING: 'SAVE_RATING_PENDING',
  REJECTED: 'SAVE_RATING_REJECTED',
  FULFILLED: 'SAVE_RATING_FULFILLED',
};

export function saveRating(data) {
  return { type: SAVE_RATING.ROOT, payload: Api.saveRating(data) };
}
export function saveAssessorRating(id, data) {
  return { type: SAVE_RATING.ROOT, payload: Api.saveAssessorRating(id, data) };
}
