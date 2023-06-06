import React from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "../App/PrivateRoute";
import {
  LoginAuth,
  OTPAuth,
  Forgot,
  Reset,
  ActiveAssessments,
  AnswerAssessment,
  ActiveCampaigns,
  CampaignDetails,
  InductionMeeting,
  Reports
} from "../../pages";
import { ASSESSOR, ASSESSOR_ASSESSMENT } from "../../utilities";
/**
 * Navigation routes for Assessor
 */
const AssessorRoutes = props => {
  return (
    <Switch>
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={ActiveAssessments}
        userRole={ASSESSOR}
        exact
        path="/"
      />

      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={ActiveAssessments}
        userRole={ASSESSOR}
        exact
        path="/assessment"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={CampaignDetails}
        userRole={ASSESSOR}
        exact
        path="/campaign/:id"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={ActiveCampaigns}
        userRole={ASSESSOR}
        exact
        path="/campaign"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={CampaignDetails}
        userRole={ASSESSOR}
        exact
        path="/campaigns/:id"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={InductionMeeting}
        userRole={ASSESSOR}
        exact
        path="/campaigns/:campaignId/entity/:entityId/induction-meeting"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={AnswerAssessment}
        userRole={ASSESSOR}
        type={ASSESSOR_ASSESSMENT}
        exact
        path="/assessment/:assessmentId/campaign/:campaignId/entity/:entityId"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={Reports}
        userRole={ASSESSOR}
        exact
        path="/reports"
      />
      <Route component={OTPAuth} path="/otp" />
      <Route component={LoginAuth} path="/login" />
      <Route component={Forgot} path="/forgot" />
      <Route component={Reset} path="/reset" />
    </Switch>
  );
};

AssessorRoutes.propTypes = {
  isAuthenticated: PropTypes.func
};

export default AssessorRoutes;
