import { REPORT_YEARS, REPORT_CAMPAIGNS, REPORT_ENTITIES } from '../actions';
import { numbers } from '../utilities';

export function getReportYears(
  state = { data: [], isFetching: false },
  action
) {
  let newState;
  switch (action.type) {
    case REPORT_YEARS.PENDING:
      newState = { ...state, isFetching: true };
      break;
    case REPORT_YEARS.FULFILLED:
      newState = {
        isFetching: false,
        data: {
          ar: action.payload.data.years.map(year => ({
            label: numbers.convertToArabic(year),
            value: year,
          })),
          en: action.payload.data.years.map(year => ({
            label: year,
            value: year,
          })),
        },
      };
      break;

    case REPORT_YEARS.REJECTED:
      newState = { isFetching: false, data: action.payload.response.data };
      break;
    default:
      newState = state;
  }
  return newState;
}

export function getReportCampaigns(
  state = { data: [], isFetching: false },
  action
) {
  let newState;
  switch (action.type) {
    case REPORT_CAMPAIGNS.PENDING:
      newState = { ...state, isFetching: true };
      break;
    case REPORT_CAMPAIGNS.FULFILLED:
      newState = {
        isFetching: false,
        data: {
          ar: action.payload.data.campaigns.map(campaign => ({
            label: campaign.translations[0].name,
            value: campaign.id,
          })),
          en: action.payload.data.campaigns.map(campaign => ({
            label: campaign.translations[1].name,
            value: campaign.id,
          })),
        },
      };
      break;

    case REPORT_CAMPAIGNS.REJECTED:
      newState = { isFetching: false, data: action.payload.response.data };
      break;
    default:
      newState = state;
  }
  return newState;
}

export function getReportEntities(
  state = { data: [], isFetching: false },
  action
) {
  let newState;
  switch (action.type) {
    case REPORT_ENTITIES.PENDING:
      newState = { ...state, isFetching: true };
      break;
    case REPORT_ENTITIES.FULFILLED:
      newState = {
        isFetching: false,
        data: {
          ar: action.payload.data.entities.map(entity => ({
            label: entity.translations[0].name,
            value: entity.id,
          })),
          en: action.payload.data.entities.map(entity => ({
            label: entity.translations[1].name,
            value: entity.id,
          })),
        },
      };
      break;
    case REPORT_ENTITIES.REJECTED:
      newState = { isFetching: false, data: action.payload.response.data };
      break;
    default:
      newState = state;
  }
  return newState;
}

export function generateAndDownloadReport(state = {}, action) {
  let newState;
  switch (action.type) {
    case REPORT_ENTITIES.FULFILLED:
      newState = action.payload.data.entities;
      break;

    case REPORT_ENTITIES.REJECTED:
      newState = action.payload.response.data;
      break;
    default:
      newState = state;
  }
  return newState;
}
