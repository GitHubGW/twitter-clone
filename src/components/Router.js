import React from "react";
import { HashRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "routes/Home";
import Authentication from "routes/Authentication";
import Profile from "routes/Profile";

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

export default Router;
