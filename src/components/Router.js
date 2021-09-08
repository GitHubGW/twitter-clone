import React from "react";
import { HashRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Authentication from "routes/Authentication";
import Navigation from "components/Navigation";

const Router = ({ isLoggedIn, userObject }) => {
  return (
    <HashRouter>
      {isLoggedIn && <Navigation />}
      {isLoggedIn ? (
        <Switch>
          <Route exact path="/">
            <Home userObject={userObject} />
          </Route>
          <Route exact path="/profile">
            <Profile userObject={userObject} />
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
