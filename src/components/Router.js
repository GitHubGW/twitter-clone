import React from "react";
import { HashRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import Home from "routes/Home";
import Authentication from "routes/Authentication";
// import Profile from "routes/Profile";

const Router = ({ isLoggedIn, userObject, refreshDisplayName, createNotification, isDark, changeTheme }) => {
  return (
    <HashRouter>
      {isLoggedIn ? (
        <Switch>
          <Route exact path="/">
            <Home
              userObject={userObject}
              refreshDisplayName={refreshDisplayName}
              createNotification={createNotification}
              isDark={isDark}
              changeTheme={changeTheme}
            />
          </Route>
          <Route exact path="/profile">
            <Home
              userObject={userObject}
              refreshDisplayName={refreshDisplayName}
              createNotification={createNotification}
              isDark={isDark}
              changeTheme={changeTheme}
            />
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
    </HashRouter>
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
