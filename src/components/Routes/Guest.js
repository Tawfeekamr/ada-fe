import React from "react";
import { Switch, Route } from "react-router-dom";
import { LoginAuth, OTPAuth, Forgot, Reset } from "../../pages";
/**
 * Navigation routes that need no authorization
 */
const GuestRoutes = () => {
  return (
    <Switch>
      <Route component={LoginAuth} path="/login" />
      <Route component={OTPAuth} path="/otp" />
      <Route component={Forgot} path="/forgot" />
      <Route component={Reset} path="/reset" />
      <Route component={LoginAuth} path="/" />
    </Switch>
  );
};

export default GuestRoutes;
