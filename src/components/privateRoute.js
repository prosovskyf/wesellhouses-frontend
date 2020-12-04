import React from 'react';
import { useAuth } from "../context/user";
import {
  Redirect,
  Route,
} from "react-router-dom";

/**
 * Component to handle Private routes for logged on users
 * @category Routes
 * @component
 */
function PrivateRoute({ children, ...rest }) {
  const { authUser } = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        authUser ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
      }
    />
  );
}

export default PrivateRoute;