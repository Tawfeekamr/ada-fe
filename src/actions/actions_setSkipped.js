export const SET_SKIPPED = {
  ROOT: 'SET_SKIPPED',
};

export function setSkipped(payload) {
  return { type: SET_SKIPPED.ROOT, payload };
}
