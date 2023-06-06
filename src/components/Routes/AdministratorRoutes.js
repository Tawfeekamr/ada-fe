import React from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "../App/PrivateRoute";
import {
  LoginAuth,
  OTPAuth,
  Forgot,
  Invite,
  NewEntity,
  Reset,
  Entities,
  Users,
  EditEntity,
  Logs,
  Dashboard,
  Reports
} from "../../pages";
import { ADMIN } from "../../utilities";
/**
 * Navigation routes for Admin
 */
const AdminRoutes = props => {
  return (
    <Switch>
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={Users}
        userRole={ADMIN}
        exact
        path="/"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={NewEntity}
        exact
        path="/entities/new"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={EditEntity}
        userRole={ADMIN}
        exact
        path="/entities/:id/edit"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={Invite}
        exact
        userRole={ADMIN}
        path="/users/new"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={Entities}
        userRole={ADMIN}
        path="/entities"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={Users}
        userRole={ADMIN}
        path="/users"
      />

      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={Logs}
        userRole={ADMIN}
        path="/logs"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={Dashboard}
        userRole={ADMIN}
        path="/dashboard"
      />
      <PrivateRoute
        isAuthenticated={props.isAuthenticated()}
        component={Reports}
        userRole={ADMIN}
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

AdminRoutes.propTypes = {
  isAuthenticated: PropTypes.func
};

export default AdminRoutes;
