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
  AnswerAssessment,
  Users,
  ECAssessmentsList,
  AssignUser,
  EditEntity,
  Entities,
  Reports
} from "../../pages";
import { ENTITY_COORDINATOR, SELF_ASSESSMENT } from "../../utilities";

/**
 * Navigation routes for Entity Coordinator
 */
const EntityCoordinatorRoutes = props => {
  return (
    <Switch>
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={ECAssessmentsList}
        userRole={ENTITY_COORDINATOR}
        exact
        path="/"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={AssignUser}
        userRole={ENTITY_COORDINATOR}
        exact
        path="/campaign/:id/assign"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={AnswerAssessment}
        type={SELF_ASSESSMENT}
        userRole={ENTITY_COORDINATOR}
        exact
        path="/campaign/:campaignId/assessment/:assessmentId/entity/:entityId"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={ECAssessmentsList}
        userRole={ENTITY_COORDINATOR}
        exact
        path="/assessments"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={Invite}
        exact
        userRole={ENTITY_COORDINATOR}
        path="/users/new"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={Users}
        userRole={ENTITY_COORDINATOR}
        path="/users"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={EditEntity}
        userRole={ENTITY_COORDINATOR}
        exact
        path="/entities/:id/edit"
      />

      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={Entities}
        userRole={ENTITY_COORDINATOR}
        path="/entities"
        type="entity"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={Reports}
        userRole={ENTITY_COORDINATOR}
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

EntityCoordinatorRoutes.propTypes = {
  isAuthenticated: PropTypes.func
};

export default EntityCoordinatorRoutes;
