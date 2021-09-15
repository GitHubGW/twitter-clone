import React from "react";
import { HashRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Authentication from "routes/Authentication";
import Navigation from "components/Navigation";

const Router = ({ isLoggedIn, userObject, refreshDisplayName, createNotification, changeTheme }) => {
  return (
    <HashRouter>
      {/* {isLoggedIn && <Navigation userObject={userObject} />} */}
      {isLoggedIn ? (
        <Switch>
          <Route exact path="/">
            <Home userObject={userObject} changeTheme={changeTheme} />
          </Route>
          <Route exact path="/profile">
            <Profile userObject={userObject} refreshDisplayName={refreshDisplayName} createNotification={createNotification} />
          </Route>
          <Redirect from="*" to="/" />
        </Switch>
      ) : (
        <Switch>
          <Route exact path="/">
            <Authentication />
          </Route>
          <Redirect from="*" to="/" />
        </Switch>
      )}
    </HashRouter>
  );
};

export default Router;
