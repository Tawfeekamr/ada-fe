import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

/** Routes that need the user to be logged in to be able to view them */

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        return rest.isAuthenticated ? (
          <Component {...props} {...rest} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        );
      }}
    />
  );
};

PrivateRoute.propTypes = {
  /** Rendered component */
  component: PropTypes.func,
  /** Path for component */
  location: PropTypes.object
};

export default PrivateRoute;
