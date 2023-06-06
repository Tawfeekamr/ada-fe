import Api from '../utilities/api';

export const GET_DASHBOARD_CHART_DATA = {
  ROOT: 'GET_DASHBOARD_CHART_DATA',
  PENDING: 'GET_DASHBOARD_CHART_DATA_PENDING',
  REJECTED: 'GET_DASHBOARD_CHART_DATA_REJECTED',
  FULFILLED: 'GET_DASHBOARD_CHART_DATA_FULFILLED',
};

export function getDashboardChartData(qs) {
  return {
    type: GET_DASHBOARD_CHART_DATA.ROOT,
    payload: Api.getDashboardChartData(qs),
  };
}
