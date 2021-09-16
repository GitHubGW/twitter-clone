import React from "react";
import { HashRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Authentication from "routes/Authentication";

const Router = ({ isLoggedIn, userObject, refreshDisplayName, createNotification, changeTheme }) => {
  return (
    <HashRouter>
      {isLoggedIn ? (
        <Switch>
          <Route exact path="/">
            <Home userObject={userObject} changeTheme={changeTheme} createNotification={createNotification} />
          </Route>
          <Route exact path="/profile">
            <Profile userObject={userObject} refreshDisplayName={refreshDisplayName} createNotification={createNotification} />
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
