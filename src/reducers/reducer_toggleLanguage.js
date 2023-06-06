import { TOGGLE_LANGUAGE } from '../actions';
import API from '../utilities/api';

function changeLanguage(state) {
  const language = state === 'en' ? 'ar' : 'en';
  sessionStorage.setItem('language', language);
  API.updateHeaders({ lang: sessionStorage.getItem('language') });
  return language;
}
export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case TOGGLE_LANGUAGE.ROOT:
      newState = changeLanguage(state);
      break;
    default:
      newState = state;
  }
  return newState;
}
