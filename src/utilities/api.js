import axios from "axios";
import jwtDecode from "jwt-decode";

let BASE_URL;
if (process.env.REACT_APP_ENV === "production") {
  BASE_URL = process.env.REACT_APP_PRODUCTION_URL;
} else {
  BASE_URL = process.env.REACT_APP_STAGING_URL;
}
// Add API base url
// const DEVELOPEMENT_URL = 'https://staging.robustastudio.com/adaa/public/api/v1';
// const PRODUCTION_URL = 'http://95.177.211.187/adaa/public/api/v1';
// const STAGING_URL = 'http://95.177.211.187/adaa/public/api/v1';
// const PRODUCTION_URL = 'https://api.ma.adaa.gov.sa/api/v1';
// const STAGING_URL = 'https://api.ma-stg.adaa.gov.sa/api/v1';
// const PRODUCTION_URL = 'https://api.ma.adaa.gov.sa/api/v1';
// const BASE_URL = STAGING_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  method: "get",
  headers: {
    "content-type": "application/json",
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    lang: sessionStorage.getItem("language") || "ar"
  }
});
let EXPIRY_DATE = null;

export default class Api {
  static fetchWrapper(method, url, data) {
    let refreshPromise = null;
    const currentTime = Date.now() / 1000;
    EXPIRY_DATE = Number(sessionStorage.getItem("expiry_date"));
    if (EXPIRY_DATE - currentTime < 5) {
      refreshPromise = Api.fetchRefreshToken();
    } else {
      refreshPromise = Promise.resolve(null);
    }
    return refreshPromise
      .then(res => {
        if (!res) {
          return;
        }
        const dataItems = res.data.data;
        sessionStorage.setItem("token", dataItems.access_token);
        const headers = {
          Authorization: `Bearer ${dataItems.access_token}`,
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: 0
        };
        const decoded = jwtDecode(dataItems.access_token);
        sessionStorage.setItem("expiry_date", decoded.exp);
        Api.updateHeaders(headers);
      })
      .then(() => {
        switch (method) {
          case "post":
            return axiosInstance.post(url, data);
          case "get":
            return axiosInstance.get(url, { params: data });
          case "put":
            return axiosInstance.put(url, data);
          case "patch":
            return axiosInstance.patch(url, data);
          case "delete":
            return axiosInstance.delete(url, { params: data });
          default:
            return Promise.reject(
              new Error("Expected post/get/put/patch/delete")
            );
        }
      })
      .then(res => {
        return res.data;
      });
  }
  static updateHeaders(headers) {
    const axiosHeaders = axiosInstance.defaults.headers || {};
    axiosInstance.defaults.headers = { ...axiosHeaders, ...headers };
  }
  static getLoginCredentials(path, data) {
    return axiosInstance.post(path, data).then(res => {
      const token = res.data.data.access_token;
      sessionStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      sessionStorage.setItem("expiry_date", decoded.exp);
      const headers = {
        Authorization: `Bearer ${token}`
      };
      Api.updateHeaders(headers);
      return res.data;
    });
  }

  static getOTPStatus(path, data) {
    return axiosInstance.post(path, data).then(res => {
      return res.data;
    });
  }

  static otpData(data) {
    sessionStorage.setItem("email", data.email);
    sessionStorage.setItem("password", data.password);
    return Api.getOTPStatus("/auth/login", data);
  }

