import React from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "../App/PrivateRoute";
import {
  OTPAuth,
  LoginAuth,
  Forgot,
  Reset,
  ActiveAssessments,
  AnswerAssessment,
  ActiveCampaigns,
  CampaignDetails,
  EditEntity,
  Entities,
  Reports
} from "../../pages";

import { ENTITY_ADVISOR, ADVISOR_ASSESSMENT } from "../../utilities";

/**
 * Navigation routes for Entity Advisor
 */
const EntityAdvisorRoutes = props => {
  return (
    <Switch>
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={ActiveAssessments}
        userRole={ENTITY_ADVISOR}
        exact
        path="/"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={ActiveAssessments}
        userRole={ENTITY_ADVISOR}
        exact
        path="/assessment"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={CampaignDetails}
        userRole={ENTITY_ADVISOR}
        exact
        path="/campaign/:id"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={ActiveCampaigns}
        userRole={ENTITY_ADVISOR}
        exact
        path="/campaign"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={CampaignDetails}
        userRole={ENTITY_ADVISOR}
        exact
        path="/campaigns/:id"
      />

      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={AnswerAssessment}
        type={ADVISOR_ASSESSMENT}
        userRole={ENTITY_ADVISOR}
        exact
        path="/assessment/:assessmentId/campaign/:campaignId/entity/:entityId"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={EditEntity}
        userRole={ENTITY_ADVISOR}
        exact
        path="/entities/:id/edit"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={Entities}
        userRole={ENTITY_ADVISOR}
        path="/entities/:id/view"
        type="entity"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={Entities}
        userRole={ENTITY_ADVISOR}
        path="/entities"
        type="entities"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={Reports}
        userRole={ENTITY_ADVISOR}
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

EntityAdvisorRoutes.propTypes = {
  isAuthenticated: PropTypes.func
};

export default EntityAdvisorRoutes;
