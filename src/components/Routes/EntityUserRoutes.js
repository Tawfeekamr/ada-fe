import React from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "../App/PrivateRoute";
import {
  OTPAuth,
  LoginAuth,
  Forgot,
  Reset,
  AnswerAssessment
} from "../../pages";
import { ENTITY_USER, SELF_ASSESSMENT } from "../../utilities";
/**
 * Navigation routes for Entity User
 */
const EntityUserRoutes = props => {
  return (
    <Switch>
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={AnswerAssessment}
        userRole={ENTITY_USER}
        type={SELF_ASSESSMENT}
        exact
        path="/"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={AnswerAssessment}
        userRole={ENTITY_USER}
        type={SELF_ASSESSMENT}
        exact
        path="/assessment"
      />
      <Route component={OTPAuth} path="/otp" />
      <Route component={LoginAuth} path="/login" />
      <Route component={Forgot} path="/forgot" />
      <Route component={Reset} path="/reset" />
    </Switch>
  );
};

EntityUserRoutes.propTypes = {
  isAuthenticated: PropTypes.func
};

export default EntityUserRoutes;