  static loginData(data) {
    return Api.getLoginCredentials("/auth/login", data);
  }
  static logout() {
    return axiosInstance.post("/auth/logout");
  }
  static forgotPassword(data) {
    return axiosInstance.post("/password/reset_email", data).then(res => {
      return res.data;
    });
  }
  static inviteUser(data) {
    return Api.fetchWrapper("post", "/users", data);
  }
  static saveRating(data) {
    return Api.fetchWrapper("post", "assessments/ecsaveRating", data);
  }
  static saveAssessorRating(id, data) {
    return Api.fetchWrapper("post", `/assessments/${id}/saveRating`, data);
  }
  // Do not use fetchwrapper to avoid infinite loop as this function is called in fetchwrapper
  static fetchRefreshToken() {
    return axiosInstance.post("/auth/refresh");
  }
  // static getEntitiesNoAdvisor() {
  //   const query = {
  //     paginate: false,
  //     'filters[0][field]': 'advisor_id',
  //     'filters[0][value]': 'NULL',
  //     'filters[0][operator]': '=',
  //   };
  //   return Api.fetchWrapper('get', '/entities', query);
  // }
  static getRoles() {
    return Api.fetchWrapper("get", "/roles");
  }
  static resetPassword(data) {
    return axios({
      method: "POST",
      url: `${BASE_URL}/password/reset`,
      data,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: 0,
        lang: sessionStorage.getItem("language")
      }
    }).then(response => {
      return response.data;
    });
  }
  static checkResetTokenValidity(data) {
    return axios({
      method: "POST",
      url: `${BASE_URL}/password/validate_token`,
      data,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: 0,
        lang: sessionStorage.getItem("language") || "ar"
      }
    }).then(response => {
      return response.data;
    });
  }
  static getUserInfo() {
    return Api.fetchWrapper("post", "/auth/me");
  }
  static getEntities(query) {
    return Api.fetchWrapper("get", "/entities", query);
  }
  static createEntity(values) {
    return Api.fetchWrapper("post", "/entities", values);
  }
  static deleteEntity(id) {
    return Api.fetchWrapper("delete", `/entities/${id}`);
  }
  static removeEntityFromCampaign(campignId, entityId) {
    return Api.fetchWrapper(
      "delete",
      `/campaigns/${campignId}/remove_entity/${entityId}`
    );
  }
  static createEvidence(files, id) {
    return Api.fetchWrapper("post", `/evidences/${id}/evidence_entry`, files);
  }
  static deleteFile(id) {
    return Api.fetchWrapper("delete", `/evidence_entry_files/${id}`);
  }
  static getAssessments(qs) {
    return Api.fetchWrapper("get", "/assessments", qs);
  }
  static getUsers(qs) {
    return Api.fetchWrapper("get", "/users", qs);
  }
  static createAssessment(values) {
    return Api.fetchWrapper("post", "/assessments", values);
  }
  static editAssessment(id, values) {
    return Api.fetchWrapper("put", `/assessments/${id}`, values);
  }
  static getCampaignData(id) {
    return Api.fetchWrapper("get", `/campaigns/${id}`);
  }
  static generateSelfReport(id, qs) {
    return Api.fetchWrapper("get", `/reports/campaign_scores/${id}`, qs);
  }
  static generateTrainingsReport(id, qs) {
    return Api.fetchWrapper("get", `/entities/${id}/trainings/export`, qs);
  }
  static getAssessmentData() {
    return Api.fetchWrapper("get", "/assessments/ecview");
  }
  static getAssessmentDetails(id) {
    return Api.fetchWrapper("get", `/assessments/${id}/details`);
  }
  static getAssessmentDataByParams(entityId, campaignId, assessmentId) {
    return Api.fetchWrapper(
      "get",
      `/assessments/${assessmentId}?campaign_id=${campaignId}&entity_id=${entityId}`
    );
  }
  static assignEntitiesToCampaign(campaignID, body) {
    return Api.fetchWrapper("post", `campaigns/${campaignID}/entities`, body);
  }
  static getAssessors() {
    return Api.fetchWrapper(
      "get",
      "/users?filters[0][field]=role_id&paginate=false&filters[0][value]=3&filters[0][operator]==" +
        "&filters[1][field]=deleted_at&filters[1][value]=NULL&filters[1][operator]=="
    );
  }
  static getPillars(id) {
    return Api.fetchWrapper("get", `/assessments/${id}/pillars`);
  }
  static getTrainings(id, qs) {
    return Api.fetchWrapper("get", `entities/${id}/trainings`, qs);
  }
  static getDashboardChartData(qs) {
    return Api.fetchWrapper("get", "/dashboard/lastSubmittedEntities", qs);
  }
  static getCampaignPillars(id) {
    return Api.fetchWrapper("get", `/campaigns/${id}/available_pillars`);
  }
  static submitCampaignAssessors(id, body) {
    return Api.fetchWrapper("post", `/campaigns/${id}/assessors`, body);
  }

  static setCampaignConfiguration(values) {
    return Api.fetchWrapper("post", "/campaigns", values);
  }
  static getCampaigns(qs) {
    return Api.fetchWrapper("get", "/campaigns", qs);
  }
  static getCampaignEntities(qs) {
    return Api.fetchWrapper("get", "/entities/availableEntities", qs);
  }
  static getECAssessments(active, query) {
    const qs = {
      ...query,
      "filters[0][field]": "status",
      "filters[0][value]": active ? "1" : "0",
      "filters[0][operator]": "="
    };
    return Api.fetchWrapper("get", "/campaigns", qs);
  }
  static getECEntityUsers(id) {
    return Api.fetchWrapper("get", `/campaigns/${id}/entity_users`);
  }
  static assignUser(id, body) {
    return Api.fetchWrapper("post", `/campaigns/${id}/entity_users`, body);
  }
  static deassignUser(id, body) {
    return Api.fetchWrapper("delete", `/campaigns/${id}/entity_users`, body);
  }
  static deactivateUser(id) {
    return Api.fetchWrapper("delete", `/users/${id}`);
  }
  static activateUser(id) {
    return Api.fetchWrapper("patch", `/users/${id}/activate`);
  }
  static sendReminder(id) {
    return Api.fetchWrapper("get", `/campaigns/sendReminder/${id}`);
  }
  static getCampaignWithStatus(status, query) {
    const qs = {
      ...query,
      "filters[0][field]": "status",
      "filters[0][value]": status ? "1" : "0",
      "filters[0][operator]": "="
    };
    return Api.fetchWrapper("get", "/campaigns", qs);
  }
  static getActiveCampaignsEntities(id) {
    return Api.fetchWrapper("get", `/campaigns/${id}/entities`);
  }
  static viewEntity(id) {
    return Api.fetchWrapper("get", `/entities/${id}`);
  }
  static editEntity(id, body) {
    return Api.fetchWrapper("patch", `/entities/${id}`, body);
  }
  static skipCampaign(campaignId, assessmentId, body) {
    return Api.fetchWrapper(
      "post",
      `/campaigns/${campaignId}/skip_advisor/${assessmentId}`,
      body
    );
  }
  static setInductionMeeting(campaignId, entityId, data) {
    return Api.fetchWrapper(
      "post",
      `/campaigns/${campaignId}/induction/${entityId}`,
      data
    );
  }
  static setNewSelfAssessmentDate(campaignId, entityId, newDate) {
    return Api.fetchWrapper(
      "patch",
      `/campaigns/${campaignId}/extend_assessment_duration/${entityId}`,
      newDate
    );
  }
  static getLogs(qs) {
    return Api.fetchWrapper("get", "/logs", qs);
  }
  static getNotifications(qs) {
    return Api.fetchWrapper("get", "/notifications", qs);
  }
  static getLogsActions() {
    return Api.fetchWrapper("get", "/logs/actions");
  }
  static getReportYears() {
    return Api.fetchWrapper("get", "/reports/years");
  }
  static getReportCampaigns(year) {
    return Api.fetchWrapper(
      "get",
      `/campaigns/year/?year=${year}&paginate=false`
    );
  }
  static getReportEntities(campaignId, reportType) {
    return Api.fetchWrapper(
      "get",
      `/campaigns/${campaignId}/type/${reportType}`
    );
  }
  static generateAndDownloadReport(reportType, campaignId, entityId) {
    return Api.fetchWrapper(
      "get",
      `/reports/download/${reportType}/${campaignId}/${entityId}`
    );
  }
}
