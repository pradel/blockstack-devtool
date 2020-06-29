import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import { Accounts } from "./pages/Accounts";
import { Contracts } from "./pages/Contracts";

export const Router = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path="/" exact>
          <Accounts />
        </Route>
        <Route path="/contracts">
          <Contracts />
        </Route>
      </Switch>
    </HashRouter>
  );
};
