import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import Home from "routes/Home";
import Authentication from "routes/Authentication";

const Router = ({ isLoggedIn }) => {
  return (
    <HashRouter>
      <Switch>
        {isLoggedIn ? (
          <>
            <Route exact path="/">
              <Home></Home>
            </Route>
          </>
        ) : (
          <>
            <Route exact path="/">
              <Authentication></Authentication>
            </Route>
          </>
        )}
      </Switch>
    </HashRouter>
  );
};

export default Router;
