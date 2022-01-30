import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import Home from "routes/Home";
import Authentication from "routes/Authentication";

const Router = ({ isLoggedIn, userObject, refreshDisplayName, createNotification, isDark, changeTheme }) => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      {isLoggedIn ? (
        <Switch>
          <Route exact path="/">
            <Home userObject={userObject} refreshDisplayName={refreshDisplayName} createNotification={createNotification} isDark={isDark} changeTheme={changeTheme} />
          </Route>
          <Route exact path="/profile">
            <Home userObject={userObject} refreshDisplayName={refreshDisplayName} createNotification={createNotification} isDark={isDark} changeTheme={changeTheme} />
          </Route>
          <Redirect from="*" to="/" />
        </Switch>
      ) : (
        <Switch>
          <Route exact path="/">
            <Authentication userObject={userObject} />
          </Route>
          <Redirect from="*" to="/" />
        </Switch>
      )}
    </BrowserRouter>
  );
};

Router.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  userObject: PropTypes.object,
  refreshDisplayName: PropTypes.func.isRequired,
  createNotification: PropTypes.func.isRequired,
  isDark: PropTypes.bool.isRequired,
  changeTheme: PropTypes.func.isRequired,
};

export default Router;
