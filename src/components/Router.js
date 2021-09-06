import React, { useState } from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import Home from "../routes/Home";
import Login from "../routes/Login";

const Router = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

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
              <Login></Login>
            </Route>
          </>
        )}
      </Switch>
    </HashRouter>
  );
};

export default Router;
