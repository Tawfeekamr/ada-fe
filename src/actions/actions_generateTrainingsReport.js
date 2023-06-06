import Api from '../utilities/api';

export const GENERATE_TRAININGS_REPORT = {
  ROOT: 'GENERATE_TRAININGS_REPORT',
  PENDING: 'GENERATE_TRAININGS_REPORT_PENDING',
  REJECTED: 'GENERATE_TRAININGS_REPORT_REJECTED',
  FULFILLED: 'GENERATE_TRAININGS_REPORT_FULFILLED',
};

export function generateTrainingsReport(id, qs) {
  return {
    type: GENERATE_TRAININGS_REPORT.ROOT,
    payload: Api.generateTrainingsReport(id, qs),
  };
}
