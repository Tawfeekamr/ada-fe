export const TOGGLE_LANGUAGE = {
  ROOT: 'TOGGLE_LANGUAGE',
};

export function toggleLanguage() {
  return { type: TOGGLE_LANGUAGE.ROOT, payload: {} };
}
