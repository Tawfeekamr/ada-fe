import Api from '../utilities/api';

export const REPORT_YEARS = {
  ROOT: 'REPORT_YEARS',
  PENDING: 'REPORT_YEARS_PENDING',
  REJECTED: 'REPORT_YEARS_REJECTED',
  FULFILLED: 'REPORT_YEARS_FULFILLED',
};

export function getReportYears() {
  return {
    type: REPORT_YEARS.ROOT,
    payload: Api.getReportYears(),
  };
}

export const REPORT_CAMPAIGNS = {
  ROOT: 'REPORT_CAMPAIGNS',
  PENDING: 'REPORT_CAMPAIGNS_PENDING',
  REJECTED: 'REPORT_CAMPAIGNS_REJECTED',
  FULFILLED: 'REPORT_CAMPAIGNS_FULFILLED',
};

export function getReportCampaigns(year) {
  return {
    type: REPORT_CAMPAIGNS.ROOT,
    payload: Api.getReportCampaigns(year),
  };
}

export const REPORT_ENTITIES = {
  ROOT: 'REPORT_ENTITIES',
  PENDING: 'REPORT_ENTITIES_PENDING',
  REJECTED: 'REPORT_ENTITIES_REJECTED',
  FULFILLED: 'REPORT_ENTITIES_FULFILLED',
};

export function getReportEntities(campaignId, reportType) {
  return {
    type: REPORT_ENTITIES.ROOT,
    payload: Api.getReportEntities(campaignId, reportType),
  };
}

export const REPORT_GENERATE_AND_DOWNLOAD = {
  ROOT: 'REPORT_GENERATE_AND_DOWNLOAD',
  PENDING: 'REPORT_GENERATE_AND_DOWNLOAD_PENDING',
  REJECTED: 'REPORT_GENERATE_AND_DOWNLOAD_REJECTED',
  FULFILLED: 'REPORT_GENERATE_AND_DOWNLOAD_FULFILLED',
};

export function generateAndDownloadReport(reportType, campaignId, entityId) {
  return {
    type: REPORT_GENERATE_AND_DOWNLOAD.ROOT,
    payload: Api.generateAndDownloadReport(reportType, campaignId, entityId),
  };
}
