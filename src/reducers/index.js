import { combineReducers } from "redux";
import { reducer as toastrReducer } from "react-redux-toastr";
import sampleReducer from "./sampleReducer";
import language from "./reducer_toggleLanguage";
import loggedIn from "./reducer_login";
import otp_sent from "./reducer_otp";
import forgot from "./reducer_forgot";
import loggedOut from "./reducer_logout";
import entitiesNoAdvisor from "./reducer_getEntitiesNoAdvisor";
import userCreated from "./reducer_inviteUser";
import ratingSaved from "./reducer_saveRating";
import roles from "./reducer_getRoles";
import tokenStatus from "./reducer_resetPassword";
import tokenValidity from "./reducer_resetToken";
import userData from "./reducer_getUserData";
import isAuthenticated from "./reducer_authenticate";
import entityCreated from "./reducer_createEntity";
import entityDeleted from "./reducer_deleteEntity";
import evidenceCreated from "./reducer_createEvidence";
import deleteFile from "./reducer_deleteFile";
import entities from "./reducer_getEntities";
import flags from "./reducer_flags";
import users from "./reducer_getUsers";
import campaigns from "./reducer_getCampaigns";
import generatedSelfReport from "./reducer_generateSelfReport";
import generatedTrainingsReport from "./reducer_generateTrainingsReport";
import removeEntityFromCampaign from "./reducer_removeEntityFromCampaign";
import assessments, {
  assessmentsPaginated,
  activeECAssessments,
  inactiveECAssessments
} from "./reducer_getAssessments";
import campaign from "./reducer_getCampaign";
import assessment from "./reducer_getAssessment";
import assessors from "./reducer_getAssessors";
import trainings from "./reducer_getTrainings";
import assessmentCreated from "./reducer_createAssessment";
import assessmentEdited from "./reducer_editAssessment";
import pillars from "./reducer_getPillars";
import selectedCampaignEntitiesList from "./reducer_setCampaignEntities";
import configureCampaign, {
  assignEntitiesForCampaign,
  getEntitiesCampaign,
  assignAssessors
} from "./reducer_newCampaign";
import availablePillars from "./reducer_getAvailablePillars";
import assignedEntityUsers from "./reducer_getAssignedEntityUsers";
import assignUser, { deassignUser } from "./reducer_assignUser";
import sentReminder from "./reducer_reminder";
import activeCampaigns, {
  inactiveCampaigns
} from "./reducer_getCampaignsWithStatus";
import activeCampaignEntities from "./reducer_getCampaignEntities";
import entityDetails from "./reducer_viewEntity";
import editedEntity from "./reducer_editEntity";
import skipped from "./reducer_skipCampaign";
import isSkipped from "./reducer_setSkipped";
import inductionMeetingHeld from "./reducer_inductionMeeting";
import newSelfAssessmentDateCreated from "./reducer_selfAssessmentEndDate";
import logs from "./reducer_getLogs";
import logsActions from "./reducer_getLogsActions";
import activateUser from "./reducer_activateUser";
import deactivateUser from "./reducer_deactivateUser";
import dashboardChartData from "./reducer_dashboardChart";
import {
  getReportYears,
  getReportCampaigns,
  getReportEntities
} from "./reducer_reports";
import getNotifications from "./reducer_getNotifications";

const appReducer = combineReducers({
  sampleReducer,
  language,
  loggedIn,
  otp_sent,
  forgot,
  loggedOut,
  toastr: toastrReducer,
  entitiesNoAdvisor,
  userCreated,
  ratingSaved,
  entityCreated,
  entityDeleted,
  roles,
  tokenStatus,
  tokenValidity,
  userData,
  generatedSelfReport,
  generatedTrainingsReport,
  isAuthenticated,
  entities,
  flags,
  users,
  campaigns,
  assessments,
  assessmentsPaginated,
  activeAssessments: activeECAssessments,
  inactiveAssessments: inactiveECAssessments,
  campaign,
  assessment,
  removeEntityFromCampaign,
  configuredCampaign: configureCampaign,
  assignedEntities: assignEntitiesForCampaign,
  campaignEntities: getEntitiesCampaign,
  assessors,
  trainings,
  assessmentCreated,
  assessmentEdited,
  evidenceCreated,
  deleteFile,
  assignedAssessors: assignAssessors,
  pillars,
  selectedCampaignEntitiesList,
  availablePillars,
  assignedEntityUsers,
  deassignedEntityUsers: deassignUser,
  assignUser,
  sentReminder,
  activeCampaigns,
  inactiveCampaigns,
  activeCampaignEntities,
  entityDetails,
  editedEntity,
  skipped,
  isSkipped,
  inductionMeetingHeld,
  newSelfAssessmentDateCreated,
  logs,
  logsActions,
  activateUser,
  deactivateUser,
  dashboardChartData,
  reportYears: getReportYears,
  reportCampaigns: getReportCampaigns,
  reportEntities: getReportEntities,
  notifications: getNotifications
});

const rootReducer = (state, action) => {
  if (
    action.payload &&
    action.payload.response &&
    action.payload.response.status === 401 &&
    action.type !== "LOGIN_USER_REJECTED"
  ) {
    sessionStorage.clear();
    window.location.href = "/login";

    return appReducer(state, action);
  }
  if (action.type === "LOGOUT_USER") {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
