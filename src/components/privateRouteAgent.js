import React from 'react';
import { useAuth } from "../context/user";
import {
    Redirect,
    Route,
} from "react-router-dom";

/**
 * Component to handle Private routes for AGENT role only
 * @category Routes
 * @component
 */
function PrivateRouteAgent({ children, ...rest }) {
    const { authUser } = useAuth();
    return (
        <Route
            {...rest}
            render={({ location }) =>
                ((authUser) && (authUser.role === 'agent'))
                    ? (children)
                    : ((authUser) && (authUser.role !== 'agent'))
                        ?
                        (
                            <Redirect
                                to={{
                                    pathname: "/401",
                                    state: { from: location }
                                }}
                            />
                        )
                        : (!authUser)
                        &&
                        (
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

export default PrivateRouteAgent;