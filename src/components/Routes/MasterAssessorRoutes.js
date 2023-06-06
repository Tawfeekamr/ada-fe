import React from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "../App/PrivateRoute";
import {
  OTPAuth,
  LoginAuth,
  Forgot,
  Invite,
  Reset,
  Assessment,
  AnswerAssessment,
  NewCampaign,
  Entities,
  CampaignDetails,
  Campaigns,
  Users,
  AssessmentsList,
  InductionMeeting,
  Reports,
  Notifications
} from "../../pages";
import {
  MASTER_ASSESSOR,
  ASSESSOR_ASSESSMENT,
  SELF_ASSESSMENT,
  ADVISOR_ASSESSMENT,
  MASTER_ASSESSOR_ASSESSMENT
} from "../../utilities";
/**
 * Navigation routes for Master Assessor
 */

const MasterAssessorRoutes = props => {
  return (
    <Switch>
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={AssessmentsList}
        userRole={MASTER_ASSESSOR}
        exact
        path="/"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={Assessment}
        userRole={MASTER_ASSESSOR}
        exact
        path="/assessments/new"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={Assessment}
        userRole={MASTER_ASSESSOR}
        exact
        path="/assessments/:id/edit"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={AnswerAssessment}
        type={SELF_ASSESSMENT}
        disabled={true}
        userRole={MASTER_ASSESSOR}
        exact
        path="/assessments/:assessmentId/:campaignId/:entityId"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={AnswerAssessment}
        type={ASSESSOR_ASSESSMENT}
        disabled={true}
        userRole={MASTER_ASSESSOR}
        exact
        path="/assessments-assessor/:assessmentId/:campaignId/:entityId"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={AnswerAssessment}
        type={ADVISOR_ASSESSMENT}
        disabled={true}
        userRole={MASTER_ASSESSOR}
        exact
        path="/ea-assessment/:assessmentId/:campaignId/:entityId"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={AnswerAssessment}
        type={MASTER_ASSESSOR_ASSESSMENT}
        userRole={MASTER_ASSESSOR}
        exact
        path="/ma-assessment/:assessmentId/:campaignId/:entityId"
      />

      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={AssessmentsList}
        userRole={MASTER_ASSESSOR}
        path="/assessments"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={NewCampaign}
        userRole={MASTER_ASSESSOR}
        exact
        path="/campaigns/new"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={Campaigns}
        userRole={MASTER_ASSESSOR}
        exact
        path="/campaigns"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={Entities}
        userRole={MASTER_ASSESSOR}
        path="/entities"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={Users}
        userRole={MASTER_ASSESSOR}
        exact
        path="/users"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={Invite}
        userRole={MASTER_ASSESSOR}
        exact
        path="/users/new"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={CampaignDetails}
        userRole={MASTER_ASSESSOR}
        exact
        path="/campaigns/:id"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={Reports}
        userRole={MASTER_ASSESSOR}
        exact
        path="/reports"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={Notifications}
        userRole={MASTER_ASSESSOR}
        exact
        path="/notifications"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={InductionMeeting}
        userRole={MASTER_ASSESSOR}
        exact
        path="/campaigns/:campaignId/entity/:entityId/induction-meeting"
      />
      <Route component={OTPAuth} path="/otp" />
      <Route component={LoginAuth} path="/login" />
      <Route component={Forgot} path="/forgot" />
      <Route component={Reset} path="/reset" />
    </Switch>
  );
};

MasterAssessorRoutes.propTypes = {
  isAuthenticated: PropTypes.func
};

export default MasterAssessorRoutes;
