import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ApplicationState } from 'src/Store/ApplicationState';
import { SIGN_IN } from '.';

export type AuthRouteProps = RouteProps

// eslint-disable-next-line react/prop-types
const AuthRoute: React.FC<AuthRouteProps> = ({ path, component }) => {
  const isAuthenticated = useSelector((state: ApplicationState) => state.user.isAuthenticated);

  return (
    <>
      {isAuthenticated ? (
        <Route exact path={path} component={component} />
      ) : (
        <Redirect to={SIGN_IN} />
      )}
    </>
  );
};

export default AuthRoute;
