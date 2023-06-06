import Api from '../utilities/api';

export const GENERATE_SELF_REPORT = {
  ROOT: 'GENERATE_SELF_REPORT',
  PENDING: 'GENERATE_SELF_REPORT_PENDING',
  REJECTED: 'GENERATE_SELF_REPORT_REJECTED',
  FULFILLED: 'GENERATE_SELF_REPORT_FULFILLED',
};

export function generateSelfReport(id, qs) {
  return {
    type: GENERATE_SELF_REPORT.ROOT,
    payload: Api.generateSelfReport(id, qs),
  };
}
