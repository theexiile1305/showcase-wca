import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { SIGN_IN } from '.';

export type AuthRouteProps = RouteProps

// eslint-disable-next-line react/prop-types
const AuthRoute: React.FC<AuthRouteProps> = ({ path, component }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

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
